#!/bin/bash

set -e

echo "triggering deploy..."
scp scripts/deploy.sh azure-user@40.89.170.229:~/
ssh azure-user@40.89.170.229 /home/azure-user/deploy.sh
