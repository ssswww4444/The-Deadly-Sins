echo "Formatting master node"
sudo docker exec -it hadoop_master_1 bin/bash -c '$HADOOP_HOME/bin/hdfs namenode -format'
echo "Formatting slave node 1"
sudo docker exec -it hadoop_slave_1_1 bin/bash -c '$HADOOP_HOME/bin/hdfs namenode -format'
echo "Formatting slave node 2"
sudo docker exec -it hadoop_slave_2_1 bin/bash -c '$HADOOP_HOME/bin/hdfs namenode -format'
echo "Formatting slave node 3"
sudo docker exec -it hadoop_slave_3_1 bin/bash -c '$HADOOP_HOME/bin/hdfs namenode -format'