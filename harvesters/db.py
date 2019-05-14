import couchdb
from couchdb import design
import json
import requests
from textblob import TextBlob

class TweetStore(object):

    def __init__(self, dbname, url):
        """ create a tweet store(db) or open an existing db """
        try:
            self.server = couchdb.Server(url=url)
            # new db
            self.db = self.server.create(dbname)
            # initialise views
            self._create_views()
        except couchdb.http.PreconditionFailed:
            # existing db
            self.db = self.server[dbname]
    
    def _create_views(self):
        """ create 2 default views for the database """
        # view 1: return total count of tweets
        count_map = "function(doc) { emit(doc.id,1); }"
        count_reduce = "function(keys, values) { return sum(values); }"
        view = design.ViewDefinition("twitter",       # design document
                                     "count_tweets",  # view name
                                     count_map,       # map
                                     reduce_fun=count_reduce)
        
        view.sync(self.db)

        # view 2: return all stored tweet documents
        get_tweets = "function(doc) { emit(('0000000000000000000' + doc.id).slice(-19), doc); }"
        view = design.ViewDefinition("twitter",
                                     "get_tweets",
                                     get_tweets)
        view.sync(self.db)

    def _emotion(self, tweet_text):
        res = requests.get('http://senpy.gsi.upm.es/api/emotion-depechemood', 
                            params={"input": tweet_text})
        return json.loads(res.text)

    def _sentiment(self, tweet_text):
        return TextBlob(tweet_text).sentiment

    def get_db(self):
        return self.db

    def save_tweet(self, tweet):
        """ save tweet returned by twitter with tweet id as doc_id """

        try:
            tid = tweet["id_str"]
            tweet["_id"] = tid

            if tid in self.db:
                # updating
                doc = self.db[tid]
                if "senpy" not in doc.keys() or doc["senpy"] == None:
                    # update with senpy
                    doc["senpy"] = self._emotion(doc["text"])
                if "textblob" not in doc.keys() or doc["textblob"] == None:
                    # update with textblob
                    doc["textblob"] = self._sentiment(doc["text"])
                self.db[tid] = doc
                print("UPDATE DOC ", tid)
            else:
                # new doc
                if "_rev" in tweet:
                    # rev from other db
                    tweet.pop("_rev")
                if tweet["coordinates"]:
                    # only save tweets with coordinates
                    tweet["senpy"] = self._emotion(tweet["text"])
                    tweet["textblob"] = self._sentiment(tweet["text"])
                    self.db.save(tweet)
                    print("NEW DOC ", tid)
        except Exception as e:
            print("ERROR: ", str(e))
            pass

    def count_tweets(self):
        """ method for returning view 1 """
        for doc in self.db.view("twitter/count_tweets"):
            return doc.values
    
    def get_tweets(self):
        """ method for returning view 2 """
        return self.db.view("twitter/get_tweets")