package br.com.cesar.jira_ai_integration.services;

import br.com.cesar.jira_ai_integration.dtos.PlanningAnalysisDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.content.Media;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AiService {

    private final GoogleGenAiChatModel chatModel;

    // Alteramos o retorno para PlanningAnalysisDTO para suportar múltiplas histórias
    public PlanningAnalysisDTO analyzeRequirements(MultipartFile file) {
        try {
            // 1. Configura o conversor para a nova estrutura complexa
            var converter = new BeanOutputConverter<>(PlanningAnalysisDTO.class);

            var resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            String contentType = file.getContentType() != null ? file.getContentType() : "application/pdf";
            MimeType mimeType = MimeType.valueOf(contentType);

            // 2. Prompt alinhado com o README (Product Owner AI)
            String promptText = """
            Você é um Product Owner e Arquiteto de Software especialista em Ágil.
            Analise o documento de requisitos anexo e gere um Backlog estruturado para o Jira.
            
            Sua análise deve conter:
            1. Um resumo geral do documento.
            2. Uma lista de Histórias de Usuário necessárias para atender aos requisitos.
            
            Para cada História de Usuário, você deve gerar:
            - Title: Um título curto e objetivo para o Jira.
            - UserStoryFormat: A descrição no formato "Como [persona], eu quero [ação], para que [benefício]".
            - Priority: 'High', 'Medium' ou 'Low' baseado no valor de negócio.
            - Complexity: Estime a complexidade (ex: Low, Medium, High ou Story Points).
            - AcceptanceCriteria: Lista de critérios para a história ser considerada pronta.
            - Subtasks: Lista de tarefas técnicas necessárias (ex: "Criar API", "Criar Tela", "Testar").
            - Dependencies: Liste se essa história depende de algo (ex: "Depende da autenticação").
            
            %s
            """.formatted(converter.getFormat());

            var userMessage = UserMessage.builder()
                    .text(promptText)
                    .media(List.of(new Media(mimeType, resource)))
                    .build();

            // 3. Chamada à IA
            String responseContent = chatModel.call(new Prompt(List.of(userMessage)))
                    .getResult()
                    .getOutput()
                    .getText();

            // 4. Retorna o objeto estruturado
            return converter.convert(responseContent);

        } catch (IOException e) {
            log.error("Erro ao processar arquivo para IA", e);
            throw new RuntimeException("Falha na análise do arquivo", e);
        }
    }
}