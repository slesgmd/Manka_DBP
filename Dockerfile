FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn ./.mvn
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw
RUN ./mvnw -B dependency:go-offline
COPY src ./src
RUN ./mvnw -B clean package

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
RUN addgroup -S manka && adduser -S manka -G manka
COPY --from=build /workspace/target/manka-backend-0.0.1-SNAPSHOT.jar app.jar
USER manka
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 CMD wget -q -O - http://localhost:${PORT:-8080}/actuator/health || exit 1
ENTRYPOINT ["java", "-Xmx512m", "-jar", "/app/app.jar"]
