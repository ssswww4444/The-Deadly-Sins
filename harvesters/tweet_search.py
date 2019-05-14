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
    parser.add_argument("-db", "--db_name", type = str, required = True, 
                        help = "Name of Database for storing")
    parser.add_argument("-q", "--query", type = str, required = True, 
                        help = "Query")

    args = parser.parse_args()
    
    return args

def read_jsons():
    """ Read required json files """
    with open(JSON_PATH + FILE_DICT["db_auth"], "r") as f:
        db_auth = json.load(f)

    # Twitter authentication credentials
    with open(JSON_PATH + FILE_DICT["twitter_api"], "r") as f:
        api_auth = json.load(f)["keys"][0]

    return db_auth, api_auth

def twitter_search(api, storage, query):
    """ Real-time twitter streaming """
    # requesting tweets (in melbourne)
    for item in api.request("search/tweets", {"q": query, 
                                              "count": 100, 
                                              "lang": "en", 
                                              "geocode": "-37.8390435045,145.106023031,201km"}):
        if "text" in item:
            print('SEARCH: %s -- %s\n' % (item['user']['screen_name'], item['text']))
            # save tweet to database
            storage.save_tweet(item)
        elif 'message' in item:
            print('ERROR %s: %s\n' % (item['code'], item['message']))

def main():

    # get arguments
    args = get_args()

    # read required json files
    db_auth, api_auth = read_jsons()

    # db url
    url = "http://" + db_auth["user"] + ":" + db_auth["pwd"] \
                    + "@" + db_auth["ip"] + ":" + db_auth["port"] + "/"

    # initialise db and twitter api
    storage = TweetStore(args.db_name, url)
    api = TwitterAPI(api_auth["API_KEY"],
                     api_auth["API_SECRET"], 
                     api_auth["ACCESS_TOKEN"], 
                     api_auth["ACCESS_TOKEN_SECRET"])

    twitter_search(api, storage, args.query)

if __name__ == "__main__":
    main()