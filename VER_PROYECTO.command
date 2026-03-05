#!/bin/bash
# Script de inicio robusto para LLDM Rodeo Board
cd "$(dirname "$0")"
LOG_FILE="inicio_error.txt"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "-----------------------------------------------"
echo "🚀 Iniciando el Servidor de LLDM Rodeo Board..."
echo "📅 $(date)"

# Configurar ruta de Node (Pinokio)
export PATH="/Users/hardglobal/pinokio/bin/miniconda/bin:$PATH"

# Verificar si estamos en la carpeta correcta o necesitamos entrar a la subcarpeta
if [ ! -d "node_modules" ] && [ -d "lldm-rodeo-board/node_modules" ]; then
    echo "📂 Entrando a la subcarpeta del proyecto..."
    cd lldm-rodeo-board
fi

if [ ! -d "node_modules" ]; then
    echo "❌ ERROR: No se encontró la carpeta 'node_modules'."
    echo "Asegúrate de ejecutar este archivo desde la carpeta donde está el proyecto."
    echo "Presiona cualquier tecla para cerrar..."
    read -n 1
    exit 1
fi

echo "✨ Iniciando 'npm run dev'..."
npm run dev &

echo "⏳ Esperando a que el servidor esté listo..."
sleep 10

echo "🌐 Abriendo navegador..."
open http://localhost:3000/admin
open http://localhost:3000/display

echo "✅ Proceso completado. No cierres esta ventana."
echo "-----------------------------------------------"
