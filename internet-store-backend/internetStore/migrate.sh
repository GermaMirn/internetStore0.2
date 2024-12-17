#!/bin/bash

# Загружаем переменные окружения из .env файла
set -o allexport
source ../../.env
set +o allexport

python manage.py makemigrations

echo "Применение миграций"
python manage.py migrate

python manage.py shell <<EOF
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError

User = get_user_model()

try:
    # Попробуем найти суперпользователя
    user = User.objects.get(username='$SUPERUSER_NAME')
    print("Суперпользователь уже существует")
except ObjectDoesNotExist:
	try:
		# Если не найден, создаем суперпользователя
		user = User.objects.create_superuser(
			username='$SUPERUSER_NAME',
			email='$SUPERUSER_EMAIL',
			password='$SUPERUSER_PASSWORD'
		)
		print("Суперпользователь успешно создан")
	except IntegrityError as e:
		print("Ошибка при создании суперпользователя:", e)
EOF

# Установите пароль суперпользователя через python shell, если он не был установлен
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
try:
	user = User.objects.get(username='$SUPERUSER_NAME')
	if not user.check_password('$SUPERUSER_PASSWORD'):
		user.set_password('$SUPERUSER_PASSWORD')
		user.save()
		print("Пароль для суперпользователя обновлен")
except User.DoesNotExist:
	print("Суперпользователь не найден, проверьте логи")
EOF

# echo "Сбор статических файлов"
# python manage.py collectstatic --noinput

echo "Миграции успешно применены"
exec "$@"
