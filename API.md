# API

If you want to add query parameters in your request you can do this by adding a `?` at the end of your request,
and then adding the name of your parameter followed by an `=` and the value.
To add multiple parameters you can separate them using an `&`.
If you, for example want to set `size` to `55` and `page` to `5` you would do `<rout>?size=55&page=5`.

`size` and `page` will be used multiple times in these requests,
`size` is to say how many objects you want returned, and `page` is to say which objects.
So if `size` is `100` and `page` is 0, you will get objects `1-100`, if `page` is `1` you will get objects `101-200`.

## `api/isup`

This will return `true` if the server is running,
and nothing if the server is not running.

## `api/recipes`

This will return the first `size` recipes in the database, or `100` if size is not given.
`page` can be used here.

### Search

If you add the `search` parameter a full text search will be done on the database to find a recipe that matches your search parameters.
The full text search is done using the [`porter` tokenizer](https://www.sqlite.org/fts5.html#porter_tokenizer), this means that words like `connect`, `connecting` and `connected` will all match onto each other.
The results will be sorted on relevance through the [`bm25`](https://www.sqlite.org/fts5.html#the_bm25_function) function
You can also add the `high`, `highStart` and `highEnd` to highlight the parts of the text that were matched using the full text search, if `high` is given but either `highStart`, or `highEnd` is not, they will default to `high`.

### `api/recipes/<ID>`

This will return the recipe with a given ID.

## `api/users`

This will return all the users in the database.

### `api/users/<ID>`

This will return the user with the given ID.

## `api/auth/...`

Handled by [authJS](https://authjs.dev/) don't worry about it.
