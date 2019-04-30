import json

JSON_PATH = "json_files/"

# bounding box file
bounding = {}
bounding["Victoria"] = "140.961681984, -39.159189527500004, 149.976679008, -33.9806475865"
bounding["Australia"] = "96.81676569599999, -43.740509603, 159.109219008, -9.142175977"


with open(JSON_PATH + "bounding_box.json", "w") as f:
    json.dump(bounding, f)

# Twitter API authentication credentials
auth = {}
auth["API_KEY"] = "lmi60axPXTB1XZc7Us7o3PKWE"
auth["API_SECRET"] = "gMkhRWPnnwcUpNhg2QqsADuLC4PR66opqlX1J6srpfBONunR7X"
auth["ACCESS_TOKEN"] = "1107074333698981889-bzffZA2f5djoFeV30veP1oHBLNXeab"
auth["ACCESS_TOKEN_SECRET"] = "CMckhw2NaULIqKnp5DcIqcwJaE1nAyfT2SMqzbnxllGoY"

with open(JSON_PATH + "twitterAPI_auth.json", "w") as f:
    json.dump(auth, f)

# DB authentication
db_auth = {}
db_auth["ip"] = "45.113.233.232"
db_auth["port"] = "5984"
db_auth["user"] = "admin" 
db_auth["pwd"] = "123qweasd"
with open(JSON_PATH + "db_auth.json", "w") as f:
    json.dump(db_auth, f)
