# Front End
Maintainer: 
- Yiming Zhang \<yimingz8@student.unimelb.edu.au\>

## To deploy
- For stand alone deployment, copy the file in src to the `html` folder of nginx or `www` folder of apache
- To deploy in docker swarm mode, simple copy everything to the master node and run 
```bash
$ sudo docker stack deploy -c docker-compose.yml website
```  

## File structure
```
frontend/
├── docker-compose.yml
├── Dockerfile
├── etc                 -> Nginx configurations
│   ├── nginx-master
│   └── nginx-slave
├── README.md
└── src
    ├── app.js          -> Api calls, logics, plots
    ├── assets          -> Static resources
    ├── index.html
    └── style.css

```