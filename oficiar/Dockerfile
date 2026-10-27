# Etapa 1: compilar el proyecto con Maven y Java 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Primero solo el pom, para que las dependencias queden en caché entre despliegues
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

# Etapa 2: imagen liviana que solo ejecuta el JAR
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/oficiar-0.0.1-SNAPSHOT.jar app.jar

# El plan gratis de Render tiene 512 MB; la JVM usa como máximo el 75 %
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -XX:TieredStopAtLevel=1"

# Render asigna el puerto en la variable PORT (application.properties ya la lee)
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
