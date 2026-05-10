#!/bin/bash
set -euo pipefail

IMAGE="ghcr.io/unkwerror/sphera-guide:latest"
COMPOSE_FILE="/opt/sphera-guide/docker-compose.yml"

echo "==> Logging in to GHCR..."
echo "$GHCR_TOKEN" | docker login ghcr.io -u unkwerror --password-stdin

echo "==> Pulling latest image..."
docker compose -f "$COMPOSE_FILE" pull

echo "==> Starting container..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "==> Cleaning up old images..."
docker image prune -f

echo "==> Done. Site is up at https://sphera-iir.ru"
