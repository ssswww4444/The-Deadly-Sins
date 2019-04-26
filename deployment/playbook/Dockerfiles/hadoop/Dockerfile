FROM wylswz/hadoop_base

ENV JAVA_HOME /usr/lib/jvm/java-8-oracle/
ENV HADOOP_HOME /usr/local/hadoop-2.9.2
ENV PATH $PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

ENV HADOOP_PREFIX $HADOOP_HOME
ENV HADOOP_COMMON_HOME $HADOOP_HOME
ENV HADOOP_HDFS_HOME $HADOOP_HOME
ENV HADOOP_MAPRED_HOME $HADOOP_HOME
ENV HADOOP_YARN_HOME $HADOOP_HOME
ENV HADOOP_CONF_DIR $HADOOP_HOME/etc/hadoop
ENV YARN_CONF_DIR $HADOOP_PREFIX/etc/hadoop
RUN wget -qO- https://archive.apache.org/dist/hadoop/common/hadoop-2.9.2/hadoop-2.9.2.tar.gz | tar -xz -C /usr/local/

    # Decompress the hadoop files to /usr/local
    
    # Config files are under /usr/local/hadoop-2.9.2/etc/hadoop/
    # core-site.xml
    # hadoop-env.sh
    # yarn-env.sh
    # mapred-site.xml
    # yarn-site.xml
    # slaves
    # hdfs-site.xml
RUN apt update
RUN apt install curl -y
RUN apt install ssh -y
RUN apt install vim -y
RUN echo "root:admin" | chpasswd
RUN mkdir -p /data/hadoop/hdfs/data
RUN mkdir -p /data/hadoop/hdfs/name
RUN mkdir -p /data/hadoop/yarn/local
RUN mkdir -p /data/tmp/logs
RUN mkdir /shared
RUN export JAVA_HOME=/usr/lib/jvm/java-8-oracle


