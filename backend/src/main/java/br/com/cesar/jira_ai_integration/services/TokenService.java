package br.com.cesar.jira_ai_integration.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Service
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);

    private final Key key;
    private final long expirationMillis;

    public TokenService(Environment env,
                        @Value("${app.jwt.secret:}") String propertySecret,
                        @Value("${app.jwt.expiration-ms:3600000}") long expirationMillis) {
        this.expirationMillis = expirationMillis;

        // 1) Prefer secret from a file pointed by APP_JWT_SECRET_FILE (more secure for containers/secret mounts)
        String secret = null;
        String secretFile = env.getProperty("APP_JWT_SECRET_FILE");
        if (secretFile != null && !secretFile.isBlank()) {
            try {
                secret = Files.readString(Path.of(secretFile)).trim();
                log.info("Loaded JWT secret from file '{}'.", secretFile);
            } catch (IOException e) {
                throw new IllegalStateException("Failed to read JWT secret file: " + secretFile, e);
            }
        }

        // 2) Then prefer environment variable APP_JWT_SECRET
        if (secret == null || secret.isBlank()) {
            String envSecret = env.getProperty("APP_JWT_SECRET");
            if (envSecret != null && !envSecret.isBlank()) {
                secret = envSecret.trim();
                log.info("Loaded JWT secret from environment variable APP_JWT_SECRET.");
            }
        }

        // 3) Finally fallback to application property app.jwt.secret (if provided)
        if (secret == null || secret.isBlank()) {
            if (propertySecret != null && !propertySecret.isBlank()) {
                secret = propertySecret.trim();
                log.info("Loaded JWT secret from application property 'app.jwt.secret'.");
            }
        }

        // 4) If still missing, use a dev fallback but log a clear warning
        if (secret == null || secret.isBlank()) {
            secret = "defaultsecretchangeme";
            log.warn("No JWT secret configured (APP_JWT_SECRET_FILE, APP_JWT_SECRET or app.jwt.secret). Using insecure default secret for development. Set APP_JWT_SECRET (or APP_JWT_SECRET_FILE) in production.");
        }

        // Try Base64 decode, otherwise use raw bytes
        byte[] keyBytes;
        try {
            byte[] decoded = Base64.getDecoder().decode(secret);
            if (decoded != null && decoded.length > 0) {
                keyBytes = decoded;
            } else {
                keyBytes = secret.getBytes();
            }
        } catch (IllegalArgumentException e) {
            keyBytes = secret.getBytes();
        }

        // Ensure minimum key length for HMAC-SHA (32 bytes for HS256). If shorter, pad deterministically but log a warning.
        if (keyBytes.length < 32) {
            log.warn("JWT secret is shorter than recommended ({} bytes). Padding to {} bytes; please provide a 256-bit (32-byte) secret, preferably Base64-encoded.", keyBytes.length, 32);
            keyBytes = padKey(keyBytes);
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    private static byte[] padKey(byte[] k) {
        if (k.length >= 32) return k;
        byte[] padded = new byte[32];
        for (int i = 0; i < 32; i++) {
            padded[i] = k[i % k.length];
        }
        return padded;
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
