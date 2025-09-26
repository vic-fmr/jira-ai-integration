version: '3.8'

services:
  # 1. O container da sua aplicação Spring Boot (ambiente de dev)
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    volumes:
      - ..:/workspace:cached # Mapeia o código do projeto para dentro do container
    command: sleep infinity # Mantém o container rodando
    depends_on:
      - db # Garante que o banco de dados inicie antes da aplicação

  # 2. O container do banco de dados MariaDB
  db:
    image: mariadb:latest
    restart: unless-stopped
    environment:
      - MARIADB_ROOT_PASSWORD=sua-senha-root-forte
      - MARIADB_DATABASE=jira_ai_db
      - MARIADB_USER=jira_ai_user
      - MARIADB_PASSWORD=sua-senha-super-segura
    volumes:
      - mariadb-data:/var/lib/mysql # Garante que os dados do DB persistam

  # 3. (Opcional) O container do Ollama para IA local
  ollama:
    image: ollama/ollama
    restart: unless-stopped
    volumes:
      - ollama-models:/root/.ollama # Garante que os modelos da IA persistam

volumes:
  mariadb-data:
  ollama-models: