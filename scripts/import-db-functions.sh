
source_pg_dump() {
	docker run \
		--rm \
		--init \
		--env PGHOST="$SOURCE_DB_HOST" \
		--env PGDATABASE="$SOURCE_DB_NAME" \
		--env PGUSER="$SOURCE_DB_USER" \
		--env PGPASSWORD="$SOURCE_DB_PASS" \
		postgres:13.5-alpine \
		pg_dump --serializable-deferrable --no-owner --no-acl \
		> source.sql
}
