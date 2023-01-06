_- install wsl2 Ubuntu 22.04.1 LTS

- `sudo passwd` set root password
- `su root`
- [install docker](https://docs.docker.com/engine/install/ubuntu/)
- `update-alternatives --config iptables` change to iptables-legacy
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
# after wsl start, run this to config host and start docker
# change windows and wsl2 host file
java WSL2Support
apt update
apt upgrade -y
# start docker
service docker start
# start dev env
cd dev-env
docker compose up -d
```

- `chmod u+x start.sh`
- `./start.sh`

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
      - /etc/timezone:/etc/timezone
      - ./logs:/logs
      - ./extLibs:/extLibs
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
