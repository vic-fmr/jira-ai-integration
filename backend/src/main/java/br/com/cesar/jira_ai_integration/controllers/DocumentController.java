package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.models.Document;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file
             /* @AuthenticationPrincipal UserDetails userDetails
             */
    ) {
        // ----------------------------------------------------------------------------------
        // ATENÇÃO: LÓGICA TEMPORÁRIA PARA TESTE SEM AUTENTICAÇÃO COMPLETA
        // Substitua esta linha pela lógica real de busca do usuário do token JWT.
        // O back-end deve criar endpoints de segurança para login/registro [cite: 73]
        User mockUser = new User();
        mockUser.setId(1L); // Assumindo que o ID 1 já existe no seu banco para testes
        // ----------------------------------------------------------------------------------

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "O arquivo não pode estar vazio."));
        }

        try {
            Document savedDocument = documentService.upload(file, mockUser);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Documento enviado e metadados salvos com sucesso!",
                    "documentId", savedDocument.getId(),
                    "filename", savedDocument.getFilename()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "message", "Erro ao processar o upload: " + e.getMessage()
            ));
        }
    }
}
}
