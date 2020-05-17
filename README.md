# restify-typeorm-starter

A functional REST API server start with restify and typeorm

## Tech stack

- typescript
- restify (server)
- typeorm (database manager)
- inversify (DI)
- inversify-restify-utils
- docker

## Authentication

- [bcryptjs](https://github.com/kelektiv/node.bcrypt.js): A library to help you hash passwords.

### docker mysql

- url: https://hub.docker.com/_/mysql
- version: 8.0

**Known issue**

[stackoverflow](https://stackoverflow.com/a/56509065/1219719)

> MySQL 8 has supports pluggable authentication methods. By default, one of them named caching_sha2_password is used rather than our good old mysql_native_password ([source](https://dev.mysql.com/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html)).

- How to fix?

1. After bring up the server in docker, connect to `db-mysql` container:

```sh
$ docker exec -it <container_id> sh
```

2. Login mysql as `root` user in the docker container

```sh
$ mysql -uroot -p
```
enter root password.

3. Update the authentication method in mysql for the db user.

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```
change `root`, `localhost` and `password` as needed. Then refresh the privileges:
```sql
flush privileges;
```

4. Restart the docker-compose
