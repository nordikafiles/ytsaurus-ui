#!/bin/bash

clusterConfig=./clusters-config.json

if [ ! -f ${clusterConfig} ]; then
  echo "You have to provide '${clusterConfig}' file before start"
  echo "see clusters-config.json.example for some details"
  echo
  exit 1
fi
