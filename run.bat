@echo off

:: Abre o Windows Terminal com duas abas no mesmo diretório pai ou específicos
wt -w 0 nt -d "C:\Users\erwin-hc\Projetos\santlux-app\frontend" -p "Command Prompt" cmd /k "npm run dev" ; nt -d "C:\Users\erwin-hc\Projetos\santlux-app\backend" -p "Command Prompt" cmd /k ".\.venv\Scripts\activate && python -m uvicorn main:app --reload"