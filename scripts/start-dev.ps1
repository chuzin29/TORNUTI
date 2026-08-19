# Script para iniciar ambos servidores Tornuti
$root = "C:\Users\Acer\Desktop\TORNUTI"
Write-Host "🚀 Iniciando Tornuti..." -ForegroundColor Cyan

# 1. Iniciar Frontend (Next.js)
Write-Host "Iniciando Frontend Next.js en http://localhost:3000..." -ForegroundColor Green
Start-Job {
    & "C:\nvm4w\nodejs\node.exe" "$using:root\apps\web\node_modules\.bin\next" dev --port 3000
} | Out-Null

# 2. Esperar un momento y luego iniciar Backend
Start-Sleep -Seconds 3

Write-Host "Iniciando Backend NestJS en http://localhost:3001/api..." -ForegroundColor Green
Start-Job {
    & "C:\nvm4w\nodejs\node.exe" "$using:root\apps\api\node_modules\@nestjs\cli\bin\nest.js" start --watch
} | Out-Null

Write-Host "✅ Ambos servidores iniciados"
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend:  http://localhost:3001/api"
Write-Host ""
Write-Host "Presiona Ctrl+C para detener este script (los jobs continuarán)"