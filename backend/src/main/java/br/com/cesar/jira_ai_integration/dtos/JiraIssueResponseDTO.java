package br.com.cesar.jira_ai_integration.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// O Jira encapsula os dados dentro de "fields"
@JsonIgnoreProperties(ignoreUnknown = true)
public record JiraIssueResponseDTO(String key, Fields fields) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Fields(String summary, Status status) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Status(String name) {}
}