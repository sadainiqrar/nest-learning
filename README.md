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


To run production bundle:

```sh
node dist/apps/node-todo/main.js
```

## Run Docker

1. Create production bundle:

```sh
npx nx build node-todo
```

2. Build Docker Image:

```sh
docker build -f Dockerfile.node-todo -t node-todo .
```

3. Run Docker image:

```sh
docker run -d -p 3000:3000 node-todo
```