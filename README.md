# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

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
