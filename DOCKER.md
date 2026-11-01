# Docker Manual

This project uses Docker Compose to run the REST API in a container and connect
it to MongoDB Atlas. MongoDB itself is not run in Docker.

## Requirements

- Docker Desktop (Windows or macOS), or Docker Engine with the Docker Compose
  plugin (Linux)
- A project `.env` file

## Configure the environment

From the project directory, create `.env` from the example:

```powershell
Copy-Item .env.example .env
```

In `.env`, set `MONGODB_URI` to the connection string from your Atlas cluster,
`DATABASE` to your database name, and `JWT_SECRET` to a long, random secret.
Replace all placeholders in the example URI with your Atlas values; do not
include the angle brackets. URL-encode special characters in the database
username or password. Do not commit `.env`.

In Atlas, create a database user and add the public IP address of the machine
running Docker under **Network Access**. Use the Atlas-provided connection
string as the value of `MONGODB_URI`.

## Build and start the API

Build the API image and start the container in the background:

```powershell
npm run docker
```

To run Compose in the foreground and view live logs in the current terminal:

```powershell
npm run docker:interactive
```

Press `Ctrl+C` to stop the foreground container. This runs the API with live
output; it does not open a shell inside the container.

Check the container status and health:

```powershell
docker compose ps
```

Follow the API logs:

```powershell
docker compose logs -f api
```

The API listens on port `3000` inside the container. Compose publishes it on the
host port specified by `PORT` in `.env` (default `3000`). For example, with
`PORT=8080`, open `http://localhost:8080`. Check readiness with:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

If you changed `PORT`, replace `3000` in the URL with your host port.

## Seed the initial admin

Fill in `ADMIN_NAME`, `ADMIN_AGE`, `ADMIN_EMAIL`, `ADMIN_ADDRESS`, and
`ADMIN_PASSWORD` in `.env`. The seed password must be at least 12 characters
and include uppercase and lowercase letters, a number, and a special character.
Then run:

```powershell
docker compose run --rm api npm run seed:admin
```

The command connects to MongoDB Atlas and can be run again safely; an existing
admin account is left unchanged.

## Stop and remove the container and image

Stop and remove the API container, its Compose network, and the locally built
API image:

```powershell
npm run docker:remove
```

The API image is rebuilt the next time you run `npm run docker`. MongoDB data is
stored in Atlas and is not deleted by this command.

## Rebuild after code changes

Run `npm run docker` to rebuild the image and start the updated container. The
image installs production dependencies only. The local `.env`, Git metadata,
and `node_modules` are excluded from the build context.
