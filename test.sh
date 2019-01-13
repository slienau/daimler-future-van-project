#!/bin/bash

sudo docker-compose build
sudo docker-compose up -d

sleep 5

npm run integration-tests
