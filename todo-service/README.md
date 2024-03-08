- install wsl2 Ubuntu


- run `wsl --update`
- `sudo -e /etc/wsl.conf`

```text
[boot]
systemd=true
```
- `wsl --shutdown`
- `sudo systemctl status`
- 

- `sudo passwd` set root password
- `su root`
- [install docker](https://docs.docker.com/engine/install/ubuntu/)

# Deploy

- `mkdir dev-env`
- `cd dev-env`
- `vim docker-compose.yml`

```yaml
version: '3.1'

services:
  db:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: justfordev
      TZ: Asia/Shanghai
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

- `cd ..`
- `vim start.sh`

```shell
cd dev-env
docker compose up -d
```

- `chmod u+x start.sh`
- `./start.sh`

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
      - ./dependency:/dependency
    environment:
      - TZ=Asia/Shanghai
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

copy `todo-service/libs/dependency` to `/home/sbx0/todo/service`
copy `todo-service/libs/todo-service-*.jar` to `/home/sbx0/todo/service`
copy `application-prod.yml` to `/home/sbx0/todo/service`

chmod u+x quick.sh

./quick.sh build

./quick.sh up

./quick.sh

# docker use proxy

https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

- `vim /etc/docker/daemon.json`

```json
{ "registry-mirrors": [ "https://dockerproxy.com" ] }
```

- `systemctl daemon-reload`
- `systemctl restart docker`

# use proxy
- `vim ~/.bashrc`

```
# add proxy
export hostip=$(ip route | grep default | awk '{print $3}')
export socks_hostport=10810
export http_hostport=10811
alias proxy='
export https_proxy="http://${hostip}:${http_hostport}"
export http_proxy="http://${hostip}:${http_hostport}"
export ALL_PROXY="socks5://${hostip}:${socks_hostport}"
export all_proxy="socks5://${hostip}:${socks_hostport}"
'
alias unproxy='
unset ALL_PROXY
unset https_proxy
unset http_proxy
unset all_proxy
'
alias echoproxy='
echo $ALL_PROXY
echo $all_proxy
echo $https_proxy
echo $http_proxy
'
#end proxy
```

- `source ~/.bashrc`

# install nginx

apt install nginx -y

# To resolve the issue of the default Ubuntu account being unable to run Docker commands

follow these steps:

Run the command `sudo groupadd docker` to create the 'docker' user group.

Add the current logged-in account to the 'docker' user group by executing `sudo gpasswd -a $USER docker`.

Update the user group by running `newgrp docker`.

These steps will allow the default Ubuntu account to successfully execute Docker commands.

# XShell Connect to WSL2

apt-get remove --purge openssh-server  
apt-get install openssh-server -y  
vim /etc/ssh/sshd_config

```
Port 22
ListenAddress 0.0.0.0
PasswordAuthentication yes
```

service ssh --full-restart

- give C:\Windows\System32\drivers\etc permission to User
- `apt install openjdk-17-jdk -y`
- `apt install net-tools -y`
- `vim WSL2Support.java`

```java
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * setup wsl2 ip to host
 *
 * @author sbx0
 * @since 2022/11/17
 */

public class WSL2Support {

    public static final String WSL_HOSTS = "/etc/hosts";
    public static final String WINDOWS_HOSTS = "/mnt/c/Windows/System32/drivers/etc/hosts";
    public static final String WSL_DOMAIN = "wsl2.sbx0.cn";
    public static final String WINDOWS_DOMAIN = "win.sbx0.cn";
    public static final String TODO_DOMAIN = "todo.sbx0.cn";

    public static void main(String[] args) {
        String wslIp = exec("ifconfig eth0 | grep -w inet | awk '{print $2}'");
        if ("".equals(wslIp)) {
            System.out.println("please 'apt install net-tools' first.");
        }
        String winIp = exec("cat /etc/resolv.conf | grep 'nameserver' | awk '{print $2}'");

        System.out.println("change wsl host");
        changeHost(WSL_HOSTS, wslIp, winIp);
        System.out.println("change windows host");
        changeHost(WINDOWS_HOSTS, wslIp, winIp);
    }

    public static void changeHost(String host, String wlsIpSource, String winIpSource) {
        StringBuilder wslIp = new StringBuilder(wlsIpSource);
        StringBuilder winIp = new StringBuilder(winIpSource);
        Path path = Paths.get(host);
        try {
            boolean findWslDomain = false;
            boolean findWindowsDomain = false;
            List<String> lines = Files.readAllLines(path);
            for (int i = 0, linesSize = lines.size(); i < linesSize; i++) {
                String line = lines.get(i);
                if (line.contains(WSL_DOMAIN)) {
                    System.out.println(line + "\told");
                    line = wslIp.append("\t" + WSL_DOMAIN).toString();
                    System.out.println(line + "\tnew");
                    lines.set(i, line);
                    findWslDomain = true;
                } else if (line.contains(WINDOWS_DOMAIN)) {
                    System.out.println(line + "\told");
                    line = winIp.append("\t" + WINDOWS_DOMAIN).toString();
                    System.out.println(line + "\tnew");
                    lines.set(i, line);
                    findWindowsDomain = true;
                }
            }
            if (!findWslDomain) {
                lines.add(wslIp.append("\t" + WSL_DOMAIN).toString());
            }
            if (!findWindowsDomain) {
                lines.add(winIp.append("\t" + WINDOWS_DOMAIN).toString());
            }
            lines.add(wslIp.append("\t" + TODO_DOMAIN).toString());
            write(host, lines);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void write(String file, List<String> contents) throws IOException {
        FileWriter fw = null;
        try {
            File f = new File(file);
            fw = new FileWriter(f, false);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (fw != null) {
            PrintWriter pw = new PrintWriter(fw);
            for (String line : contents) {
                pw.println(line);
            }
            pw.flush();
            fw.flush();
            pw.close();
            fw.close();
        }
    }

    public static String exec(String command) {
        String[] commands = {"/bin/sh", "-c", command};
        try {
            Process process = Runtime.getRuntime().exec(commands);
            InputStreamReader reader = new InputStreamReader(process.getInputStream());
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuilder resultBuilder = new StringBuilder();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                resultBuilder.append(line);
            }
            return resultBuilder.toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

- `javac WSL2Support.java`
- `java WSL2Support`
- `ping win.sbx0.cn`


