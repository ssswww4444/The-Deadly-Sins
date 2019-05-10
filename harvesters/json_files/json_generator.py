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

# Twitter API authentication credentials (backup: peiyun)
auth2 = {}
auth2["API_KEY"] = "umcl91rU7Fmilve4vgR0dP83B"
auth2["API_SECRET"] = "arF65S49ZkLsadHbZDRPOkJ670oUvjfy3ZKytGDfLVP9jhXfmX"
auth2["ACCESS_TOKEN"] = "1125364739901542400-RMbv39gAxburIpXp77kmzVa8NLzVXU"
auth2["ACCESS_TOKEN_SECRET"] = "nUiCc3XlayEu6vHcYPGb84lbMj9rjufel5VzIWD9xrBjE"

# Twitter API authentication credentials (backup: peiyun2)
auth3 = {}
auth3["API_KEY"] = "ztjxHkfm0bHRqntvevUcuIKNh"
auth3["API_SECRET"] = "34EbRodhnIzwpFmNfVVO2DCJ8DBXzDBL1SYi3XEN2Y117gdrIA"
auth3["ACCESS_TOKEN"] = "2977927747-sH3AuRDjXxf0JgL4odNed2jGqCvfnaybPZkUmf8"
auth3["ACCESS_TOKEN_SECRET"] = "QVaI1WE7n5LC8tKTbwyQbOrqoJX4ZwXkdCzKQxGvxFEbt"

# Twitter API authentication credentials (backup: yiming)
auth4 = {}
auth4["API_KEY"] = "RoNj2UcECKDVxnRhFvcJ3bW9S"
auth4["API_SECRET"] = "6DrixbBse58Ww7ivjD9Yyd3sPK86jUQR7m8IDAXReAjuzVQ38E"
auth4["ACCESS_TOKEN"] = "795057335576260608-XDDqj7vsuBDZMY5npJGrdga7Or2N64y"
auth4["ACCESS_TOKEN_SECRET"] = "HPxQiZlRyHqAhXVFdlBqG6JmSxQifXjviPx0OFXSFfUQe"

# Twitter API authentication credentials (backup: wenqi)
auth5 = {}
auth5["API_KEY"] = "4rxjHN4Q2AMm4Dt8LWuiCaNp0"
auth5["API_SECRET"] = "GAPYvl6PEcNBNDFVXUitV7GjHqxyGuisIOCU2dfNOC7FkGBVhy"
auth5["ACCESS_TOKEN"] = "2777892471-KsI1jGELeDRpv1cyh25mh0mWYEkMwnivz4tXOj1"
auth5["ACCESS_TOKEN_SECRET"] = "5tT4I6BHljk7j1dYGek29pbuGlgSuXlb9PKNSiwWiCANx"


key_dict = {"keys": [auth, auth2, auth3, auth4, auth5]}

with open("twitterAPI_auth.json", "w") as f:
    json.dump(key_dict, f)

# DB authentication
db_auth = {}
db_auth["ip"] = "45.113.233.232"
db_auth["port"] = "5984"
db_auth["user"] = "admin" 
db_auth["pwd"] = "123qweasd"
with open("db_auth.json", "w") as f:
    json.dump(db_auth, f)
