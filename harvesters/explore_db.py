from TwitterAPI.TwitterAPI import TwitterAPI
import json
import argparse
from db import TweetStore
import sys
import threading

# json files
JSON_PATH = "json_files/"
FILE_DICT = {
    "db_auth": "db_auth.json",
    "twitter_api": "twitterAPI_auth.json"
}

uid_ls = []

def get_args():
    """ Obtaining args from terminal """
    parser = argparse.ArgumentParser(description="Processing tweets")
    # filenames
    parser.add_argument("-fdb", "--from_db", type = str, required = True, 
                        help = "Name of Database for exploring")
    parser.add_argument("-tdb", "--to_db", type = str, required = True, 
                        help = "Name of Database for stroing")

    args = parser.parse_args()
    
    return args

def read_jsons():
    """ Read required json files """

    with open(JSON_PATH + FILE_DICT["db_auth"], "r") as f:
        db_auth = json.load(f)

    # Twitter authentication credentials
    with open(JSON_PATH + FILE_DICT["twitter_api"], "r") as f:
        api_auths = json.load(f)["keys"]

    return db_auth, api_auths

def twitter_user_timeline(apis, storage):
    """ Getting tweets from user timeline """

    api = apis[0]
    i = 0

    while True:
        # wait until has task
        if(len(uid_ls) == 0):
            continue

        # requesting timeline
        uid = uid_ls.pop(0)

        try:
            for item in api.request("statuses/user_timeline", {"user_id": uid, "count": 200}):
                if "text" in item:
                    print('USER: %s -- %s\n' % (item['user']['screen_name'], item['text']))
                    # save tweet to database
                    storage.save_tweet(item)
                elif 'message' in item:
                    print('ERROR %s: %s\n' % (item['code'], item['message']))
        except:
            # exceed limit: switch to next api
            i += 1
            if i == len(apis):
                i = 0
            api = apis[i]


def db_exploring(api, from_db, to_storage):
    for doc_id in from_db:
        doc = from_db[doc_id]
        uid_ls.append(doc["user"]["id"])
        to_storage.save_tweet(doc)

def main():

    # get arguments
    args = get_args()

    # read required json files
    db_auth, api_auths = read_jsons()

    # db url
    url = "http://" + db_auth["user"] + ":" + db_auth["pwd"] \
                    + "@" + db_auth["ip"] + ":" + db_auth["port"] + "/"

    # initialise db and twitter api
    from_db = TweetStore(args.from_db, url).get_db()
    to_storage = TweetStore(args.to_db, url).get_db()

    # one for streaming
    apis = []

    for api_auth in api_auths:
        api = TwitterAPI(api_auth["API_KEY"],
                     api_auth["API_SECRET"], 
                     api_auth["ACCESS_TOKEN"], 
                     api_auth["ACCESS_TOKEN_SECRET"])
        apis.append(api)

    t1 = threading.Thread(target=db_exploring, args=(apis[0], from_db, to_storage))
    t2 = threading.Thread(target=twitter_user_timeline, args=(apis[1:], to_storage))

    # start streaming and getting timelines
    t1.start()
    t2.start()

if __name__ == "__main__":
    main()