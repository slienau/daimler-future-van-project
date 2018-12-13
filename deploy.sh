#!/bin/bash

set -e

sudo docker-compose build
sudo docker-compose up -d
