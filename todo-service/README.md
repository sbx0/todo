_- install wsl2 Ubuntu 22.04.1 LTS
- `sudo passwd` set root password
- `su root`
- [install docker](https://docs.docker.com/engine/install/ubuntu/)
- `update-alternatives --config iptables` change to iptables-legacy
- `cd home`
- `mkdir mysql-dev-env`
- `cd mysql-dev-env`
- view https://hub.docker.com/_/mysql to find docker-compose.yml
- `vim docker-compose.yml`

```yaml
version: '3.1'

services:
  db:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: justfordev
    ports:
      - 3306:3306
    volumes:
      - ./mysql:/var/lib/mysql
  cache:
    image: redis
    container_name: redis
    command: redis-server --requirepass justfordev
    ports:
      - 6379:6379
    volumes:
      - ./redis:/data                          
```

- docker compose up -d

# Deploy

vim Dockerfile

```dockerfile
FROM eclipse-temurin:17

MAINTAINER sbx0

ADD /*.jar /bootstrap.jar
ADD /application-prod.yml /application-prod.yml

CMD java -jar /bootstrap.jar --spring.profiles.active=prod
```

vim docker-compose.yml

```yml
version: '3.7'
services:
  todo-service:
    image: todo-service:latest
    ports:
      - "1112:9999"
    volumes:
      - ./logs:/logs
```

vim quick.sh

```shell
#!/bin/bash
# chmod u+x this.sh
# sed -i 's/\r//' this.sh

NAME="todo-service"

log() {
 tail -F -n 250 logs/current.log
}

build() {
 docker build -t $NAME:v$(date "+%Y%m%d.%H%M%S") .
 docker build -t $NAME:latest .
}

up() {
 docker-compose -p $NAME up -d --build
 log
}

case "$1" in
"up" )
 up
 ;;
"build" )
 build $2
 ;;
*)
 log
 ;;
esac
```

chmod u+x quick.sh

./quick.sh build

./quick.sh up

./quick.sh
