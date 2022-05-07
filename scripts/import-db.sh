#!/usr/bin/env bash
set -euo pipefail

read -ep "TARGET_DB_NAME: " TARGET_DB_NAME; : "${TARGET_DB_NAME}"
echo
echo -e "\e[31m\e[1mThis is about to COMPLETELY WIPE and OVERWRITE the database $TARGET_DB_NAME.\e[0m"
read -ep "Are you sure you want to proceed? [yN] "

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	echo "Aborting."
	exit 1
fi
DIR="$(dirname ${BASH_SOURCE[0]})"

source "$DIR/import-db-functions.sh"

echo "Starting import…"
docker-compose exec -T postgres bash -c "dropdb --if-exists --username \${POSTGRES_USER} ${TARGET_DB_NAME}"
docker-compose exec -T postgres bash -c "createdb --username \${POSTGRES_USER} ${TARGET_DB_NAME}"
cat source.sql | docker-compose exec -T postgres bash -c "psql --username \${POSTGRES_USER} -d ${TARGET_DB_NAME}"
echo "Done."
