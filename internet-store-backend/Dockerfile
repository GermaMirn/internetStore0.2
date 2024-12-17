# Используем официальный Python образ
FROM python:3.12-slim as builder

# Отключаем создание .pyc файлов
ENV PYTHONDONTWRITEBYTECODE 1

# Убеждаемся, что вывод логов сразу идет в консоль (без буферизации)
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install -r requirements.txt


FROM python:3.12-slim
COPY --from=builder /opt/venv /opt/venv
COPY internetStore internetStore
WORKDIR /internetStore
RUN chmod +x migrate.sh
RUN useradd -ms /bin/bash developer
USER developer
ENV PATH="/opt/venv/bin:$PATH"
ENV DJANGO_SETTINGS_MODULE="internetStore.settings"
ENTRYPOINT [ "/internetStore/migrate.sh" ]
CMD ["uvicorn", "internetStore.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--reload", "--forwarded-allow-ips=*", "--proxy-headers"]
