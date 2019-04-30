from TwitterAPI.TwitterAPI import TwitterAPI
import json
import argparse
from twitter_db import TweetStore

# json files
JSON_PATH = "json_files/"
DB_AUTH_FILENAME = "db_auth.json"
TWITTER_API_FILENAME = "twitterAPI_auth.json"
BOUNDING_FILENAME = "bounding_box.json"

def get_args():
    """ Obtaining args from terminal """
    parser = argparse.ArgumentParser(description="Processing tweets")
    # filenames
    parser.add_argument("-db", "--db_name", type = str, required = True, help = "Name of Database for storing")
    args = parser.parse_args()
    
    return args

def read_jsons():
    # bounding boxes for twitter stream API
    with open(JSON_PATH + BOUNDING_FILENAME, "r") as f:
        bounding = json.load(f)

    with open(JSON_PATH + DB_AUTH_FILENAME, "r") as f:
        db_auth = json.load(f)

    # Twitter authentication credentials
    with open(JSON_PATH + TWITTER_API_FILENAME, "r") as f:
        api_auth = json.load(f)

    return bounding, db_auth, api_auth

def twitter_streaming(api, storage, bounding):
    # requesting tweets (in bounding box of Victoria)
    for item in api.request("statuses/filter", {"locations": bounding["Victoria"]}):
        if "text" in item:
            print('%s -- %s\n' % (item['user']['screen_name'], item['text']))
            storage.save_tweet(item)    # save tweet to database
        elif 'message' in item:
            print('ERROR %s: %s\n' % (item['code'], item['message']))

def main():

    # get arguments
    args = get_args()

    # read required json files
    bounding, db_auth, api_auth = read_jsons()

    # db url
    url = "http://" + db_auth["user"] + ":" + db_auth["pwd"] 
            + "@" + db_auth["ip"] + ":" + db_auth["port"] + "/"

    # initialise db and twitter api
    storage = TweetStore(args.db_name, url)
    api = TwitterAPI(api_auth["API_KEY"],
                     api_auth["API_SECRET"], 
                     api_auth["ACCESS_TOKEN"], 
                     api_auth["ACCESS_TOKEN_SECRET"])

    # start streaming
    twitter_streaming(api, storage, bounding)

if __name__ == "__main__":
    main()