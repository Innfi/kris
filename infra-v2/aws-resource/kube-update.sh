#!/bin/sh

rm ~/.kube/config
aws eks update-kubeconfig --region ap-northeast-2 --name eks-innfi
