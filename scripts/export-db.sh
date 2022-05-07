#!/usr/bin/env bash
set -euo pipefail

read -ep "SOURCE_DB_HOST: " SOURCE_DB_HOST; : "${SOURCE_DB_HOST}"
read -ep "SOURCE_DB_NAME: " SOURCE_DB_NAME; : "${SOURCE_DB_NAME}"
read -ep "SOURCE_DB_USER: " SOURCE_DB_USER; : "${SOURCE_DB_USER}"
read -sp "SOURCE_DB_PASS: " SOURCE_DB_PASS
read -ep "Are you sure you want to proceed? [yN] "

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	echo "Aborting."
	exit 1
fi
DIR="$(dirname ${BASH_SOURCE[0]})"

source "$DIR/import-db-functions.sh"

echo "Starting import…"
source_pg_dump
echo "Done."
