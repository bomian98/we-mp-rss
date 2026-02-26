#!/usr/bin/env bash
set -euo pipefail

# ===== 可根据需要修改的变量 =====
IMAGE_NAME="we-mp-rss:local"
CONTAINER_NAME="we-mp-rss"
HOST_PORT=8001
CONTAINER_PORT=8001

# 如果需要在脚本里顺便 git pull，取消下面注释
# echo ">>> Git pulling latest code..."
# git pull --rebase

echo ">>> Building Docker image: ${IMAGE_NAME}"
docker build -t "${IMAGE_NAME}" .

echo ">>> Stopping & removing old container if exists: ${CONTAINER_NAME}"
if docker ps -a --format '{{.Names}}' | grep -w "${CONTAINER_NAME}" >/dev/null 2>&1; then
  docker stop "${CONTAINER_NAME}" || true
  docker rm "${CONTAINER_NAME}" || true
fi

echo ">>> Running new container: ${CONTAINER_NAME}"
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p ${HOST_PORT}:${CONTAINER_PORT} \
  "${IMAGE_NAME}"

echo ">>> Done. Current containers:"
docker ps --filter "name=${CONTAINER_NAME}"