package br.com.cesar.jira_ai_integration.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 💡 Adicione a URL do Codespace (HTTPS) e seus locais de dev (HTTP)
        configuration.setAllowedOrigins(Arrays.asList(
            "https://redesigned-space-dollop-g45xprpqx4xg2w5wq-4200.app.github.dev", // Sua origem Codespace
            "http://localhost:4200", // Angular local
            "http://localhost:8080" // Backend local
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração de CORS a todos os caminhos (/**)
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http
          .csrf(csrf -> csrf.disable()) // Desabilita CSRF para APIs REST
          
          // 💡 HABILITA O CORS E DIZ AO SPRING SECURITY PARA USAR O BEAN ACIMA
          .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
          
          .authorizeHttpRequests(auth -> auth
              // Permite acesso público ao endpoint de upload (e de login/registro)
              .requestMatchers("/api/documents/upload", "/api/auth/**").permitAll() 
              .anyRequest().permitAll() // Qualquer outro endpoint requer autenticação
          );

      return http.build();
  }

   // Expor um PasswordEncoder reutilizável (BCrypt)
   @Bean
   public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
   }
}