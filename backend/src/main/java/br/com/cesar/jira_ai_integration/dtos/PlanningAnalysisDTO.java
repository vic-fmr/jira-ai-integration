package br.com.cesar.jira_ai_integration.dtos;

import java.util.List;

// Representa a análise completa do documento
public record PlanningAnalysisDTO(
        String projectKey,      // Chave do projeto Jira (ex: "PROJ")
        String documentSummary, // Resumo geral do que foi analisado
        List<UserStoryDTO> stories // Lista de histórias sugeridas
) {}

