#!/bin/bash
# chmod u+x this.sh
# sed -i 's/\r//' this.sh

NAME="todo-web"

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
