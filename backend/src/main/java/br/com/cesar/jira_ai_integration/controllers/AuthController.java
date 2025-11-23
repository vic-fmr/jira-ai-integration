package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.AuthRequestDTO;
import br.com.cesar.jira_ai_integration.dtos.AuthResponseDTO;
import br.com.cesar.jira_ai_integration.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody AuthRequestDTO dto) {
        String token = authService.register(dto);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO dto) {
        String token = authService.login(dto);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

}
