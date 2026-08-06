#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.production ]]; then
  echo "Создай .env.production из deploy/.env.production.example и задай JWT_SECRET"
  exit 1
fi

echo "==> Сборка фронтенда (API через /api на том же домене)"
npm ci || npm install
npm run build

echo "==> Запуск PostgreSQL + backend + nginx"
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

echo ""
echo "Готово. Открой: http://93.77.164.66"
echo "Health:       http://93.77.164.66/health"
