#!/bin/sh
docker run -d --name innfisrabbit -p 5672:5672 --restart=unless-stopped rabbitmq

