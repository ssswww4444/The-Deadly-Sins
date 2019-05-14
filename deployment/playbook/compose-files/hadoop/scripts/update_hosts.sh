sudo docker exec -it   $(sudo docker ps | grep hadoop_master | awk '{print $1}')  bin/bash -c " cat /etc/new_hosts >> /etc/hosts"
sudo docker exec -it   $(sudo docker ps | grep hadoop_slave_1 | awk '{print $1}')  bin/bash -c " cat /etc/new_hosts >> /etc/hosts"
sudo docker exec -it   $(sudo docker ps | grep hadoop_slave_2 | awk '{print $1}')  bin/bash -c " cat /etc/new_hosts >> /etc/hosts"
sudo docker exec -it   $(sudo docker ps | grep hadoop_slave_3 | awk '{print $1}')  bin/bash -c " cat /etc/new_hosts >> /etc/hosts"