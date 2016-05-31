#!/bin/bash
source /data/env
eval "$(weave proxy-env)"

docker build -t grief-mail .
docker stop grief-mail
docker rm grief-mail
docker run -d --name grief-mail \
				-p 5099:5000 \
        -e VIRTUAL_HOST="$GRIEF_MAIL" \
        grief-mail
