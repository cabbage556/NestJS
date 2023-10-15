# Migrate the database

With the Prisma schema defined, you will run migrations to create the actual tables in the database.

```bash
npx prisma migrate dev --name 'init'
```

1. Save the migration

   - Prisma Migrate will take a snapshot of your schema and figure out the SQL commands necessary to carry out the migration.
   - Prisma will save the migration file containing the SQL commands to the newly created `prisma/migrations` folder.

2. Execute the migration

   - Prisma Migrate will execute the SQL in the migration file to create the underlying tables in your database.

3. Generate Prisma Client

   - Prisma will generate Prisma Client based on your latest schema.
   - Since you did not have the Client library installed, the CLI will install it for you as well. You should see the `@prisma/client` package inside `dependencies` in your `package.json` file.
   - Prisma Client is a TypeScript query builder auto-generated from your Prisma schema. It is tailored to your Schema and will be used to send queries to the database.

# Perform input validation

Pipes operate on the arguments being processed by a route handler. Nest invokes a pipe before the route handler, and the pipe receives the arguments destined for the route handler. Pipes are similar to middleware, but the scope of pipes is limited to processing input arguments.

Pipes have two typical use cases:

- `Validation`

  - Evaluate input data and, if valid, pass it through unchanged; otherwise, throw an exception when the data is incorrect.

- `Transformation`

  - Transform input data to the desired form (e.g., from string to integer).

A NestJS validation pipe will check the arguments passed to a route. If the arguments are valid, the pipe will pass the arguments to the route handler without any modification. However, if the arguments violate any of the specified validation rules, the pipe will throw an exception.

# Strip unnecessary properties from client requests

It is possible to send additional properties that are not defined in the DTO. This can lead to unforeseen bugs or security issues. For example, you could manually pass invalid `createdAt` and `updatedAt` values to the `POST /articles` endpoint. Since TypeScript type information is not available at run-time, your application will not be able to identify that these fields are not available in the DTO.

```json
{
  "title": "example-title",
  "description": "example-description",
  "body": "example-body",
  "published": true,
  "createdAt": "2010-06-08T18:20:29.309Z",
  "updatedAt": "2021-06-02T18:20:29.310Z"
}
```

In this way, you can inject invalid values. You have created an article that has an `updatedAt` value that precedes `createdAt`, which does not make sense.

To prevent this, you will need to filter any unnecessary fields/properties from client requests. NestJS provides an out-of-the-box for this as well. All you need to do is pass the `whitelist: true` option when initializing `ValidationPipe` inside your application.

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // filter any unnecessary fields from client requests
  }),
);
```

`ValidationPipe` will automatically remove all non-whitelisted properties, where "non-whitelisted" means properties without any validation decorators. It's important to note that this option will filter all properties without validation decorators, even if they are defined in the DTO.
