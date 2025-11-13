package br.com.cesar.jira_ai_integration.controllers;

import br.com.cesar.jira_ai_integration.dtos.AuthRequestDTO;
import br.com.cesar.jira_ai_integration.dtos.AuthResponseDTO;
import br.com.cesar.jira_ai_integration.dtos.UserInfoDTO;
import br.com.cesar.jira_ai_integration.models.User;
import br.com.cesar.jira_ai_integration.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
        String token = authService.authenticate(dto);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new UserInfoDTO(user.getUsername()));
    }
}
