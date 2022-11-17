- install wsl2 Ubuntu 22.04.1 LTS
- `sudo passwd` set root password
- `su root`
- [install docker](https://docs.docker.com/engine/install/ubuntu/)
- `apt install docker-compose`
- `update-alternatives --config iptables` change to iptables-legacy
- `cd home`
- `mkdir mysql-dev-env`
- `cd mysql-dev-env`
- view https://hub.docker.com/_/mysql to find docker-compose.yml
- `vim docker-compose.yml`
- vim /etc/default/docker

```yaml
# Use root/example as user/password credentials
version: '3.1'

services:

  db:
    image: mysql
    # NOTE: use of "mysql_native_password" is not recommended: https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html#upgrade-caching-sha2-password
    # (this is just an example, not intended to be a production configuration)
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: justfordev
    ports:
      - 3306:3306

  adminer:
    image: adminer
    ports:
      - 8080:8080
```
