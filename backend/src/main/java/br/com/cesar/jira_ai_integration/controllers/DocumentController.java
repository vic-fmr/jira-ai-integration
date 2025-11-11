package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.UploadResponseDTO;
import br.com.cesar.jira_ai_integration.models.Document;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:4200")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponseDTO> uploadDocument(
            @RequestParam("file") MultipartFile file
             /* @AuthenticationPrincipal UserDetails userDetails
             */
    ) {
        // ----------------------------------------------------------------------------------
        // ATENÇÃO: LÓGICA TEMPORÁRIA PARA TESTE SEM AUTENTICAÇÃO COMPLETA
        // Substitua esta linha pela lógica real de busca do usuário do token JWT.
//        // O back-end deve criar endpoints de segurança para login/registro [cite: 73]
//        User mockUser = new User();
//        mockUser.setId(1L); // Assumindo que o ID 1 já existe no seu banco para testes
//        // ----------------------------------------------------------------------------------

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponseDTO( "O arquivo não pode estar vazio.", null, null));
        }

        try {
            Document savedDocument = documentService.upload(file /* mockUser */);
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

