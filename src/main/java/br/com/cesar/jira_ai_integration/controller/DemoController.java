package br.com.cesar.jira_ai_integration.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class DemoController {

    // Endpoint público, acessível por qualquer um
    @GetMapping("/public")
    public String getPublicResource() {
        return "Olá! Este é um recurso público. Todos podem ver isso.";
    }

    // Endpoint seguro, acessível apenas por usuários autenticados
    @GetMapping("/secure")
    public String getSecureResource(Principal principal) {
        // O objeto 'Principal' contém as informações do usuário autenticado
        String username = principal.getName();
        return "Olá, " + username + "! Este é um recurso seguro. Você está autenticado.";
    }
}