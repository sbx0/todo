C:\Windows\System32\drivers\etc give permission to User
apt install openjdk-17-jdk -y
apt install net-tools -y
cp /mnt/d/Workspace/IdeaProjects/todo/wsl/WSL2Support.java WSL2Support.java
javac WSL2Support.java
java WSL2Support
ping win.sbx0.cn

vim /root/.bashrc

```bash
export https_proxy=http://win.sbx0.cn:11114
export http_proxy=http://win.sbx0.cn:11114
```

source /root/.bashrc

java WSL2Support
service docker start

wsl --shutdown
su
./start.sh
