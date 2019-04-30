import json
import argparse
from twitter_db import TweetStore
import os
import subprocess

# json files
DATA_DIR = "/tmp/twitter/"
LOC_FILE = "tweet_by_loc.json"
DATE_FILE = "tweet_by_date.json"
CURL_LOC_BASH = "curl_tweet_by_date.sh"
CURL_DATE_BASH = "curl_tweet_by_date.sh"

def get_args():
    """ Obtaining args from terminal """
    parser = argparse.ArgumentParser(description="Curl tweets from DB and save to another DB")
    # filenames
    parser.add_argument("-db", "--db_name", type = str, required = True, help = "Name of Database for storing")
    args = parser.parse_args()
    
    return args

def curl_by_loc():
    """ Curl tweets by location """
    if os.path.exists(DATA_DIR + LOC_FILE):
        return
    subprocess.call("bash", CURL_LOC_BASH)

def curl_by_date():
    """ Curl tweets by date """
    if os.path.exists(DATA_DIR + DATE_FILE):
        return
    subprocess.call("bash", CURL_DATE_BASH)

def read_jsons():

    with open(JSON_PATH + DB_AUTH_FILENAME, "r") as f:
        db_auth = json.load(f)

    return db_auth

def read_tweets(filename, storage):
    """ read each tweet from file and save to db """
    with open(filename, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):

            # first / last line
            if i == 0 or (i % (size) != rank):  # assign line according to the rank
                continue
            elif line[0] != "{":
                continue

            # load cotent and save
            tweet = json.loads(fix_line(line))
            storage.save_tweet(tweet)
        f.close()

def main():

    # get arguments
    args = get_args()

    db_auth = read_jsons()
    
    # db url
    url = "http://" + db_auth["user"] + ":" + db_auth["pwd"] 
            + "@" + db_auth["ip"] + ":" + db_auth["port"] + "/"

    # initialise DB
    storage = TweetStore(args.db_name, url)

    # curl if no json files found
    curl_by_loc()
    curl_by_date()

    # read each json file and upload to db
    read_tweets(LOC_FILE, storage)
    read_tweets(DATE_FILE, storage)

if __name__ == "__main__":
    main()