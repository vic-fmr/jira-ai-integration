package br.com.cesar.jira_ai_integration.dtos;

import java.util.List;

public record FullIssueRequestDTO(
        String projectKey,
        String title,
        String description, // Texto simples, será convertido para ADF no Service
        String priority,    // Ex: "Medium", "High"
        List<String> subtaskTitles // Lista de títulos das subtarefas
) {}