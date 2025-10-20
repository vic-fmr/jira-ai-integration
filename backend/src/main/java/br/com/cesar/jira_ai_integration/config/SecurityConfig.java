package br.com.cesar.jira_ai_integration.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        // Permitir registro público e endpoint público
                        .requestMatchers("/api/register", "/api/public").permitAll()
                        // Qualquer outra requisição requer autenticação
                        .anyRequest().authenticated()
                )
                // Habilita autenticação básica (para simplicidade)
                .httpBasic(Customizer.withDefaults())
                // Desabilita CSRF para API
                .csrf(csrf -> csrf.disable());

        return http.build();
    }

    // Expor um PasswordEncoder reutilizável (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}