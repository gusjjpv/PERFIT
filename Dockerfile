FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# 4. Dependências do Sistema (opcional, mas bom ter)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean

COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

WORKDIR /app/PERFIT

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]