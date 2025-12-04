package br.com.cesar.jira_ai_integration.repositories;

import br.com.cesar.jira_ai_integration.models.AiSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiSuggestionRepository extends JpaRepository<AiSuggestion, Long> {
    List<AiSuggestion> findByDocumentId(Long documentId);
}

