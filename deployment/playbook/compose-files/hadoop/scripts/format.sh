sudo docker exec -it $(sudo docker ps | grep hadoop_master | awk '{print $1}') bin/bash -c '/usr/local/hadoop-2.9.2/bin/hdfs namenode -format'
