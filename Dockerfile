# Use Eclipse Temurin Java 17 runtime image
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy the generated jar file (with correct name)
COPY target/FirstGrocery-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
