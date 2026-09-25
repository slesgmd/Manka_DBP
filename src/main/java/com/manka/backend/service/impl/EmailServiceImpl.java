package com.manka.backend.service.impl;

import com.manka.backend.service.EmailService;
import com.manka.backend.exception.EmailDeliveryException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final boolean mailEnabled;
    private final String fromAddress;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            SpringTemplateEngine templateEngine,
            @Value("${mail.enabled:false}") boolean mailEnabled,
            @Value("${spring.mail.from:no-reply@manka.local}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.mailEnabled = mailEnabled;
        this.fromAddress = fromAddress;
    }

    @Override
    @Async("applicationTaskExecutor")
    public void sendWelcomeEmail(String name, String email) {
        Context context = new Context();
        context.setVariable("name", name);
        send(email, "Welcome to Manka", "email/welcome", context);
    }

    @Override
    @Async("applicationTaskExecutor")
    public void sendCookingConfirmation(String name, String email, String dishName, Instant cookedAt) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("dishName", dishName);
        context.setVariable(
                "cookedAt",
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
                        .withZone(ZoneId.of("America/Lima"))
                        .format(cookedAt)
        );
        send(email, "Dish added to your Manka history", "email/dish-cooked", context);
    }

    private void send(String recipient, String subject, String template, Context context) {
        if (!mailEnabled) {
            LOGGER.info("Email delivery disabled: subject={}, recipient={}", subject, recipient);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, StandardCharsets.UTF_8.name());
            helper.setFrom(fromAddress);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(templateEngine.process(template, context), true);
            mailSender.send(message);
        } catch (MessagingException | MailException exception) {
            throw new EmailDeliveryException("Email delivery failed for recipient " + recipient, exception);
        }
    }
}
