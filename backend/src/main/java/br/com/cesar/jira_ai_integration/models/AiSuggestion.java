package br.com.cesar.jira_ai_integration.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity
@Table(name = "ai_suggestions")
@Data
@NoArgsConstructor
public class AiSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    // Aqui armazenaremos o formato "Como usuário, quero..."
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "priority", length = 50)
    private String priority;

    // Novo campo conforme requisitos do README
    @Column(name = "complexity", length = 50)
    private String complexity;

    // Armazenado como JSON String: ["Critério 1", "Critério 2"]
    @Column(name = "acceptance_criteria", columnDefinition = "TEXT")
    private String acceptanceCriteria;

    // Armazenado como JSON String: ["Depende da API X"]
    @Column(name = "dependencies", columnDefinition = "TEXT")
    private String dependencies;

    // Armazenado como JSON String: ["Subtarefa 1", "Subtarefa 2"]
    @Column(name = "subtask_titles", columnDefinition = "TEXT")
    private String subtaskTitles;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}