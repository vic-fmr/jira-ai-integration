# Guia de Configuração - Jira AI Integration

## Pré-requisitos

- Java 17+
- Node.js 18+
- MariaDB 10.6+
- Maven 3.8+
- Conta no Jira Cloud
- API Key do Google GenAI (Gemini)

## Configuração do Banco de Dados

### 1. Criar o Banco de Dados

```sql
CREATE DATABASE jira_ai_integration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jira_ai_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON jira_ai_integration.* TO 'jira_ai_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Executar o Schema

```bash
mysql -u jira_ai_user -p jira_ai_integration < backend/src/main/resources/schema.sql
```

## Configuração do Backend

### 1. Configurar application.properties

Edite `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mariadb://localhost:3306/jira_ai_integration
spring.datasource.username=jira_ai_user
spring.datasource.password=sua_senha_segura
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

# JWT Configuration
jwt.secret=SUA_CHAVE_SECRETA_JWT_AQUI_MINIMO_256_BITS
jwt.expiration=86400000

# Jira Configuration
jira.url=https://sua-empresa.atlassian.net
jira.username=seu-email@empresa.com
jira.token=SEU_TOKEN_JIRA_AQUI

# Google GenAI Configuration
spring.ai.google.genai.api-key=SUA_API_KEY_GOOGLE_GENAI
spring.ai.google.genai.chat.options.model=gemini-1.5-flash
spring.ai.google.genai.chat.options.temperature=0.7

# Server Configuration
server.port=8080

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 2. Obter Token do Jira

1. Acesse: https://id.atlassian.com/manage-profile/security/api-tokens
2. Clique em "Create API token"
3. Dê um nome (ex: "Jira AI Integration")
4. Copie o token gerado
5. Cole em `jira.token` no application.properties

### 3. Obter API Key do Google GenAI

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada
4. Cole em `spring.ai.google.genai.api-key` no application.properties

### 4. Executar o Backend

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

O backend estará disponível em: http://localhost:8080

## Configuração do Frontend

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Configurar Ambiente (Opcional)

Se necessário, edite `frontend/src/app/features/jira-integration/services/jira-api.service.ts`:

```typescript
const API_URL = 'http://localhost:8080/api';
```

### 3. Executar o Frontend

```bash
npm start
# ou
ng serve
```

O frontend estará disponível em: http://localhost:4200

## Testando a Aplicação

### 1. Registro de Usuário

```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

### 3. Upload de Documento

```bash
POST http://localhost:8080/api/documents/upload
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: multipart/form-data

file: [arquivo.pdf]
projectKey: PROJ
```

### 4. Listar Projetos do Jira

```bash
GET http://localhost:8080/api/jira/projects
Authorization: Bearer SEU_TOKEN_JWT
```

## Estrutura de Arquivos Importantes

```
backend/
├── src/main/resources/
│   ├── application.properties    # Configurações principais
│   └── schema.sql                # Schema do banco de dados
├── src/main/java/.../
│   ├── models/
│   │   ├── User.java            # Entidade de usuário
│   │   ├── Document.java        # Entidade de documento
│   │   └── AiSuggestion.java    # Entidade de sugestões da IA
│   ├── controllers/
│   │   ├── AuthController.java  # Autenticação
│   │   ├── DocumentController.java # Upload de documentos
│   │   └── JiraController.java  # Integração Jira
│   ├── services/
│   │   ├── AiService.java       # Processamento com IA
│   │   ├── JiraService.java     # Comunicação com Jira
│   │   └── DocumentService.java # Lógica de documentos
│   └── config/
│       └── SecurityConfig.java  # Configuração de segurança

frontend/
├── src/app/
│   ├── core/
│   │   ├── guards/auth.guard.ts      # Proteção de rotas
│   │   ├── interceptors/auth.interceptor.ts # Interceptor JWT
│   │   └── services/auth.service.ts  # Serviço de autenticação
│   └── features/jira-integration/
│       ├── services/jira-api.service.ts  # Integração com backend
│       ├── pages/jira-generator/         # Página principal
│       └── components/                   # Componentes da UI
```

## Troubleshooting

### Erro de Conexão com Banco de Dados

1. Verifique se o MariaDB está rodando
2. Confirme usuário e senha no application.properties
3. Teste a conexão: `mysql -u jira_ai_user -p`

### Erro 401 Unauthorized

1. Verifique se o token JWT está sendo enviado no header
2. Confirme que `jwt.secret` está configurado
3. Faça login novamente para obter novo token

### Erro ao Criar Issue no Jira

1. Verifique credenciais do Jira (username e token)
2. Confirme que a chave do projeto existe
3. Verifique permissões do usuário no Jira
4. Teste manualmente: `curl -u email:token https://sua-empresa.atlassian.net/rest/api/3/project`

### Erro de IA (Google GenAI)

1. Verifique a API key do Google GenAI
2. Confirme que o modelo está disponível
3. Verifique limites de uso da API
4. Teste a conexão separadamente

## Próximos Passos

Após configuração completa:

1. ✅ Registrar primeiro usuário
2. ✅ Fazer login e obter token
3. ✅ Testar upload de documento
4. ✅ Verificar criação no Jira
5. ✅ Validar sugestões salvas no banco

## Suporte

Para problemas ou dúvidas, verifique:
- Logs do backend: console onde rodou `./mvnw spring-boot:run`
- Logs do frontend: console do navegador (F12)
- Documentação do Jira API: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- Documentação Google GenAI: https://ai.google.dev/docs

