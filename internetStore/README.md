export DJANGO_SETTINGS_MODULE=internetStore.settings
uvicorn internetStore.asgi:application --reload
redis-server
