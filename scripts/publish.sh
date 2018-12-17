#!/bin/bash

set -e

echo "triggering deploy..."
scp scripts/deploy.sh azure-user@40.89.153.255:~/
ssh azure-user@40.89.153.255 /home/azure-user/deploy.sh
