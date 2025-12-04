package br.com.cesar.jira_ai_integration.services;

import br.com.cesar.jira_ai_integration.dtos.PlanningAnalysisDTO;
import br.com.cesar.jira_ai_integration.dtos.UserStoryDTO; // Importe o novo DTO
import br.com.cesar.jira_ai_integration.dtos.JiraCreatedResponseDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraIssueResponseDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraPayloadDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class JiraService {

    private final RestClient restClient;

    public JiraService(RestClient.Builder builder,
                       @Value("${jira.url}") String jiraUrl,
                       @Value("${jira.username}") String username,
                       @Value("${jira.token}") String token) {

        String authHeader = "Basic " + Base64.getEncoder()
                .encodeToString((username + ":" + token).getBytes());

        this.restClient = builder
                .baseUrl(jiraUrl)
                .defaultHeader("Authorization", authHeader)
                .defaultHeader("Accept", "application/json")
                .build();
    }

    public JiraIssueResponseDTO getIssue(String issueKey) {
        return restClient.get()
                .uri("/rest/api/3/issue/{key}", issueKey)
                .retrieve()
                .body(JiraIssueResponseDTO.class);
    }

    /**
     * Cria múltiplas histórias e suas subtarefas baseadas na análise da IA.
     * @param analysis O resultado da IA contendo a lista de histórias.
     * @param projectKey A chave do projeto Jira (ex: "PROJ").
     * @return Lista de respostas das Issues pais criadas.
     */
    public void createIssuesFromPlanning(PlanningAnalysisDTO planning) {
        String projectKey = planning.projectKey();

        // Itera sobre cada User Story vinda do frontend
        for (UserStoryDTO story : planning.stories()) {

            // 1. Cria a Issue Pai (User Story)
            JiraCreatedResponseDTO parentIssue = createParentIssue(projectKey, story);

            // 2. Cria as Subtarefas vinculadas
            if (story.subtasks() != null && !story.subtasks().isEmpty()) {
                String parentKey = parentIssue.key();
                for (String subtaskTitle : story.subtasks()) {
                    createSubtask(parentKey, subtaskTitle);
                }
            }
        }
    }

    private JiraCreatedResponseDTO createParentIssue(String projectKey, UserStoryDTO story) {

        // Formata uma descrição rica com os dados da IA
        String richDescription = buildFormattedDescription(story);

        // Converte o texto para ADF (Atlassian Document Format)
        Object adfDescription = JiraPayloadDTO.createAdfDescription(richDescription);

        var project = new JiraPayloadDTO.Project(projectKey);
        // Tenta criar como "Story", se seu Jira não tiver esse tipo, mude para "Task"
        var issueType = new JiraPayloadDTO.IssueType("Story");
        var priority = new JiraPayloadDTO.Priority(story.priority());

        var fields = new JiraPayloadDTO.Fields(project, story.title(), issueType, adfDescription, priority, null);
        var payload = new JiraPayloadDTO(fields);

        return restClient.post()
                .uri("/rest/api/3/issue")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(JiraCreatedResponseDTO.class);
    }

    private void createSubtask(String parentKey, String subtaskTitle) {
        var project = new JiraPayloadDTO.Project(parentKey.split("-")[0]);
        var issueType = new JiraPayloadDTO.IssueType("Subtask");
        var parent = new JiraPayloadDTO.Parent(parentKey);
        var priority = new JiraPayloadDTO.Priority("Medium"); // Default para subtask

        var fields = new JiraPayloadDTO.Fields(project, subtaskTitle, issueType, null, priority , parent);
        var payload = new JiraPayloadDTO(fields);

        restClient.post()
                .uri("/rest/api/3/issue")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }

    // Helper para montar o texto da descrição
    private String buildFormattedDescription(UserStoryDTO story) {
        StringBuilder sb = new StringBuilder();
        sb.append("h3. User Story\n").append(story.userStoryFormat()).append("\n\n");

        if (story.acceptanceCriteria() != null && !story.acceptanceCriteria().isEmpty()) {
            sb.append("h3. Acceptance Criteria\n");
            story.acceptanceCriteria().forEach(c -> sb.append("- ").append(c).append("\n"));
            sb.append("\n");
        }

        if (story.complexity() != null) {
            sb.append("*Complexity:* ").append(story.complexity()).append("\n");
        }

        if (story.dependencies() != null && !story.dependencies().isEmpty()) {
            sb.append("*Dependencies:* ").append(String.join(", ", story.dependencies())).append("\n");
        }

        return sb.toString();
    }

    public Object getProjects() {
        return restClient.get()
                .uri("/rest/api/3/project")
                .retrieve()
                .body(Object.class);
    }
}