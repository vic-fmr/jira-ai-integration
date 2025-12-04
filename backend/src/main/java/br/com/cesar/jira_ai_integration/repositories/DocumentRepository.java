package br.com.cesar.jira_ai_integration.repositories;

import br.com.cesar.jira_ai_integration.models.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
}
