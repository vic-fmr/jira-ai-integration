package br.com.cesar.jira_ai_integration.dtos;

import java.util.List;

// Representa cada História de Usuário detalhada
public record UserStoryDTO(
        String title,               // Ex: "Cadastro de Usuário"
        String userStoryFormat,     // Ex: "Como usuário, quero... para que..."
        String priority,            // High, Medium, Low
        String complexity,          // Ex: "5 Story Points" ou "Medium" (conforme README)
        List<String> acceptanceCriteria, // Critérios de aceitação
        List<String> subtasks,      // Quebra técnica (Frontend, Backend, etc)
        List<String> dependencies   // Ex: "Depende da criação do Banco de Dados"
) {}
