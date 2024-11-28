Запуск проекта на лакальной машине:
  1. Frontend
     
    1) cd internet-store-frontend
    2) npm install
    3) npm run dev
  3. Backned

    1) cd internetStore
    2) python manage.py makemigrations
    3) python manage.py migrate
    4) export DJANGO_SETTINGS_MODULE=internetStore.settings
    5) uvicorn internetStore.asgi:application --reload
  5. PostgreSQL
  6. Redis-server
