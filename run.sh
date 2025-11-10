#!/bin/bash

docker compose --env-file .env.$1.dist up -d --build