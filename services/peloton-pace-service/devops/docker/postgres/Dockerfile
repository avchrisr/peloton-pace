# This file is currently not in use. Default postgres image from docker hub is used in docker-compose
# init script is for now done in PostgresDatabaseConfig.java

FROM postgres:11
# ENV POSTGRES_USER myuser               # can be configured for "docker run"
# ENV POSTGRES_PASSWORD mypass
# ENV POSTGRES_DB myuser
COPY init.sql /docker-entrypoint-initdb.d/
