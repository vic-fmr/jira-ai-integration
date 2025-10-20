package br.com.cesar.jira_ai_integration.controller;

import br.com.cesar.jira_ai_integration.models.AppUser;
import br.com.cesar.jira_ai_integration.services.DatabaseUserDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    private final DatabaseUserDetailsService userService;

    public RegistrationController(DatabaseUserDetailsService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest req) {
        try {
            AppUser saved = userService.register(req.getUsername(), req.getPassword());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("endpoint público");
    }

    @GetMapping("/private")
    public ResponseEntity<String> privateEndpoint(Principal principal) {
        // O objeto 'Principal' contém as informações do usuário autenticado
        String username = principal.getName();
        return ResponseEntity.ok("Olá, " + username + "! Este é um recurso seguro. Você está autenticado.");
    }
}

class RegistrationRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}