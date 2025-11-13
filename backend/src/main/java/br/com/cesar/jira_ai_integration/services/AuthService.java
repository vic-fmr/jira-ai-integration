package br.com.cesar.jira_ai_integration.services;

import br.com.cesar.jira_ai_integration.dtos.AuthRequestDTO;
import br.com.cesar.jira_ai_integration.exceptions.AuthenticationFailedException;
import br.com.cesar.jira_ai_integration.exceptions.UserAlreadyExistsException;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public String register(AuthRequestDTO dto) {
        if (userRepository.existsByUsername(dto.username())) {
            throw new UserAlreadyExistsException("Usuário: " + dto.username() + " já existe");
        }

        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        User saved = userRepository.save(user);

        return tokenService.generateToken(saved.getUsername());
    }

    public String authenticate(AuthRequestDTO dto) {
        User user = userRepository.findByUsername(dto.username())
                .orElseThrow(() -> new AuthenticationFailedException("Usuário ou senha inválidos"));

        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new AuthenticationFailedException("Usuário ou senha inválidos");
        }

        return tokenService.generateToken(user.getUsername());
    }
}
