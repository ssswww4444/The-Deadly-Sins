#! /bin/bash


SPARK_SUBMIT_PACKAGES=org.apache.bahir:spark-sql-cloudant_2.11:2.3.2
SPARK_SUBMIT_EXECUTOR_MEMORY=4g

SPARK_CONTAINER_DIR=/tmp/data
SPARK_SHARE_DIR=/mnt/data
RANDOM_=${RANDOM}
WORK_DIR=${SPARK_SHARE_DIR}/JOB_$RANDOM_/
CONTAINER_WORK_DIR=${SPARK_CONTAINER_DIR}/JOB_$RANDOM_/
mkdir -p $WORK_DIR
#ls $SPARK_SHARE_DIR
cp ./* $WORK_DIR
ls $WORK_DIR

sudo docker exec -it   $(sudo docker ps | grep spark | awk '{print $1}') PYSPARK_PYTHON=python3;bin/spark-submit --deploy-mode=client --packages=$SPARK_SUBMIT_PACKAGES --executor-memory=$SPARK_SUBMIT_EXECUTOR_MEMORY $CONTAINER_WORK_DIR/$1

rm -rf $WORK_DIR
