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
