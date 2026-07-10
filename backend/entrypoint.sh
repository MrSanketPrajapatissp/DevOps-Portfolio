#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Wait for PostgreSQL database to be ready
if [ -n "$DB_HOST" ]; then
    echo "Checking database connection to $DB_HOST:$DB_PORT..."
    python -c "
import socket
import sys
import time

host = '$DB_HOST'
port = int('$DB_PORT')

print(f'Waiting for database at {host}:{port}...')
for i in range(30):
    try:
        with socket.create_connection((host, port), timeout=2):
            print('Database is online and accepting connections!')
            sys.exit(0)
    except OSError as e:
        print(f'Database not ready yet ({e}). Retrying in 2 seconds ({i+1}/30)...')
        time.sleep(2)
sys.exit(1)
"
fi

# Run Django migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn server
echo "Starting Gunicorn server..."
exec gunicorn portfolio.wsgi:application -c gunicorn.conf.py
