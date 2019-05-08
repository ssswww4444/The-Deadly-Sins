import json

# bounding box file
bounding = {}
bounding["Victoria"] = "140.961681984, -39.159189527500004, 149.976679008, -33.9806475865"
bounding["Australia"] = "96.81676569599999, -43.740509603, 159.109219008, -9.142175977"


with open("bounding_box.json", "w") as f:
    json.dump(bounding, f)

# Twitter API authentication credentials (yunlu)
auth = {}
auth["API_KEY"] = "lmi60axPXTB1XZc7Us7o3PKWE"
auth["API_SECRET"] = "gMkhRWPnnwcUpNhg2QqsADuLC4PR66opqlX1J6srpfBONunR7X"
auth["ACCESS_TOKEN"] = "1107074333698981889-bzffZA2f5djoFeV30veP1oHBLNXeab"
auth["ACCESS_TOKEN_SECRET"] = "CMckhw2NaULIqKnp5DcIqcwJaE1nAyfT2SMqzbnxllGoY"

# # Twitter API authentication credentials (backup: peiyun)
# auth = {}
# auth["API_KEY"] = "lmi60axPXTB1XZc7Us7o3PKWE"
# auth["API_SECRET"] = "gMkhRWPnnwcUpNhg2QqsADuLC4PR66opqlX1J6srpfBONunR7X"
# auth["ACCESS_TOKEN"] = "1107074333698981889-bzffZA2f5djoFeV30veP1oHBLNXeab"
# auth["ACCESS_TOKEN_SECRET"] = "CMckhw2NaULIqKnp5DcIqcwJaE1nAyfT2SMqzbnxllGoY"

# # Twitter API authentication credentials (backup: peiyun2)
# auth = {}
# auth["API_KEY"] = "ztjxHkfm0bHRqntvevUcuIKNh"
# auth["API_SECRET"] = "34EbRodhnIzwpFmNfVVO2DCJ8DBXzDBL1SYi3XEN2Y117gdrIA"
# auth["ACCESS_TOKEN"] = "2977927747-sH3AuRDjXxf0JgL4odNed2jGqCvfnaybPZkUmf8"
# auth["ACCESS_TOKEN_SECRET"] = "QVaI1WE7n5LC8tKTbwyQbOrqoJX4ZwXkdCzKQxGvxFEbt"

with open("twitterAPI_auth.json", "w") as f:
    json.dump(auth, f)

# DB authentication
db_auth = {}
db_auth["ip"] = "45.113.233.232"
db_auth["port"] = "5984"
db_auth["user"] = "admin" 
db_auth["pwd"] = "123qweasd"
with open("db_auth.json", "w") as f:
    json.dump(db_auth, f)
