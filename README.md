# Installation

## Docker

To set up the environment, you will need to first install [Docker](https://docs.docker.com/engine/install/).
This test uses Docker Compose to run everything.

## Backend Server

The backend server uses Node.js, but you don't need to have that installed on your machine. You can install
the dependencies by running:

```bash
docker compose run server npm i
```

## Database

To bring up the database:

```bash
docker compose up -d db
```

Once it's ready to go, you can run the schema migrator to build the schema:

```bash
docker compose run migrate
```

If that fails (because of something like an already existing table), you can always start with a clean slate
by bringing the DB container down:

```bash
docker compose down
```

## Endpoints

```bash
POST /worker
```

```bash
POST /location
```

Each endpoint accepts the following request body. If no body is included `/worker` will return the total labor cost of each worker, while `/location` will return the total labor cost at each location.

```json
{
    "worker_ids": ["id1", "id2", "id3", ...],
    "location_ids": ["loc 1", "loc 2", ...],
    "is_complete": "string"
}
```

Including `worker_ids` or `location_ids` will limit the results to those `ids` respectively. If they aren't included all workers and locations will be used to calculate total cost. `is_complete` can be `incomplete`, `complete`, or `both`. Using `incomplete` or `complete` will result in cost only being calculated for tasks that are either `incomplete` or `complete` respectively. Any other value in `is_complete` will be treated as `both`, meaning that tasks status will not affect if it's include in total cost. 

Examples
```bash
POST /worker
```
with this body
```json
{
    "worker_ids": ["id1"],
    "location_ids": ["loc 1"],
    "is_complete": "complete"
}
```

Will return the total labor costs for for done by worker `id1` at location `loc 1` on completed tasks only