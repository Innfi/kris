#!/bin/sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install argocd-release my-repo/argo-cd -n argocd