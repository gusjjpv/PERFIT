# PERFIT
Sistema para personal trainer

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. Docker & Docker Compose:

- Windows/Mac: Instale o Docker Desktop.
- Linux: Instale o `docker` e o plugin `docker-compose-plugin`.

2. Git: Para clonar o repositório.

```shell
git clone https://github.com/gusjjpv/PERFIT.git
```

3. Suba o Projeto

Na raiz do projeto (onde está o arquivo docker-compose.yml), rode:
```shell
# Sobe os containers e mostra os logs no terminal
sudo docker compose up --build
```

### Configurando o Banco de Dados (Essencial)

Com o container rodando (deixe o terminal anterior aberto e abra um novo), execute:

1. Criar as Tabelas (Migrate)
```shell
sudo docker compose exec web python manage.py migrate
```

2. Criar um Usuário Admin (Superuser)
```shell
sudo docker compose exec web python manage.py createsuperuser
```

Siga as instruções para criar seu login e senha.

### Coletar Arquivos Estáticos (CSS do Admin)

Para que o painel admin fique bonito (o Nginx precisa achar o CSS):

```shell
sudo docker compose exec web python manage.py collectstatic --no-input
```

Pronto! Acesse http://localhost/admin e faça login

## Cheatsheet

**Subir o servidor**
```shell
docker compose up
```

**Subir e recontruir**
```shell
docker compose up --build
```

**Parar o servidor**
```shell
Ctrl + C
```

**Rodar Migrations**
```shell
docker compose exec web python manage.py makemigrations
```
