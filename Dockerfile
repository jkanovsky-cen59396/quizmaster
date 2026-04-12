FROM ghcr.io/scrumdojo/dev-quizmaster:v4 AS builder
WORKDIR /quizmaster
COPY --chown=dev:dev . .
RUN pnpm install && pnpm install:fe
RUN pnpm build:fe:prod
RUN pnpm build:be:prod

FROM eclipse-temurin:21-jre
COPY --from=builder /quizmaster/backend/build/libs/*.jar quizmaster.jar
EXPOSE 8080
CMD ["java", "-jar", "quizmaster.jar"]
