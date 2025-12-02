package br.com.cesar.jira_ai_integration.services;

import br.com.cesar.jira_ai_integration.models.Document;
import br.com.cesar.jira_ai_integration.repositories.DocumentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final AiService aiService;

    @Transactional
    public Document uploadAndRead(MultipartFile file/*, User currentUser*/) throws Exception {
        Document document = upload(file/*, currentUser*/);
        String resumoResponse = aiService.read(file);

        System.out.println("Resumo do documento: " + resumoResponse);
        return document;
    }

    @Transactional
    public Document upload(MultipartFile file/*, User currentUser*/) throws Exception {
        // RF-S01 exige validação de formato (ex: .pdf, .docx, .txt)
        // *Implementar validação do 'file' aqui*

        // **Salvar o arquivo físico**
        // String storagePath = saveFileToDisk(file);

        Document document = new Document();
        document.setFilename(file.getOriginalFilename());
        // document.setUser(currentUser);

        return documentRepository.save(document);
    }

    // Metodo a ser adicionado posteriormente para salvar o arquivo em si
    /*
    private String saveFileToDisk(MultipartFile file) {
        // Implementar lógica de salvamento para disco, S3, ou similar
        // Retornar o caminho/URL
        return "caminho/do/arquivo/salvo";
    }
    */

    @Transactional
    public List<Document> findAll() {
        return documentRepository.findAll();
    }
}
