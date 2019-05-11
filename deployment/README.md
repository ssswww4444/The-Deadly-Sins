

## Deployment

### File structure
```
deployment/
├── archive                 -> Some of unused codes
├── data_structure_example  -> Some examples of data structures to refer to
├── extension               -> Small pieces of auxilary codes
│   ├── couchdb_cluster_admin.py 
│   ├── service_to_hosts.py
│   └── SparkExample.scala
├── playbook                -> Main dir of playbooks
│   ├── compose-files       -> Docker compose files
│   │   ├── couchdb.yml
│   │   ├── hadoop
│   │   │   ├── docker-compose-swarm.yml
│   │   │   └── scripts     -> scripts to deploy the hadoop cluster
│   │   └── spark
│   │       ├── docker-compose-swarm.yml
│   │       └── docker-compose.yml
│   ├── couchdb_up.yml      -> Start the couchdb cluster without side effects
│   ├── couchdb.yml         -> Copy files, create directories and compose up
│   ├── Dockerfiles
│   ├── docker-swarm.yml
│   ├── env.yml             -> Set up environment for instances
│   ├── etc                 -> Configuration files
│   │   ├── couchdb         
│   │   │   ├── config.ini  -> Couchdb configuration
│   │   │   └── vm.args     -> Couchdb cluster manager configuration
│   │   ├── hadoop-master   -> Hadoop master configuration
│   │   ├── hadoop-slave    -> Hadoop Slave configuration
│   │   ├── spark       
│   │   │   └── spark-defaults.conf
│   │   └── ssh
│   │       └── sshd_config
│   ├── facts.d             -> Infrastructure definitions
│   │   ├── ccc_config.fact -> ccc_config.json
│   │   └── ccc_config.json
│   ├── front-end.yml       -> Playbook for frontend
│   ├── hdfs.yml            -> Playbook for hadoop
│   ├── infrastructure.loop.yml -> Playbook for deploying instances
│   ├── library
│   │   └── dynamic_inventory
│   │       └── openstack_inventory.py
│   ├── security_groups.loop.yml -> Playbook for creating security groups
│   └── spark.yml
├── README.md
├── requirements.txt
├── shs         -> Some commands to be used
└── unimelb-comp90024-group-48-openrc.sh
```
### Steps
- Start instance
- Create security group
- Install software packages
- Add ssh-keys to remote hosts
- Initialize docker swarm
- Deploy Couchdb
  - Create couchdb services with playbook
  - build the cluster using  python library in /extension/couchdb_cluster_admin.py
- Deploy Spark
  - Deploy dhfs along with spark


### How to deploy hadoop & spark?
It's all about configurations. You should carefully configure your master and slave, thinking about the system architecture and network topology. Then send the configure files along with deployment scripts to the server side. Start the hadoop cluster in following order:
- Add ssh_keys to datanodes
- format namenode
- Start dfs
- Start yarn
- Start history service

The Spark can be either deployed in standalone mode or along with cluster managers like Yarn. Again, carefully configure the cluster, send configrations to instances and run deployment script. The cluster should be deployed in following order:
- Start manager
- Join workers to manager


## Notes

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

### hosts generation



### Hadoop error logs
- Domain name not found: This is because the address inside the docker is resolved to the container id, which is unknown outside the docker cluster. You need to add the ip and container id in client hosts
- CORS: Config CORS in core-site.xml. (Unsolved)
- Have to sync name resolution
- xxxauthority: repeated hostname and alias caused the name resolution conflict. Solution: Use different string for alias and hostname
- unexpected eof



### Spark error logs
- Yarn mode stuck: Because AM resource limit exceeded. Solution config yarn.scheduler.capacity.maximum-am-resource-percent in yarn-site.xml, and use aliases to access yarn service instead of public ip
- Submit cannot bind address.

http://ae789c5d5b74:50075/webhdfs/v1/test/71e95c19-5457-4e6f-b009-b7030d4ba350.pdf?op=CREATE&namenoderpcaddress=hadoop.master:8020&createflag=&createparent=true&overwrite=false
