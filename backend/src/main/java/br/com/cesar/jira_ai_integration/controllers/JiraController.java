package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.FullIssueRequestDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraCreatedResponseDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraIssueResponseDTO;
import br.com.cesar.jira_ai_integration.services.JiraService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/issue")
    @ResponseStatus(HttpStatus.CREATED)
    public JiraCreatedResponseDTO createIssue(@RequestBody FullIssueRequestDTO request) {
        return jiraService.createIssueWithSubtasks(request);
    }
}
