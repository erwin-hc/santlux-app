@echo off

:: Abre o Windows Terminal forçando os títulos
wt -w 0 nt --title "Frontend" -d "C:\Users\erwin-hc\Projetos\santlux-app\frontend" -p "Command Prompt" cmd /k "title Frontend && npm run dev" ; ^
nt --title "Backend" -d "C:\Users\erwin-hc\Projetos\santlux-app\backend" -p "Command Prompt" cmd /k "title Backend && .\.venv\Scripts\activate && python -m uvicorn main:app --reload"