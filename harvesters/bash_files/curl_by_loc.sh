#!/bin/bash
# Usage: sh curl_by_loc.sh
if [ ! -d "/mnt/twitter" ]; then
  mkdir "/mnt/twitter"
fi
curl -XGET "http://45.113.232.90/couchdbro/twitter/_design/twitter/_list/geojson/geoindex?reduce=false" \
-G \
--data-urlencode 'start_key=["r1r0",null,null,null]' \
--data-urlencode 'end_key=["r1r1",{},{},{}]' \
--user "readonly:ween7ighai9gahR6" \
-o /mnt/twitter/tweet_by_loc.json