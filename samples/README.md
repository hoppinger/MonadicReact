# Getting started
Setup consists of installing all dependencies with `yarn install` (requires `nodejs` and `yarn`). Alternatively `npm install` will also work.

## Compiling
Running the application requires compiling it. To compile the client-side stylesheets, use

```npm run stylesheets```.

## Running locally

To run the application, use the watchers. For the server, from the `samples` directory, run

```../node_modules/.bin/nodemon app.js```

for the client, from the root directory, run

```npm run webpack```.
