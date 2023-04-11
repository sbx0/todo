package cn.sbx0.todo.business.user;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.zaxxer.hikari.HikariDataSource;
import io.micrometer.core.instrument.util.IOUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * @author sbx0
 * @since 2023/4/11
 */
@Slf4j
class ClientUserServiceTest {
    public static final String RSA = "RSA";
    public static final String EMPTY_STRING = "";
    private static ClientUserService userService;

    @BeforeAll
    static void beforeAll() throws Exception {
        File publicKeyFile = ResourceUtils.getFile(ResourceUtils.CLASSPATH_URL_PREFIX + "app.pub");
        File privateKeyFile = ResourceUtils.getFile(ResourceUtils.CLASSPATH_URL_PREFIX + "app.key");
        String publicKeyValue = IOUtils.toString(new FileInputStream(publicKeyFile), StandardCharsets.UTF_8);
        String privateKeyValue = IOUtils.toString(new FileInputStream(privateKeyFile), StandardCharsets.UTF_8);
        RSAPublicKey publicKey = getPublicKey(publicKeyValue);
        JWK jwk = new RSAKey.Builder(publicKey).privateKey(getPrivateKey(privateKeyValue)).build();
        JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
        JwtEncoder encoder = new NimbusJwtEncoder(jwkSource);
        JwtDecoder decoder = NimbusJwtDecoder.withPublicKey(publicKey).build();
        userService = new ClientUserService(new HikariDataSource(), encoder, decoder);
    }

    public static RSAPublicKey getPublicKey(String publicKey) throws Exception {
        // copy from org.springframework.boot.autoconfigure.security.oauth2.resource.reactive.ReactiveOAuth2ResourceServerJwkConfiguration
        publicKey = publicKey.replace("-----BEGIN PUBLIC KEY-----", EMPTY_STRING).replace("-----END PUBLIC KEY-----", EMPTY_STRING);
        byte[] keyBytes = Base64.getMimeDecoder().decode(publicKey.getBytes());
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        return (RSAPublicKey) keyFactory.generatePublic(spec);
    }

    public static RSAPrivateKey getPrivateKey(String privateKey) throws Exception {
        // copy from com.mysql.cj.protocol.ExportControlled
        privateKey = privateKey.replace("-----BEGIN PRIVATE KEY-----", EMPTY_STRING).replace("-----END PRIVATE KEY-----", EMPTY_STRING);
        byte[] keyBytes = Base64.getMimeDecoder().decode(privateKey.getBytes());
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA);
        return (RSAPrivateKey) keyFactory.generatePrivate(spec);
    }

    @Test
    void testCreateToken() {
        long expireSecond = 60;
        long recreateSecond = 30;
        Instant now = Instant.now();
        String tokenValue = userService.createToken("1", "1", now, now.plusSeconds(expireSecond));
        Jwt jwtToken = userService.getToken(tokenValue);
        Instant expiresAt = jwtToken.getExpiresAt();
        assertNotNull(expiresAt);
        // now 0s is before 60s
        assertTrue(now.isBefore(expiresAt));
        // now 30s if before 60s
        assertTrue(now.plusSeconds(recreateSecond).isBefore(expiresAt));
        // now 31s is after (60s - 30s)
        assertTrue(now.plusSeconds(recreateSecond + 1).isAfter(expiresAt.minusSeconds(recreateSecond)));
    }

    @Test
    void testGetToken() {
    }
}