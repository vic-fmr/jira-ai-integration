package br.com.cesar.jira_ai_integration.dtos;

import java.util.List;

public record JiraPayloadDTO(Fields fields) {

    public record Fields(
            Project project,
            String summary,
            IssueType issuetype,
            // Campo complexo para a descrição (ADF)
            Object description,
            Priority priority,
            // Este campo só é preenchido ao criar uma Subtarefa!
            Parent parent
    ) {}

    public record Project(String key) {}
    public record IssueType(String name) {}
    public record Priority(String name) {}

    // Estrutura para vincular uma subtarefa ao pai
    public record Parent(String key) {}

    // --- Estrutura mínima para o Atlassian Document Format (ADF) ---
    // Jira não aceita mais strings puras para 'description' em APIs modernas
    public static Object createAdfDescription(String plainText) {
        return new DescriptionAdf(
                "doc",
                1,
                List.of(new ContentAdf("paragraph", List.of(new TextAdf("text", plainText))))
        );
    }
    public record DescriptionAdf(String type, int version, List<ContentAdf> content) {}
    public record ContentAdf(String type, List<TextAdf> content) {}
    public record TextAdf(String type, String text) {}
}