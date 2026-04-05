#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -f "$root/.env" ]; then
    cp "$root/.env.example" "$root/.env"

    if [ -n "${OPENROUTER_API_KEY:-}" ]; then
        sed -i "s|^OPENROUTER_API_KEY=$|OPENROUTER_API_KEY=${OPENROUTER_API_KEY}|" "$root/.env"
    fi

    echo "Created .env from .env.example"
fi

if [ ! -e "$root/backend/.env" ]; then
    ln -s ../.env "$root/backend/.env"
fi
