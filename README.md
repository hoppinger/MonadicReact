# Getting started
As the application is generated, then both the client application and the server application packages are setup for you, together with the database creation and seeding.

If this has not been the case, or the application has been put in a repository and then pulled on a fresh machine, then setup will consist of:
- installing the client-side libraries with `yarn install` (requires `nodejs` and `yarn`);
- installing the server-side libraries with `dotnet restore` (requires `dotnet core`);
- creating the database migrations with `dotnet ef migrations add Setup -c XXX`, where `XXX` is the name of the database context (which was specified when scaffolding the application);
- creating the database itself with `dotnet ef database update -c XXX`.

## Compiling
Running the application requires compiling it. To compile the client-side stylesheets, use

```gulp stylesheets```

to compile the dotnet server, use

```dotnet build```

to compile the frontend application, use

```tsc```.

## Run locally

To run the application, use the watchers. For the server

```ASPNETCORE_ENVIRONMENT=development dotnet watch run```

for the client

```.\node_modules\.bin\webpack -w```

and for the stylesheets

```gulp stylesheets-watch```


## Note on the database
The scaffolded application makes use of SQLite by default. This makes destroying and recreating the database simple and fast: very handy if quickly scaffolding lots of prototypes.

By changing the database provider in the spec

```"database_provider": "postgresql",```

The application will be scaffolded using postgres.


## Project structure
The application is an ASP. Net Core MVC application with the following directories:
- `Client`, with the various React components:
  - `containers`, with React libraries used by the components;
  - `stylesheets`, with scss files for the generic (default) styling;
  - `custom_views.ts`, where custom views can be injected;
  - `generated_api.ts`, where the client-side api functions are created that mirror the server-side endpoints;
  - `generated_models.ts`, where the models are defined for the client-side;
  - `generated_views`, where the react views are defined;
- `Controllers`, with the various ASP.Net Core controllers for both API and views;
- `generated_authentication_helpers.cs`, with a few utilities for authentication and session management;
- `gulpfile.js`, with the building system for the Client-side resources (typescript and scss files);
- `webpack.config.js`, with the building system for the Client-side resources (typescript and scss files);
- `Models`, with the server-side models and database connection specification;
- `Views`, with the server-side views which only instantiate the React components.
