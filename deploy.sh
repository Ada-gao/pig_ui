#!/bin/bash

npm run build
docker build --no-cache -t 10.9.60.202/pig/pig-ui .
docker push 10.9.60.202/pig/pig-ui

