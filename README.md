# Bands builder

### Features
* A user can create profile and choose band role (instrument)
* A user can browse existing songs
* A user can browse pending jams
* A user (host) can create a public jam based on a song
* A user can join a publicly available jam
* A user (host) can start created jam when all song roles have assigned performers
* A user can be notified when jam starts

### Examples:
  * Performers choose their band role on their character creation point, but there might be multi-instrumentalists.
  * Starting a jam locks the players in their roles, but we bet there might be a role rotating jam mode.
  * There's only performers receiving notes now, future update is to notify all jam subscribers.

### TODO:
* Add Auth with JWT
* Add Cron job for notifications
* Add Redis cache
* Add RabbitMQ
* Run sqlite3 in dev/test and postgres in prod
* Add Swagger docs


# Docker Prometheus Grafana Monitoring
```
docker-compose up -d --build api
```

## Start Prometheus, Grafana & Dashboards

```
docker-compose up -d prometheus
docker-compose up -d grafana
docker-compose up -d grafana-dashboards
```

## Check Dashboards
```
http://localhost:3000

```
