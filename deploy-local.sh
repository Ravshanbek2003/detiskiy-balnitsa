#!/bin/bash

# Bu skriptni serverda ishga tushiring
# Server: jayron.edumir.uz

echo "🚀 Starting deployment..."

cd ~/jorabayeva-balnitsa-backend || exit 1

echo "📥 Pulling latest changes..."
git pull origin main --rebase

echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

echo "🔨 Building project..."
yarn build

echo "🔄 Restarting PM2..."
pm2 restart jorabayeva-balnitsa-backend

echo "✅ Deployment completed successfully!"
pm2 status
