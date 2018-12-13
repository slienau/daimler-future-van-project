#!/bin/bash

set -e

cd pasws18-backend
git pull origin development

sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
