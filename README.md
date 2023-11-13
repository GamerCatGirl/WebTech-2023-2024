# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:
With each pull from git!

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:
The first page is on `http://localhost:3000/home`
Press `Shift+Alt+D` to get Vue dev tools.

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Database seeding

Running `npm run seed` will recreate the database using the `DATABASE_URL` environment variable, or `./sqlite.db` as default.
This will also seed the database with the values from `seed/seedData.ts`.
The recreating of the database is done using the migrations but you can manually do `npm run updateDB` to update your DB to the latest version of your schema without creating new migrations.

## Folders

### Components

Folder to place all your components, components are HTML files (with `.vue` filetype) where you can add `<style></style>`, `<script></script>` and `<template></template>` tags.
The `<template></template>` contain all the HTML code you want to display.

### pages

This is where you put the separate pages, each file is its own page.
This means that `pages/home.vue` will be shown in `<site>/home`.

### public

Public files the site.
e.g. `robots.txt` and `favicon.ico`

### server

Files to use when trying to interact with the server

#### middleware

These files will be ran before going to another route/page (e.g. `<site>/user`), and can check if this is allowed.

#### API

If you want to create an API.

## Database

### SQLite

Chosen because it is easy to set up and we don't need a complicated database.

### Drizzle

We are using an ORM (Object Relation Mapper) called [Drizzle](https://orm.drizzle.team/), this is so we can write our queries in typescript instead of in `SQL`.

Drizzle also automatically creates migrations, these are `SQL` files that tell the database what needs to be changed to change the old database to the new database (e.g. remove this table, add another table).
The migrations are already created so this step is only necessary when you changed the database schema in `database/`.
When you updated the schema (in `database/`), you can run
```bash
npm run generateMigrations
```
to create these migrations.

If you want to remove a migration, run
```bash
npx drizzle-kit drop
```
do this only for migrations that have not been added to the database/pushed to GitHub!!!

Once you created migrations you can update the database using
```bash
npm run updateDB
```
After this you can use the database by running the app.

If you want to look at the database you can use
```bash
npm run showDB
```
This gives an interface to look at all the data in the database.

### Using the database

We are only going to access the database from inside the server,
that means that all the database related code should be in [`server/`](https://nuxt.com/docs/guide/directory-structure/server),
and probably in `server/api/`.

The database is already initialized inside of `server/utils/`,
and because everything in `server/utils/` is automatically imported,
you can use `database` inside of your server files without having to import this.
See [Drizzle](https://orm.drizzle.team/docs/rqb) for more info on querying the database.

## Testing

For testing we use a separate database that is cleared and repopulated before each test using data from `test/data.ts`,
because of this you also have to initialize/update the testing database using
```bash
npm run updateTestDB
```

If you want to look inside of the testing database you can use
```bash
npm run showTestDB
```
Please remember that any changes you make here will be discarded when you rerun your tests,
if you want to change the data inside of the test database change the `test/data.ts` file instead.

To actually run the tests you can use
```bash
npm run test
```

## .env

Make a `.env` file in your root folder,
this file should contain the following variable definitions.
```sh
GOOGLE_CLIENT_ID=__CLIENT_ID__
GOOGLE_CLIENT_SECRET=__CLIENT_SECRET__
DATABASE_URL=__DATABASE_URL__
```
You can get your google client ID and secret [here](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid), and for `DATABASE_URL`, you can use the default value of `./sqlite.db`
