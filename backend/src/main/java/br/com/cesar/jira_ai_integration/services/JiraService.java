package br.com.cesar.jira_ai_integration.services;


import br.com.cesar.jira_ai_integration.dtos.FullIssueRequestDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraCreatedResponseDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraIssueResponseDTO;
import br.com.cesar.jira_ai_integration.dtos.JiraPayloadDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.Base64;

@Service
public class JiraService {

    private final RestClient restClient;

    public JiraService(RestClient.Builder builder,
                       @Value("${jira.url}") String jiraUrl,
                       @Value("${jira.username}") String username,
                       @Value("${jira.token}") String token) {

        // Codifica Email:Token em Base64 para o cabeçalho Authorization
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
                // Endpoint da API v3 do Jira
                .uri("/rest/api/3/issue/{key}", issueKey)
                .retrieve()
                .body(JiraIssueResponseDTO.class);
    }

    public JiraCreatedResponseDTO createIssueWithSubtasks(FullIssueRequestDTO request) {

        // 1. CRIAÇÃO DA ISSUE PRINCIPAL (PARENT)
        JiraCreatedResponseDTO parentIssue = createParentIssue(
                request.projectKey(),
                request.title(),
                request.description(),
                request.priority()
        );

        // 2. CRIAÇÃO DAS SUBTAREFAS (CHILDREN)
        if (request.subtaskTitles() != null && !request.subtaskTitles().isEmpty()) {
            String parentKey = parentIssue.key(); // Ex: PROJ-15

            for (String subtaskTitle : request.subtaskTitles()) {
                createSubtask(parentKey, subtaskTitle);
            }
        }

        return parentIssue;
    }

    private JiraCreatedResponseDTO createParentIssue(String projectKey, String title, String description, String priorityName) {

        // Converte o texto simples para o formato ADF
        Object adfDescription = JiraPayloadDTO.createAdfDescription(description);

        var project = new JiraPayloadDTO.Project(projectKey);
        var issueType = new JiraPayloadDTO.IssueType("Task"); // Tipo de Issue principal
        var priority = new JiraPayloadDTO.Priority(priorityName);

        // Note que o campo 'parent' é nulo aqui.
        var fields = new JiraPayloadDTO.Fields(project, title, issueType, adfDescription, priority, null);
        var payload = new JiraPayloadDTO(fields);

        return restClient.post()
                .uri("/rest/api/3/issue")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(JiraCreatedResponseDTO.class);
    }

    private void createSubtask(String parentKey, String subtaskTitle) {

        var project = new JiraPayloadDTO.Project(parentKey.split("-")[0]); // Pega o PROJETO do parent key (PROJ)
        var issueType = new JiraPayloadDTO.IssueType("Subtask"); // Tipo de Issue deve ser Subtarefa
        var parent = new JiraPayloadDTO.Parent(parentKey); // Vincula ao pai
        var priority = new JiraPayloadDTO.Priority("Low");

        // Para simplificar, subtasks não terão descrição ou prioridade neste exemplo
        var fields = new JiraPayloadDTO.Fields(project, subtaskTitle, issueType, null, priority , parent);
        var payload = new JiraPayloadDTO(fields);

        // O retorno da subtarefa não é usado, mas a chamada deve ocorrer.
        restClient.post()
                .uri("/rest/api/3/issue")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity(); // Não precisamos mapear o corpo
    }
}
