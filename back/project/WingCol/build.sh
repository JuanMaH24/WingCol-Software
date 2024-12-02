#!/bin/bash

# Build the project
echo "Building the project..."
echo "Building the project..."
curl -L -o get-pip.py https://bootstrap.pypa.io/get-pip.py
python3.9 get-pip.py
python3.9 -m pip install -r requirements.txt

echo "Make Migration..."
python3.9 manage.py makemigrations --noinput
python3.9 manage.py migrate --noinput

echo "Collect Static..."
python3.9 manage.py collectstatic --noinput --clear