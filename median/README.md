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
