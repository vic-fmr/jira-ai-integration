package br.com.cesar.jira_ai_integration.config;

import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;


// Classe para desenvimento: cria um usuário
// padrão quando o perfil "dev" está ativo
// (para não precisar ficar logando toda hora)

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String username = "devuser";
        String rawPassword = "devpassword";

        if (userRepository.findByUsername(username).isEmpty()) {
            User u = new User();
            u.setUsername(username);
            u.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(u);
            System.out.println("Usuário de desenvolvimento criado: " + username + " / " + rawPassword);
        } else {
            System.out.println("Usuário de desenvolvimento já existe: " + username);
        }
    }
}