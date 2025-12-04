package br.com.cesar.jira_ai_integration.services;

import br.com.cesar.jira_ai_integration.dtos.PlanningAnalysisDTO;
import br.com.cesar.jira_ai_integration.dtos.UserStoryDTO; // Importante: Importe o DTO da história
import br.com.cesar.jira_ai_integration.models.AiSuggestion;
import br.com.cesar.jira_ai_integration.models.Document;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.repositories.AiSuggestionRepository;
import br.com.cesar.jira_ai_integration.repositories.DocumentRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final AiSuggestionRepository aiSuggestionRepository;
    private final AiService aiService;
    // private final JiraService jiraService; // Não está sendo usado neste método específico agora, mas pode manter se for usar depois.
    private final ObjectMapper objectMapper;

    @Transactional
    public PlanningAnalysisDTO uploadAndCreateSuggestions(MultipartFile file, String projectKey, User currentUser) throws Exception {
        // 1. Salvar o documento no banco
        log.info("Iniciando upload do arquivo: {} para o projeto: {}", file.getOriginalFilename(), projectKey);
        Document document = upload(file, currentUser);

        log.info("Documento salvo com ID: {}", document.getId());

        // 2. Processar o arquivo com IA (Retorna um objeto contendo VÁRIAS histórias)
        PlanningAnalysisDTO analysis = aiService.analyzeRequirements(file);

        // 3. Salvar cada história identificada como uma sugestão no banco
        if (analysis.stories() != null) {
            for (UserStoryDTO story : analysis.stories()) {
                saveAiSuggestion(document, story);
            }
        }

        // 4. Retornar resposta completa para o frontend, incluindo o projectKey
        return new PlanningAnalysisDTO(projectKey, analysis.documentSummary(), analysis.stories());
    }

    @Transactional
    public Document upload(MultipartFile file, User currentUser) {
        // Implementar validação de arquivo aqui se necessário (RF-S01)

        Document document = new Document();
        document.setFilename(file.getOriginalFilename());
        document.setUser(currentUser);
        // document.setStoragePath(...) // Se for salvar em disco/S3

        return documentRepository.save(document);
    }

    private void saveAiSuggestion(Document document, UserStoryDTO story) {
        try {
            AiSuggestion aiSuggestion = new AiSuggestion();
            aiSuggestion.setDocument(document);

            // Mapeando campos do DTO para a Entidade
            aiSuggestion.setTitle(story.title());
            aiSuggestion.setDescription(story.userStoryFormat()); // A descrição é o formato "Como eu quero..."
            aiSuggestion.setPriority(story.priority());
            aiSuggestion.setComplexity(story.complexity());

            // Convertendo Listas para JSON Strings para persistência
            if (story.subtasks() != null) {
                aiSuggestion.setSubtaskTitles(objectMapper.writeValueAsString(story.subtasks()));
            }

            if (story.acceptanceCriteria() != null) {
                aiSuggestion.setAcceptanceCriteria(objectMapper.writeValueAsString(story.acceptanceCriteria()));
            }

            if (story.dependencies() != null) {
                aiSuggestion.setDependencies(objectMapper.writeValueAsString(story.dependencies()));
            }

            aiSuggestionRepository.save(aiSuggestion);

        } catch (JsonProcessingException e) {
            log.error("Erro ao converter dados da história para JSON ao salvar sugestão ID Documento: {}", document.getId(), e);
            // Dependendo da regra de negócio, você pode lançar uma exceção ou apenas logar e continuar
        }
    }

    @Transactional
    public List<Document> findAll() {
        return documentRepository.findAll();
    }
}