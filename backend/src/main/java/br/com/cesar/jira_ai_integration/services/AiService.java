package br.com.cesar.jira_ai_integration.services;

import br.com.cesar.jira_ai_integration.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AiService {

    private final GoogleGenAiChatModel chatModel;

    public ChatResponse read(MultipartFile file) throws IOException {

        // 1. Criação de um ByteArrayResource a partir dos bytes
        // Este objeto implementa a interface Resource
        // (e por isso pode ser usado como mídia em new Media(...))
        var resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        // 2. Crie o objeto MimeType usando o tipo de conteúdo real do arquivo (se disponível)
        // O file.getContentType() é mais robusto que hardcodar "application/pdf"
        String contentType = file.getContentType() != null ? file.getContentType() : "application/pdf";
        MimeType mimeType = MimeType.valueOf(contentType);

        // 3. Criar a mensagem do usuário com o recurso de mídia anexado
        var userMessage = UserMessage.builder()
                .text("Você é um otimo assistente de IA. Leia o conteúdo do arquivo anexado e forneça um resumo conciso.")
                .media(List.of(new Media(mimeType, resource)))
                .build();

        return this.chatModel.call(new Prompt(List.of(userMessage)));
    }


}
