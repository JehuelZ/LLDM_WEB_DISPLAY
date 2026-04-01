#!/bin/bash
# Script de inicio para LLDM Rodeo Board - Local
# Automatizado por el System Integrity Auditor

export PATH="/Users/hardglobal/pinokio/bin/miniconda/bin:$PATH"

echo "🔍 Liberando el puerto 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "🚀 Iniciando servidor de desarrollo en puerto 3000..."
npm run dev -- -p 3000
