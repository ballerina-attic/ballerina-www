#!/usr/bin/env bash

pushd cron_jobs > /dev/null 2>&1
    kubectl create ns ballerina-playground
    kubectl create serviceaccount bpg-controller-sa -n ballerina-playground
    kubectl create clusterrolebinding bpg-controller-sa-edit-binding --clusterrole=edit --serviceaccount=ballerina-playground:bpg-controller-sa

    envsubst < mincheck-cron.yaml | kubectl create -n ballerina-playground -f -
popd > /dev/null 2>&1