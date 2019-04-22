sudo docker exec -it $(sudo docker ps  | grep hadoop_master | awk '{print $1}') bin/bash -c 'cd /usr/local/hadoop-2.9.2 \
                                                                                            && ls \
                                                                                            && sbin/start-dfs.sh \
                                                                                            && sbin/start-yarn.sh \
                                                                                            && sbin/mr-jobhistory-daemon.sh start historyserver'