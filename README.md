# Node-Todo

## Run Locally

Install Dependencies:
```sh
npm i
```

To run the dev server for your app, use:

```sh
npx nx serve node-todo
```

To create a production bundle:

```sh
npx nx build node-todo
```


To run a production bundle:

```sh
node dist/apps/node-todo/main.js
```

## Run Docker
To run in docker container:

```sh
docker compose up --build
```