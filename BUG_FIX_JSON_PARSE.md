# 🐛 Bug Corrigido: Erro de Parse JSON na Resposta da IA

## ❌ Problema Original

```
Erro ao processar o upload: Unexpected character ('`' (code 96)): 
expected a valid value (JSON String, Number, Array, Object or token 'null', 'true' or 'false')
at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 1]
```

## 🔍 Causa Raiz

O **Google Gemini AI** estava retornando a resposta JSON **dentro de um bloco de código Markdown**:

```
```json
{
  "title": "Implementar autenticação",
  "description": "Sistema de login com JWT",
  "priority": "High",
  "subtaskTitles": ["Criar endpoint", "Validar token"]
}
```
```

Mas o código Java estava tentando fazer **parse direto** como JSON, sem remover os backticks (` `` `), causando o erro de parsing.

## ✅ Solução Implementada

### 1. **Método de Limpeza de Markdown**

Criado método `cleanJsonResponse()` no `AiService.java`:

```java
private String cleanJsonResponse(String response) {
    if (response == null || response.isBlank()) {
        return response;
    }

    String cleaned = response.trim();

    // Remove ```json ou ``` no início
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7).trim();
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.substring(3).trim();
    }

    // Remove ``` no final
    if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length() - 3).trim();
    }

    return cleaned;
}
```

### 2. **Aplicação da Limpeza**

Modificado o fluxo de processamento:

```java
// ANTES ❌
String jsonResponse = chatModel.call(...).getText();
ObjectMapper objectMapper = new ObjectMapper();
var aiResponse = objectMapper.readTree(jsonResponse); // ← ERRO AQUI

// DEPOIS ✅
String jsonResponse = chatModel.call(...).getText();
log.info("AI Response RAW: {}", jsonResponse);

// Remove markdown code blocks
jsonResponse = cleanJsonResponse(jsonResponse);
log.info("AI Response CLEANED: {}", jsonResponse);

ObjectMapper objectMapper = new ObjectMapper();
var aiResponse = objectMapper.readTree(jsonResponse); // ← Agora funciona!
```

### 3. **Prompt Mais Explícito**

Atualizado o prompt para a IA ser mais clara sobre o formato esperado:

```java
String promptText = """
    Analise o documento anexado e extraia as seguintes informações em formato JSON:
    {
      "title": "título resumido da tarefa principal",
      "description": "descrição detalhada da tarefa",
      "priority": "High, Medium ou Low",
      "subtaskTitles": [
        "subtarefa 1",
        "subtarefa 2",
        "subtarefa 3"
      ]
    }
    IMPORTANTE: Retorne APENAS o JSON válido, sem texto adicional, sem markdown e sem code blocks (```).
    """;
```

### 4. **Logging Aprimorado**

Adicionado `@Slf4j` e logging detalhado:

**DocumentController:**
```java
@Slf4j
@RestController
public class DocumentController {
    
    @PostMapping("/upload")
    public ResponseEntity<UploadResponseDTO> uploadDocument(...) {
        try {
            log.info("Iniciando upload do arquivo: {} para o projeto: {}", 
                     file.getOriginalFilename(), projectKey);
            // ...
        } catch (Exception e) {
            log.error("Erro ao processar upload do arquivo: {}", 
                      file.getOriginalFilename(), e);
            // ...
        }
    }
}
```

**AiService:**
```java
@Slf4j
@Service
public class AiService {
    
    public PartialIssueRequestDTO convertToPartialIssueRequest(MultipartFile file) {
        log.info("Iniciando análise do documento com IA: {}", file.getOriginalFilename());
        
        // ...
        
        log.info("AI Response RAW: {}", jsonResponse);
        jsonResponse = cleanJsonResponse(jsonResponse);
        log.info("AI Response CLEANED: {}", jsonResponse);
        
        // ...
    }
}
```

## 📋 Arquivos Modificados

1. ✅ `AiService.java`
   - Adicionado `@Slf4j`
   - Criado método `cleanJsonResponse()`
   - Aplicado limpeza antes do parse JSON
   - Melhorado prompt para IA
   - Adicionado logging detalhado

2. ✅ `DocumentController.java`
   - Adicionado `@Slf4j`
   - Melhorado tratamento de exceções
   - Adicionado logging de erro com stack trace

## 🧪 Como Testar

### 1. Reiniciar Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 2. Fazer Upload de Documento

No frontend (http://localhost:4200/jira):
1. Fazer login
2. Inserir chave do projeto (ex: PROJ)
3. Fazer upload de documento PDF/DOCX/TXT

### 3. Verificar Logs no Console

Você verá logs detalhados:
```
INFO  - Iniciando upload do arquivo: documento.pdf para o projeto: PROJ
INFO  - Iniciando análise do documento com IA: documento.pdf
INFO  - AI Response RAW: ```json
{
  "title": "Implementar sistema",
  "description": "...",
  "priority": "High",
  "subtaskTitles": ["tarefa1", "tarefa2"]
}
```
INFO  - AI Response CLEANED: {
  "title": "Implementar sistema",
  "description": "...",
  "priority": "High",
  "subtaskTitles": ["tarefa1", "tarefa2"]
}
INFO  - Análise concluída com sucesso. Título: Implementar sistema
```

## ✅ Resultado Esperado

Agora o upload deve funcionar corretamente, mesmo que a IA retorne JSON com markdown code blocks!

### Fluxo Completo:
```
Upload de documento
        ↓
IA processa e retorna (possivelmente com ```)
        ↓
cleanJsonResponse() remove markdown
        ↓
Parse JSON bem-sucedido
        ↓
Salva sugestões no banco
        ↓
Cria issue no Jira
        ↓
Retorna sucesso para frontend
```

## 🎯 Casos de Teste Cobertos

O método `cleanJsonResponse()` agora trata:

1. ✅ Resposta com `\`\`\`json` no início e `\`\`\`` no final
2. ✅ Resposta com apenas `\`\`\`` no início e final
3. ✅ Resposta JSON puro (sem markdown)
4. ✅ Resposta null ou vazia

## 🚀 Status

**Bug RESOLVIDO!** ✅

O sistema agora é robusto o suficiente para lidar com diferentes formatos de resposta da IA Gemini.

