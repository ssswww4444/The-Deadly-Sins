#!bin/bash

sudo docker exec -it   $(sudo docker ps | grep hadoop_master | awk '{print $1}')  bin/bash -c " ssh-keygen -t rsa"
sudo docker exec -it   $(sudo docker ps | grep hadoop_master | awk '{print $1}')  bin/bash -c "ssh-copy-id -i /root/.ssh/id_rsa.pub hadoop.slave.1"
sudo docker exec -it   $(sudo docker ps | grep hadoop_master | awk '{print $1}')  bin/bash -c "ssh-copy-id -i /root/.ssh/id_rsa.pub hadoop.slave.2"
sudo docker exec -it   $(sudo docker ps | grep hadoop_master | awk '{print $1}')  bin/bash -c "ssh-copy-id -i /root/.ssh/id_rsa.pub hadoop.slave.3"