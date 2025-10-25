# Documentação do Banco de Dados: Projeto de Integração IA + Jira

## 1. Visão Geral

Este documento detalha a estrutura e o propósito do banco de dados `jira_ai_integration`. Este banco de dados MariaDB foi projetado para suportar a aplicação de integração com o Jira, armazenando informações de usuários, os documentos que eles enviam para análise e as sugestões (Histórias de Usuário e Tarefas) geradas pela IA.

## 2. Detalhes de Conexão (Ambiente de Desenvolvimento)

Para conectar o serviço de Backend (Spring Boot) a este banco de dados, utilize as seguintes configurações.

### Configuração para `application.properties`

Adicione este bloco ao seu arquivo `src/main/resources/application.properties`:

```properties
# =======================================
# CONFIGURAÇÃO DO MARIA DB
# =======================================

# URL de Conexão JDBC
spring.datasource.url=jdbc:mariadb://localhost:3306/jira_ai_integration

# Usuário e Senha da Aplicação
spring.datasource.username=jira_app_user
spring.datasource.password=EquipeKant

# Driver JDBC
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# =======================================
# CONFIGURAÇÃO DO HIBERNATE (JPA)
# =======================================

# Dialeto específico do MariaDB para o Hibernate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

# Recomendado: 'validate' verifica se as @Entities Java batem com o schema do banco.
# NUNCA use 'create' ou 'update' em produção.
spring.jpa.hibernate.ddl-auto=validate

# Opcional: Mostra os comandos SQL no console (bom para debug)
spring.jpa.show-sql=true
```

## 3. Diagrama de Entidade-Relacionamento (DER)

Abaixo está um diagrama lógico (usando sintaxe Mermaid) que representa a relação entre as principais entidades do banco de dados.

```mermaid
erDiagram
    users ||--o{ documents : "possui"
    documents ||--o{ ai_suggestions : "gera"
    ai_suggestions }o--|| ai_suggestions : "é-pai-de (Story/Task)"

    users {
        BIGINT id (PK)
        VARCHAR(100) username (UNIQUE)
        VARCHAR(255) password_hash
        TIMESTAMP created_at
    }

    documents {
        BIGINT id (PK)
        VARCHAR(255) filename
        TIMESTAMP upload_timestamp
        BIGINT user_id (FK)
    }

    ai_suggestions {
        BIGINT id (PK)
        BIGINT document_id (FK)
        ENUM('story', 'task') type
        TEXT content
        ENUM('pending', 'approved', 'deleted') status
        BIGINT parent_suggestion_id (FK)
        TIMESTAMP created_at
    }
```

## 4. Dicionário de Dados

Esta seção detalha a estrutura de cada tabela, suas colunas e finalidades.

### Tabela: `users`

Armazena as informações de login dos usuários que podem acessar a plataforma.

| Coluna | Tipo | Chave | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | **PK** | Identificador único do usuário. |
| `username` | `VARCHAR(100)` | **Unique** | Nome de usuário para login (único). |
| `password_hash` | `VARCHAR(255)` | | Senha criptografada (ex: Bcrypt). |
| `created_at` | `TIMESTAMP` | | Data/hora de criação do registro. |

### Tabela: `documents`

Armazena os metadados dos arquivos enviados pelos usuários para análise da IA.

| Coluna | Tipo | Chave | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | **PK** | Identificador único do documento. |
| `filename` | `VARCHAR(255)` | | Nome original do arquivo enviado. |
| `upload_timestamp` | `TIMESTAMP` | | Data/hora que o arquivo foi salvo. |
| `user_id` | `BIGINT` | **FK** | Referência ao `id` na tabela `users`. |

### Tabela: `ai_suggestions`

Armazena as sugestões (Histórias ou Tarefas) geradas pela IA com base em um documento.

| Coluna | Tipo | Chave | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | **PK** | Identificador único da sugestão. |
| `document_id` | `BIGINT` | **FK** | Referência ao `id` na tabela `documents`. |
| `type` | `ENUM('story', 'task')` | | Tipo de sugestão: 'story' ou 'task'. |
| `content` | `TEXT` | | O texto da sugestão gerado pela IA. |
| `status` | `ENUM('pending', 'approved', 'deleted')` | | Status da sugestão: 'pending', 'approved', 'deleted'. |
| `parent_suggestion_id` | `BIGINT` | **FK** | (Nulável) Referência ao `id` de outra `ai_suggestions`. |
| `created_at` | `TIMESTAMP` | | Data/hora de criação do registro. |

## 5. Lógica de Negócio e Relacionamentos Chave

O Backend deve estar ciente das seguintes regras de integridade de dados (chaves estrangeiras):

### 1. `documents.user_id` -> `users.id`
* **Descrição:** Liga um documento ao usuário que o enviou.
* **Regra de Deleção:** `ON DELETE CASCADE`
* **Impacto para o Backend:** Se um registro `users` for deletado, o banco de dados **automaticamente deletará** todos os `documents` associados a ele. Isso também ativará a regra em cascata abaixo (item 2). O Backend não precisa gerenciar manualmente a exclusão de documentos órfãos.

### 2. `ai_suggestions.document_id` -> `documents.id`
* **Descrição:** Liga uma sugestão da IA ao documento que a originou.
* **Regra de Deleção:** `ON DELETE CASCADE`
* **Impacto para o Backend:** Se um registro `documents` for deletado (manualmente ou pela cascata acima), o banco de dados **automaticamente deletará** todas as `ai_suggestions` associadas a ele.

### 3. `ai_suggestions.parent_suggestion_id` -> `ai_suggestions.id` (Relação Story/Task)
* **Descrição:** Esta é a relação mais importante. É uma auto-referência usada para aninhar 'tasks' dentro de 'stories'.
    * **Se `type` = 'story'**: `parent_suggestion_id` deve ser `NULL`.
    * **Se `type` = 'task'**: `parent_suggestion_id` deve conter o `id` da 'story' pai.
* **Regra de Deleção:** `ON DELETE SET NULL`
* **Impacto para o Backend:** Se uma 'story' (uma sugestão pai) for deletada, suas 'tasks' filhas **não serão deletadas**. Em vez disso, a coluna `parent_suggestion_id` delas será **automaticamente atualizada para `NULL`**. O Backend deve implementar a lógica para tratar essas "tasks órfãs" (ex: permitir que sejam re-associadas ou exibi-las como independentes).

## 6. Considerações de Performance (Índices)

Para garantir que as consultas principais da aplicação sejam rápidas, índices foram criados nas seguintes colunas:

* **`documents(user_id)`**: (Índice: `idx_documents_user_id`)
    * **Propósito:** Acelera a busca de "todos os documentos de um usuário específico".
* **`ai_suggestions(document_id)`**: (Índice: `idx_suggestions_document_id`)
    * **Propósito:** Acelera a busca de "todas as sugestões de um documento específico".
* **`ai_suggestions(status)`**: (Índice: `idx_suggestions_status`)
    * **Propósito:** Acelera a filtragem de sugestões por status. (Ex: "buscar todas as sugestões 'pending'").
* **`ai_suggestions(parent_suggestion_id)`**: (Índice: `idx_suggestions_parent_id`)
    * **Propósito:** Acelera a busca de "todas as 'tasks' de uma 'story' específica".