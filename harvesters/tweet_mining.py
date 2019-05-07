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
    "twitter_api": "twitterAPI_auth.json",
    "bounding": "bounding_box.json",
}
uid_ls = []

def get_args():
    """ Obtaining args from terminal """
    parser = argparse.ArgumentParser(description="Processing tweets")
    # filenames
    parser.add_argument("-db", "--db_name", type = str, required = True, 
                        help = "Name of Database for storing")
    parser.add_argument("-re", "--region", type = str, required = True, 
                        help = "Region for streaming (Australia / Victoria)")

    args = parser.parse_args()
    
    return args

def read_jsons():
    """ Read required json files """
    # bounding boxes for twitter stream API
    with open(JSON_PATH + FILE_DICT["bounding"], "r") as f:
        bounding = json.load(f)

    with open(JSON_PATH + FILE_DICT["db_auth"], "r") as f:
        db_auth = json.load(f)

    # Twitter authentication credentials
    with open(JSON_PATH + FILE_DICT["twitter_api"], "r") as f:
        api_auth = json.load(f)

    return bounding, db_auth, api_auth

def twitter_user_timeline(api, storage):
    """ Getting tweets from user timeline """
    while True:
        # wait until has task
        if(len(uid_ls) == 0):
            continue

        # requesting timeline
        uid = uid_ls.pop(0)

        for item in api.request("statuses/user_timeline", {"user_id": uid, "count": 200}):
            if "text" in item:
                print('USER: %s -- %s\n' % (item['user']['screen_name'], item['text']))
                # save tweet to database
                storage.save_tweet(item)
            elif 'message' in item:
                print('ERROR %s: %s\n' % (item['code'], item['message']))

def twitter_streaming(api, storage, bounding, region):
    """ Real-time twitter streaming """
    # requesting tweets (in bounding box of specified region)
    for item in api.request("statuses/filter", {"locations": bounding[region]}):
        if "text" in item:
            print('STREAM: %s -- %s\n' % (item['user']['screen_name'], item['text']))
            # save tweet to database
            storage.save_tweet(item)
            # only get timeline for user tweeted with coordinates
            if item["coordinates"]:
                uid_ls.append(item["user"]["id"])
        elif 'message' in item:
            print('ERROR %s: %s\n' % (item['code'], item['message']))

def main():

    # get arguments
    args = get_args()

    # read required json files
    bounding, db_auth, api_auth = read_jsons()

    # db url
    url = "http://" + db_auth["user"] + ":" + db_auth["pwd"] \
                    + "@" + db_auth["ip"] + ":" + db_auth["port"] + "/"

    # initialise db and twitter api
    storage = TweetStore(args.db_name, url)
    api = TwitterAPI(api_auth["API_KEY"],
                     api_auth["API_SECRET"], 
                     api_auth["ACCESS_TOKEN"], 
                     api_auth["ACCESS_TOKEN_SECRET"])

    t1 = threading.Thread(target=twitter_streaming, args=(api, storage, bounding, args.region))
    t2 = threading.Thread(target=twitter_user_timeline, args=(api, storage))

    # start streaming and getting timelines
    t1.start()
    t2.start()

if __name__ == "__main__":
    main()