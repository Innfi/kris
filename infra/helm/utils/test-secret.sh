#!/bin/sh
kubectl create secret docker-registry regcred \
--docker-server=${ECR_REPO} \
--docker-username=AWS \
--docker-password=${aws ecr get-login-password}
--namespace default