@echo off
cd server
echo Instalando dependencias si es necesario...
call npm install
echo.
echo Iniciando servidor de musica...
npm start
pause
