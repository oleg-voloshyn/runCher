#!/usr/bin/env bash
set -o errexit

echo "==> Installing Node dependencies and building React..."
npm install --prefix frontend
npm run build --prefix frontend

echo "==> Installing Ruby dependencies..."
bundle install

echo "==> Precompiling Rails assets (admin panel)..."
bundle exec rails assets:precompile

echo "==> Running database migrations..."
bundle exec rails db:migrate

echo "==> Build complete!"
