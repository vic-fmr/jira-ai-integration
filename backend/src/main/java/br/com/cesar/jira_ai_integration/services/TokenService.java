package br.com.cesar.jira_ai_integration.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Service
public class TokenService {

    private final Key key;
    private final long expirationMillis;

    public TokenService(@Value("${app.jwt.secret:defaultsecretchangeme}") String secret,
                        @Value("${app.jwt.expiration-ms:3600000}") long expirationMillis) {
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

        this.key = Keys.hmacShaKeyFor(padKey(keyBytes));
        this.expirationMillis = expirationMillis;
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
