# The-Deadly-Sins
Clusters and Cloud Computing Assignment 2


## Deployment

### Steps
- Start instance
- Create security group
- Install software packages
- Add ssh-keys to remote hosts
- Initialize docker swarm
- Deploy Couchdb
- Deploy Spark


### Database design decisions
- Single volume, multiple standalone daemons
  - Eazy to deploy
  - Single copy of data, high consistency
  - Shared file system
  - Volume failure may down the entire system
  
- Multiple volume, single cluster
  - Replicas, reliable
  - High availability
  - More copies of data
  - Overhead on network
   
### Spark design decisions

### Hadoop swarm mode deployment

Connection refuse problem:
- Binding container alias for server won't listen to external port
- Binding 0.0.0.0 for worker doesn't locate the server location

Solution:
- Separate master and worker configuration file
- Master bind to 0.0.0.0
- Worker bind to master alias


### Hadoop error logs
- Domain name not found: This is because the address inside the docker is resolved to the container id, which is unknown outside the docker cluster. You need to add the ip and container id in client hosts
- CORS: Config CORS in core-site.xml
- Have to sync name resolution


### Spark error logs
- Yarn mode stuck: Because AM resource limit exceeded. Solution config yarn.scheduler.capacity.maximum-am-resource-percent in yarn-site.xml

http://ae789c5d5b74:50075/webhdfs/v1/test/71e95c19-5457-4e6f-b009-b7030d4ba350.pdf?op=CREATE&namenoderpcaddress=hadoop.master:8020&createflag=&createparent=true&overwrite=false
