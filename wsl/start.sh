# after wsl start, run this to config host and start docker
# change windows and wsl2 host file
cd /home
java WSL2Support
# start docker
service docker start
# start mysql dev env
cd /home/mysql-dev-env
docker compose up -d
cd /home
