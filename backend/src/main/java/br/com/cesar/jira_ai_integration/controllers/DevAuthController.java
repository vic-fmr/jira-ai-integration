package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.AuthRequestDTO;
import br.com.cesar.jira_ai_integration.dtos.AuthResponseDTO;
import br.com.cesar.jira_ai_integration.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Controller para geração de tokens de autenticação em ambiente de desenvolvimento
// (perfil "dev"). Permite obter um token JWT para um usuário de desenvolvimento pré-configurado.
// (chamar via: GET /api/auth/dev/token?username=devuser&password=devpassword
// no postman sempre que for testar endpoints protegidos.

@RestController
@Profile("dev")
@RequiredArgsConstructor
@RequestMapping("/api/auth/dev")
public class DevAuthController {

    private final AuthService authService;

    @GetMapping("/token")
    public ResponseEntity<AuthResponseDTO> getDevToken(
            @RequestParam(defaultValue = "devuser") String username,
            @RequestParam(defaultValue = "devpassword") String password) {

        AuthRequestDTO dto = new AuthRequestDTO(username, password);

        String token = authService.login(dto);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }
}