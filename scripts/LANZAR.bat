@echo off
title 🚀 Tornuti - Lanzando la plataforma universal de torneos
color 0A

cls
echo ============================================
echo  🏈 TORNUTI - LANZANDO PLATAFORMA
echo ============================================
echo.
echo  Verificando entorno...
echo.

:: Verificar Node.js (ruta correcta)
set NODE_PATH=C:\nvm4w\nodejs\node.exe
"%NODE_PATH%" --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no encontrado en la ruta esperada
    echo Ubicación actual: C:\nvm4w\nodejs\node.exe
    pause
    exit /b
)
echo ✅ Node.js v20+ detectado

:: Verificar backend
cd /d C:\Users\Acer\Desktop\TORNUTI\apps\api
if not exist .env (
    echo ⚠️ Archivo .env no encontrado en apps/api/
    echo Copiando .env ejemplo...
    copy .env.example .env
    echo.
    echo IMPORTANTE: Edita apps/api/.env con tu DATABASE_URL de Neon
    pause
    exit /b
)

echo ✅ Estructura backend verificada

:: Verificar frontend
cd /d C:\Users\Acer\Desktop\TORNUTI\apps\web
if not exist node_modules (
    echo ❌ node_modules no encontrado en frontend
    echo Ejecutando npm install...
    call :install_npm
)

echo ✅ Estructura frontend verificada

echo.
echo ============================================
echo  Iniciando servidores Tornuti
echo ============================================
echo.

:: Iniciar backend en nuevo terminal usando la ruta correcta
start "Tornuti-Backend" cmd /k "cd C:\Users\Acer\Desktop\TORNUTI\apps\api && %NODE_PATH% ..\..\node_modules\@nestjs\cli\bin\nest.js start --watch"

:: Esperar un momento
timeout /t 3 /nobreak >nul

:: Iniciar frontend en nuevo terminal
start "Tornuti-Frontend" cmd /k "cd C:\Users\Acer\Desktop\TORNUTI\apps\web && %NODE_PATH% .\node_modules\.bin\next dev --port 3000"

echo.
echo ============================================
echo  🎉 Tornuti está iniciándose!
echo ============================================
echo.
echo  Frontend:  http://localhost:3000
echo  Backend:   http://localhost:3001/api
echo.
echo  ¡Tu plataforma universal de torneos ya está lista!
echo.
echo  Para acceder:
echo  1. Abre tu navegador y ve a http://localhost:3000
echo  2. El backend API estará en http://localhost:3001/api
echo.
echo  Presiona Cualquier tecla para continuar o Cierra los terminals manualmente
echo.
pause >nul
exit /b

:: Subrutina para instalar npm
:install_npm
npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando npm
    pause
    exit /b
)
echo ✅ npm install completado
exit /b