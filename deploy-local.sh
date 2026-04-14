#!/bin/bash

 

echo "🚀 Starting deployment..."

cd ~/detiskiy-balnisa || exit 1

echo "📥 Pulling latest changes..."
git pull origin main --rebase

echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

echo "🔨 Building project..."
yarn build

echo "🔄 Restarting PM2..."
pm2 restart detiskiy-balnisa

echo "✅ Deployment completed successfully!"
pm2 status
