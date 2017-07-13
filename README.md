# Introduction
What is this project, what makes it relevant.

# Sample usage

# React monad

## Introduction to monads

## Core

## Primitives

## Html

## Combinators

## Templates

## Injecting custom react components

## Advanced

### Building your own templates

### Building your own combinators



# Getting started
Setup consists of:
- installing the client-side libraries with `yarn install` (requires `nodejs` and `yarn`);
- installing the server-side libraries with `dotnet restore` (requires `dotnet core`);

## Compiling
Running the application requires compiling it. To compile the client-side stylesheets, use

```gulp stylesheets```

to compile the dotnet server, use

```dotnet build```

to compile the frontend application, use

```tsc```

and to compile the stylesheets, use

```gulp```.

## Run locally

To run the application, use the watchers. For the server

```ASPNETCORE_ENVIRONMENT=development dotnet watch run```

for the client

```.\node_modules\.bin\webpack -w```.
