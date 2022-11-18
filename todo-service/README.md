- install wsl2 Ubuntu 22.04.1 LTS
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
