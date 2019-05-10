import json
import argparse
from db import TweetStore
import requests

# json files
JSON_PATH = "json_files/"
FILE_DICT = {
    "db_auth": "db_auth.json",
}

def get_args():
    """ Obtaining args from terminal """
    parser = argparse.ArgumentParser(description="Add senpy to all docs in the db")
    # filenames
    parser.add_argument("-db", "--db_name", type = str, required = True, 
                        help = "Name of Database for storing")
    args = parser.parse_args()
    
    return args

def read_jsons():
    """ Read required json data files """
    with open(JSON_PATH + FILE_DICT["db_auth"], "r") as f:
        db_auth = json.load(f)
    return db_auth

def main():

    # get arguments
    args = get_args()

    db_auth = read_jsons()
    
    # db url
    url = "http://" + db_auth["user"] + ":" + db_auth["pwd"] \
            + "@" + db_auth["ip"] + ":" + db_auth["port"] + "/"

    # initialise DB
    storage = TweetStore(args.db_name, url)

    db = storage.get_db()

    for doc_id in db:
        doc = db[doc_id]
        if "senpy" not in doc.keys():
            res = requests.get('http://senpy.gsi.upm.es/api/emotion-depechemood', 
                                params={"input": doc["text"]})
            doc["senpy"] = json.loads(res.text)
            db[doc_id] = doc
            print("UPDATE DOC ", doc["_id"])

if __name__ == "__main__":
    main()