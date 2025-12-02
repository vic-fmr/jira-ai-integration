package br.com.cesar.jira_ai_integration.dtos;

import java.util.List;

public record PartialIssueRequestDTO(
        String title,
        String description,
        String priority,
        List<String> subtaskTitles
) {}