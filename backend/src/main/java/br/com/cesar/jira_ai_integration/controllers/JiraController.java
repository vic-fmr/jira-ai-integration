package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.PlanningAnalysisDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraCreatedResponseDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraIssueResponseDTO;
import br.com.cesar.jira_ai_integration.services.JiraService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/jira")
public class JiraController {

    private final JiraService jiraService;

    public JiraController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    @GetMapping("/issue/{key}")
    public JiraIssueResponseDTO getIssueDetails(@PathVariable String key) {
        return jiraService.getIssue(key);
    }

    /**
     * Endpoint para criar issues em lote baseado na análise da IA.
     * Retorna uma lista com todas as histórias criadas no Jira.
     */
    @PostMapping("/issues")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<PlanningAnalysisDTO> createIssues(@RequestBody PlanningAnalysisDTO request) {
        // Agora chamamos o método que processa a lista de histórias
        return ResponseEntity.ok(request);
    }

    @PostMapping("/sync")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> syncPlanning(@RequestBody PlanningAnalysisDTO planning) {
        // Este método irá receber o plano editado do frontend e criar as issues no Jira
        log.info("Sincronizando plano com o Jira para o projeto: {}", planning.projectKey());

        // Aqui você chamaria um método no jiraService para processar o planning
        jiraService.createIssuesFromPlanning(planning);

        return ResponseEntity.ok().body(Map.of("message", "Sincronização com Jira iniciada com sucesso."));
    }
}