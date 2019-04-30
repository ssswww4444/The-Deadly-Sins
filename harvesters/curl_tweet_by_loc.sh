#!/bin/bash
if [ ! -d "tmp" ]; then
  mkdir "tmp"
fi
curl -XGET "http://45.113.232.90/couchdbro/twitter/_design/twitter/_list/geojson/geoindex?reduce=false" \
-G \
--data-urlencode 'start_key=["r1r0",null,null,null]' \
--data-urlencode 'end_key=["r1r1",{},{},{}]' \
--user "readonly:ween7ighai9gahR6" \
-o tmp/tweet_by_loc.json