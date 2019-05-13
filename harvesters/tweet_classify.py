import json
import argparse
from db import TweetStore

# json files
JSON_PATH = "json_files/"
FILE_DICT = {
    "db_auth": "db_auth.json",
}

def get_args():
    """ Obtaining args from terminal """
    parser = argparse.ArgumentParser(description="Add senpy to all docs in the db")

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

    try:
        for doc_id in db:
                    
            doc = db[doc_id]
            if "emotion" not in doc.keys():
                dicts = doc["senpy"]["entries"][0]["onyx:hasEmotionSet"][0]["onyx:hasEmotion"]
                doc["emotion_score"] = 0
                for emotion_dict in dicts:
                    if emotion_dict["onyx:hasEmotionIntensity"] > doc["emotion_score"]:
                        doc["emotion"] = emotion_dict["onyx:hasEmotionCategory"]
                        doc["emotion_score"] = emotion_dict["onyx:hasEmotionIntensity"]

                db[doc_id] = doc
                print("UPDATE DOC ", doc["_id"])
    except:
        # done
        pass

if __name__ == "__main__":
    main()