FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Копируем pom.xml и загружаем зависимости
COPY pom.xml .
RUN mvn dependency:go-offline

# Копируем исходный код и собираем приложение
COPY src ./src
RUN mvn clean package -DskipTests

# Финальный образ (поддерживает ARM64 для Mac M1/M2)
FROM eclipse-temurin:17-jre

WORKDIR /app

# Копируем собранный jar из стадии сборки
COPY --from=build /app/target/*.jar app.jar

# Создаем директорию для базы данных с правильными правами
RUN mkdir -p /app/data && chmod 777 /app/data

# Открываем порт
EXPOSE 5000

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]