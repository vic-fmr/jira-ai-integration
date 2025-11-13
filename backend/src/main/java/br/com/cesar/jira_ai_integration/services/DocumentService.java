package br.com.cesar.jira_ai_integration.services;

import br.com.cesar.jira_ai_integration.models.Document;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Transactional
    public Document uploadAndExtract(MultipartFile file, User currentUser) throws Exception {
        Document document = upload(file, currentUser);

        String content = extractTextFromFile(file);

        System.out.println("DEBUG: Texto extraído (primeiras 200 chars): " + 
                           content.substring(0, Math.min(content.length(), 200)));
                        
        // 3. 💡 CHAMA O SERVIÇO DE IA (Próxima etapa)
        // aiService.generateSuggestions(savedDocument.getId(), extractedText);

        return document;
    }

    @Transactional
    public String extractTextFromFile(MultipartFile file) throws Exception {
        
        BodyContentHandler handler = new BodyContentHandler(-1);

        Metadata metadata = new Metadata();

        AutoDetectParser parser = new AutoDetectParser();

        try (InputStream stream = file.getInputStream()) {
            parser.parse(stream, handler, metadata);
            return handler.toString();
        } catch (Exception e) {
            throw new Exception("Erro ao extrair texto do arquivo: " + e.getMessage());

        }

        
    }

    @Transactional
    public Document upload(MultipartFile file, User currentUser) throws Exception {
        // RF-S01 exige validação de formato (ex: .pdf, .docx, .txt)
        // *Implementar validação do 'file' aqui*

        // **Salvar o arquivo físico**
        // String storagePath = saveFileToDisk(file);

        Document document = new Document();
        document.setFilename(file.getOriginalFilename());
        document.setUser(currentUser);

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
