#!/bin/sh
helm repo add fluent https://fluent.github.io/helm-charts
helm install fluent-bit fluent/fluent-bit -n fluent-bit
helm show values fluent/fluent-bit
