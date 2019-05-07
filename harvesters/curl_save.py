import json
import argparse
from twitter_db import TweetStore
import os
import subprocess
import sys

# json files
JSON_PATH = "json_files/"
DATA_PATH = "/mnt/twitter/"
BASH_PATH = "bash_files/"
FILE_DICT = {
    "db_auth": "db_auth.json"
    "loc": "tweet_by_loc.json"
    "date": "tweet_by_date.json"
    "loc_bash": "curl_tweet_by_date.sh"
    "date_bash": "curl_tweet_by_date.sh"
}

def get_args():
    """ Obtaining args from terminal """
    parser = argparse.ArgumentParser(description="Curl tweets from DB and save to another DB")
    # filenames
    parser.add_argument("-db", "--db_name", type = str, required = True, 
                        help = "Name of Database for storing")
    parser.add_argument("-y", "--year", type = str, required = True, 
                        help = "Year of tweets to get")
    parser.add_argument("-m", "--month", type = str, required = True, 
                        help = "Month of tweets to get")
    args = parser.parse_args()
    
    return args

def curl_by_loc():
    """ Curl tweets by location """
    if os.path.exists(DATA_PATH + FILE_DICT["loc"]):
        return
    subprocess.call(["bash", BASH_PATH + FILE_DICT["loc_bash"]])

def curl_by_date(year, month):
    """ Curl tweets by date """
    if os.path.exists(DATA_PATH + FILE_DICT["date"]):
        return
    subprocess.call(["bash", BASH_PATH + FILE_DICT["date_bash"], year, month])

def read_jsons():
    """ Read required json data files """
    with open(JSON_PATH + FILE_DICT["db_auth"], "r") as f:
        db_auth = json.load(f)

    return db_auth

def read_tweets(filename, storage, year, month):
    """ read each tweet from file and save to db """
    filename = DATA_PATH + filename[:-5] + f"_{args.year}_{args.month}" + ".json"
    with open(filename, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):

            # first / last line
            if i == 0 or line[0] != "{":
                continue

            # load cotent and save
            tweet = json.loads(fix_line(line))
            storage.save_tweet(tweet["doc"])
                
        f.close()

def main():

    # get arguments
    args = get_args()

    db_auth = read_jsons()
    
    # db url
    url = "http://" + db_auth["user"] + ":" + db_auth["pwd"] \
            + "@" + db_auth["ip"] + ":" + db_auth["port"] + "/"

    # initialise DB
    storage = TweetStore(args.db_name, url)

    # curl if no json files found
    # curl_by_loc()
    curl_by_date(args.year, args.month)

    # read each json file and upload to db
    # read_tweets(FILE_DICT["loc"], storage, args)
    read_tweets(FILE_DICT["date"], storage, args)

if __name__ == "__main__":
    main()