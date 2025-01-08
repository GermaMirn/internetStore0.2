# Интернет магазин

---

## Запуск проекта

Для запуска проекта нужно будет запустить Docker и настроить файл `.env` с ngrok(для локалки). Для этого скопируйте файл `.env.example` в `.env` и укажите соответствующие значения переменных. После этого откройте терминал и введите:

```bash
docker compose up --build
```

Настройка ngrok:  заходим к ним на сайт и регистрируемся. Потом создаём домен https://dashboard.ngrok.com/domains. Дальше изменяем на свой домен в файлах: docker-compose-local.yml, ngrok.yml, internet-store-frontend/src/shared/api/axiosInstance.ts, internet-store-backend/internetStore/internetStore/settings.py

В конце вы получите сетевой интерфейс в интернет со своей локальной машины, так же можете всё открыть через http://localhost


## Стек технологий

```
	backend:
		- Django
		- Django rest framework(DRF)
		- Django channels
		- Uvicorn
		- Redis
		- PosgreSQL
		- Docker
		- Nginx
		- Ngrok

	frontend:
		- React
		- TypeScript
		- Vite
```

## Ссылка на дизайн проекта

figma: https://www.figma.com/design/Gve6hZmAXn7mcyVF3oSAPT/%D0%9F%D1%80%D0%BE%D1%8D%D0%BA%D1%82%D0%B8%D0%BA?node-id=0-1&t=gUmnlDEqyAyzLt5I-1
