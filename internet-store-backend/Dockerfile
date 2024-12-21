# Используем официальный Python образ
FROM python:3.12-slim as builder

# Отключаем создание .pyc файлов
ENV PYTHONDONTWRITEBYTECODE 1

# Убеждаемся, что вывод логов сразу идет в консоль (без буферизации)
ENV PYTHONUNBUFFERED 1

# Обновляем pip
RUN pip install --upgrade pip

# Копируем requirements.txt и устанавливаем зависимости
COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install -r requirements.txt

# Основной образ
FROM python:3.12-slim

# Добавляем пользователя developer до выполнения chown
RUN useradd -ms /bin/bash developer

# Копируем виртуальное окружение
COPY --from=builder /opt/venv /opt/venv

# Копируем проект в контейнер
COPY internetStore internetStore
WORKDIR /internetStore

# Устанавливаем права доступа для всех (для разработки, можно заменить 777 на более безопасный режим позже)
RUN chmod -R 777 /internetStore

# Убедимся, что директория /internetStore/media имеет права для всех
RUN chmod -R 777 /internetStore/media

# Даем права пользователю developer на все содержимое
RUN chown -R developer:developer /internetStore /internetStore/media

# Делаем скрипт migrate.sh исполнимым
RUN chmod +x migrate.sh

# Используем этого пользователя для дальнейших команд
USER developer

# Устанавливаем путь к виртуальному окружению
ENV PATH="/opt/venv/bin:$PATH"

# Устанавливаем Django settings
ENV DJANGO_SETTINGS_MODULE="internetStore.settings"

# Запуск скрипта migrate.sh как ENTRYPOINT
ENTRYPOINT [ "/internetStore/migrate.sh" ]

# CMD для запуска Uvicorn (асинхронный сервер для Django)
CMD ["uvicorn", "internetStore.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--reload", "--forwarded-allow-ips=*", "--proxy-headers"]
