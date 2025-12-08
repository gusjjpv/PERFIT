<div align="center">
  <img src="./PERFIT/client/public/logo.png" alt="PERFIT Logo" width="200"/>
  <p><strong>Sistema de Gestão para Academias e Personal Trainers</strong><p>
</div>

---
## 🎯 Objetivo do Sistema

O sistema visa facilitar a rotina de professores e personal trainers, permitindo uma visualização rápida e detalhada do perfil de cada aluno, automatizando cálculos fisiológicos e fornecendo ferramentas digitais para prescrição de treinos e monitoramento de saúde.

## 🚀 Principais Funcionalidades

### 👨‍🏫 Para o Professor
- **Gestão Centralizada:** Visualização rápida do perfil e dados completos de cada aluno.
- **Automação de Avaliações:** Cálculo automático do IMC e registro de circunferências corporais.
- **Monitoramento de Saúde:** Registro e acompanhamento de Pressão Arterial (PA) e Controle Glicêmico (CC), com relatórios detalhados (pré, durante e pós-treino).
- **Fichas de Treino Digitais:** Ferramenta intuitiva para criação e atribuição de fichas de treino personalizadas.

### 🏋️‍♂️ Para o Aluno
- **Interface Amigável:** Design intuitivo, acessível e com alta legibilidade.
- **Acesso Rápido:** Visualização clara e direta da ficha de treino do dia.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Linguagem:** Python
- **Framework:** Django & Django REST Framework (DRF)
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker & Docker Compose
- **Servidor Web:** Nginx & Gunicorn
- **Documentação:** Swagger / OpenAPI (drf-spectacular)

### Frontend
- **Linguagem:** TypeScript
- **Framework:** React
- **Build Tool:** Vite
- **Estilização:** Styled Components
- **PWA:** Vite Plugin PWA

Arquitetura do Sistema

Abaixo, o diagrama de componentes e fluxo de dados da infraestrutura do PERFIT na AWS:
```mermaid
---
config:
  layout: fixed
---
flowchart TB
 subgraph subGraph0["AWS Cloud - Frontend"]
        Amplify[("AWS Amplify<br>(React App / Client)")]
  end
 subgraph subGraph1["Docker Compose"]
        Nginx["Nginx<br>(Reverse Proxy &amp; SSL)"]
        Certbot@{ label: "Certbot<br>(Let's Encrypt)" }
        Django["Django REST Framework<br>(Gunicorn Server)"]
        Postgres[("PostgreSQL<br>(Database)")]
  end
 subgraph subGraph2["AWS Cloud - Backend (EC2 Instance)"]
        subGraph1
        StaticVol[("Static Volume")]
        DbVol[("Postgres Data")]
  end
    User(("Usuário<br>Prof/Aluno")) -- Acessa via Browser --> Amplify
    Amplify -- "Requisições API - HTTPS" --> Route53{{"AWS Route 53<br>(DNS / Domínio)"}}
    Route53 L_Route53_Nginx_0@-- Resolve IP --> Nginx
    Nginx -- "Proxy Pass - HTTP" --> Django
    Django <-- SQL Queries --> Postgres
    Nginx <-- Lê Certificados --> Certbot
    Nginx <-- Serve CSS/JS --> StaticVol
    Django -- Coleta Estáticos --> StaticVol
    Postgres <-- Persistência --> DbVol

    Certbot@{ shape: rounded}
    style Amplify fill:#ff9900,stroke:#333,color:black
    style Nginx fill:#009639,stroke:#333,color:white
    style Certbot fill:#f2c744,stroke:#333,color:black
    style Django fill:#092e20,stroke:#333,color:white
    style Postgres fill:#336791,stroke:#333,color:white
    style User fill:#2962FF,stroke:#333,stroke-width:2px,color:none
    style Route53 fill:#ff9900,stroke:#333,color:black

    L_Route53_Nginx_0@{ curve: natural }
```
## 🏃‍♂️ Como Executar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados.
- [Node.js](https://nodejs.org/) (versão 18 ou superior) e npm instalados.

### 1. Backend (API & Banco de Dados)

O backend é totalmente containerizado. Para iniciar:

```bash
# Na raiz do projeto
docker-compose up --build
```

Isso iniciará:
- Banco de dados PostgreSQL
- API Django (porta 8000)
- Nginx (porta 80)

### 2. Frontend (Aplicação Web)

Em um novo terminal, execute o cliente React:

```bash
# Navegue até a pasta do cliente
cd PERFIT/client

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🧭 Como Navegar e Testar

- **Aplicação Web:** Acesse o link exibido no terminal do frontend (geralmente `http://localhost:5173`).
- **Documentação da API (Swagger):** Com o backend rodando, acesse `http://localhost:8000/api/docs/` para visualizar e testar os endpoints da API.
- **Painel Administrativo:** Acesse `http://localhost:8000/admin/` para gerenciar usuários e dados diretamente (requer criação de superusuário).

## 👥 Integrantes do Grupo

| Nome | Função |
|------|--------|
| **FABIO QUEIROZ VIEIRA** |Data Modeler, Database Designer, Data Architect, Systems Analyst|
| **GUSTAVO KESLEY DE FONTES NUNES** | Scrum Master |
| **JOÃO GUSTAVO SOUZA LIMA** | Product owner, Back-end Developer, Cloud Developer |
| **JOHAN PEDRO DE QUEIROZ** | Front-end Developer|
