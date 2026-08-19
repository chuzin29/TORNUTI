@echo off
title Tornuti - Plataforma de Torneos
color 0A

cls
echo ============================================
echo  🏈 TORNUTI - Plataforma Universal de Torneos
echo ============================================
echo.

echo  [1] Iniciar Frontend (Next.js)
echo  [2] Iniciar Backend (NestJS)
echo  [3] Iniciar los dos servidores
echo  [0] Salir
echo.
set /p choice="Elige una opción [1-3]: "

if %choice%==1 (
    echo Iniciando Frontend en http://localhost:3000...
    cd /d C:\Users\Acer\Desktop\TORNUTI\apps\web
    echo.
    echo Presiona Ctrl+C para detener este script (el frontend continuará corriendo)
    echo.
    timeout /t 2 /nobreak >nul
    "C:\nvm4w\nodejs\node.exe" C:\Users\Acer\Desktop\TORNUTI\apps\web\node_modules\.bin\next dev --port 3000
)

if %choice%==2 (
    echo Iniciando Backend en http://localhost:3001/api...
    cd /d C:\Users\Acer\Desktop\TORNUTI\apps\api
    echo.
    echo Asegúrate de tener configurado el archivo apps/api/.env con DATABASE_URL
    echo.
    timeout /t 2 /nobreak >nul
    "C:\nvm4w\nodejs\node.exe" C:\Users\Acer\Desktop\TORNUTI\apps\api\node_modules\@nestjs\cli\bin\nest.js start --watch
)

if %choice%==3 (
    echo Iniciando LOS DOS servidores Tornuti...
    echo.
    echo  == Frontend: http://localhost:3000
    echo  == Backend:   http://localhost:3001/api
    echo.
    echo  Abre dos terminals o usa este script con opciones separadas
    echo.
    
    :: Iniciar frontend en background
    start "Tornuti-Frontend" cmd /k "cd C:\Users\Acer\Desktop\TORNUTI\apps\web && "C:\nvm4w\nodejs\node.exe" C:\Users\Acer\Desktop\TORNUTI\apps\web\node_modules\.bin\next dev --port 3000"
    
    :: Esperar 3 segundos para iniciar backend
    timeout /t 3 /nobreak >nul
    
    :: Iniciar backend en background
    start "Tornuti-Backend" cmd /k "cd C:\Users\Acer\Desktop\TORNUTI\apps\api && "C:\nvm4w\nodejs\node.exe" C:\Users\Acer\Desktop\TORNUTI\apps\api\node_modules\@nestjs\cli\bin\nest.js start --watch"
    
    echo.
    echo ¡Ambos servidores iniciados!
    echo Frontend disponible en: http://localhost:3000
    echo Backend disponible en:  http://localhost:3001/api
    echo.
    echo Presiona Cualquier tecla para continuar...
    pause >nul
)

if %choice%==0 (
    echo Saliendo...
    timeout /t 1 /nobreak >nul
)