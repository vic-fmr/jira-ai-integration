package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.UploadResponseDTO;
import br.com.cesar.jira_ai_integration.models.Document;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponseDTO> uploadDocument(
            @RequestParam("file") MultipartFile file
            // @AuthenticationPrincipal User user

    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponseDTO( "O arquivo não pode estar vazio.", null, null));
        }

        try {
            Document savedDocument = documentService.uploadAndExtract(file /* user */);
            System.out.println("Documento salvo com ID: " + savedDocument.getId());
            System.out.println("Nome do arquivo: " + savedDocument.getFilename());

            System.out.println(savedDocument);

            return ResponseEntity.ok(new UploadResponseDTO(
                     "Documento enviado e metadados salvos com sucesso!",
                     savedDocument.getId(),
                     savedDocument.getFilename()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new UploadResponseDTO(
                    "Erro ao processar o upload: " + e.getMessage(), null, null
            ));
        }
    }
}
