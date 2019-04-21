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

