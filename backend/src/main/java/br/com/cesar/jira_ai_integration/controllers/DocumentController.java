package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.PlanningAnalysisDTO;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.services.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<PlanningAnalysisDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("projectKey") String projectKey,
            @AuthenticationPrincipal User user
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // O retorno aqui é PlanningAnalysisDTO, que contém:
            // - documentSummary (String)
            // - stories (List<UserStoryDTO>)
            PlanningAnalysisDTO response = documentService.uploadAndCreateSuggestions(file, projectKey, user);

            log.info("Documento processado com sucesso. {} histórias geradas.",
                    response.stories() != null ? response.stories().size() : 0);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erro ao processar upload do arquivo: {}", file.getOriginalFilename(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}