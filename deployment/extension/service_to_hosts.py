import docker

#sl[4].attrs['Spec']['TaskTemplate']['ContainerSpec']['Hostname']
#sl[4].attrs['Endpoint']['VirtualIPs']

client = docker.DockerClient()
services = client.services.list()
for s in services:
    hostname = s.attrs['Spec']['TaskTemplate']['ContainerSpec']['Hostname']
    ips = s.attrs['Endpoint']['VirtualIPs'][-1]['Addr'].split('/')[0]
    print("{0}\t{1}".format(ips,hostname))