#!/bin/bash
# chmod u+x this.sh
# sed -i 's/\r//' this.sh

NAME="todo-service"

log() {
 docker logs -f -n 250 todo-service-todo-service-1
 #tail -F -n 250 logs/current.log
}

build() {
 docker build -t $NAME:v$(date "+%Y%m%d.%H%M%S") .
 docker build -t $NAME:latest .
 up
}

up() {
 docker compose -p $NAME up -d --build
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
