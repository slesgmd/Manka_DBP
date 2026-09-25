package com.manka.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "JPA_DDL_AUTO=create-drop",
        "DB_URL=jdbc:h2:mem:manka-prod-test;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
        "DB_USERNAME=sa",
        "DB_PASSWORD=",
        "JWT_SECRET=test-secret-key-with-at-least-thirty-two-bytes",
        "CORS_ALLOWED_ORIGINS=http://localhost:3000",
        "MAIL_HOST=localhost",
        "MAIL_FROM=no-reply@example.invalid"
})
@ActiveProfiles("prod")
class MankaBackendApplicationTests {

    @Autowired
    private Environment environment;

    @Test
    void contextLoads() {
        assertThat(environment.getProperty("spring.jpa.hibernate.ddl-auto")).isEqualTo("create-drop");
    }
}
