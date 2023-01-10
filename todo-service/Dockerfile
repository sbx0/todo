FROM eclipse-temurin:17

MAINTAINER sbx0

ADD /*.jar /bootstrap.jar
ADD /application-prod.yml /application-prod.yml

CMD java -jar /bootstrap.jar --spring.profiles.active=prod
