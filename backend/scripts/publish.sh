#!/bin/bash

set -e

echo "triggering deploy..."
scp scripts/deploy.sh ubuntu@3.120.249.73:~/
ssh ubuntu@3.120.249.73 /home/ubuntu/deploy.sh
