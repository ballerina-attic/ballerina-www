#!/usr/bin/env bash

bash deploy-controller.sh
sleep 3
bash deploy-desiredcheck.sh
sleep 3
bash deploy-maxcheck.sh