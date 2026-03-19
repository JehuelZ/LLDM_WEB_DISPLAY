#!/bin/bash
# Script de inicio para LLDM Rodeo Board - Local
cd "$(dirname "$0")"

# 🟢 CONFIGURACIÓN PARA PINOKIO (Donde está instalado Node)
export PATH="/Users/hardglobal/pinokio/bin/miniconda/bin:$PATH"

# 🛑 LIMPIAR PUERTOS (Si están ocupados por una ejecución previa)
echo "🔍 Revisando puertos 3000 y 3001..."
lsof -ti:3000,3001 | xargs kill -9 > /dev/null 2>&1

echo "🚀 Iniciando el servidor Next.js..."
# Usar el puerto 3000 por defecto pero matar al anterior
npm run dev -- -p 3000 &

# ⏳ ESPERAR A QUE ESTÉ LISTO
echo "⏳ Esperando 8 segundos..."
sleep 8

# 🌐 ABRIR EN EL NAVEGADOR
echo "🌐 Abriendo el Proyecto..."
open "http://localhost:3000/admin"
# Opcional: open "http://localhost:3000/luna-preview" si el archivo existe

echo "✅ Listo! No cierres esta ventana mientras uses el proyecto."
