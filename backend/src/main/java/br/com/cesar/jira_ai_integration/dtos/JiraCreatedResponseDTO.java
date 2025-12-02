package br.com.cesar.jira_ai_integration.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record JiraCreatedResponseDTO(String id, String key, String self) {}