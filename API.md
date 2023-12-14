# API

If you want to add query parameters in your request you can do this by adding a `?` at the end of your request,
and then adding the name of your parameter followed by an `=` and the value.
To add multiple parameters you can separate them using an `&`.
If you, for example want to set `size` to `55` and `page` to `5` you would do `<rout>?size=55&page=5`.

`size` and `page` will be used multiple times in these requests,
`size` is to say how many objects you want returned, and `page` is to say which objects.
So if `size` is `100` and `page` is 0, you will get objects `1-100`, if `page` is `1` you will get objects `101-200`.

## `/api/isup`

This will return `true` if the server is running,
and nothing if the server is not running.

## `/api/recipes`

This will return the first `size` recipes in the database, or `100` if size is not given.
`page` can be used here.

### Search

If you add the `query` parameter a full text search will be done on the database to find a recipe that matches your search parameters.
The full text search is done using the [`porter` tokenizer](https://www.sqlite.org/fts5.html#porter_tokenizer), this means that words like `connect`, `connecting` and `connected` will all match onto each other.
The results will be sorted on relevance through the [`bm25`](https://www.sqlite.org/fts5.html#the_bm25_function) function

#### Usable search queries

* `user=[ID]`
  * Only return recipes made by this user
* `query=[query]` 
  * Search recipes based on the contents of their title and description
* `difficulty=[difficulty]`
  * Search recipes based on the difficulty of the recipe
  * This query can be used multiple times, this will select a recipe that has one of these difficulties
  * E.g `?difficulty=Easy&difficulty=Medium`
	* Will only select recipes with a easy or medium difficulty
* `mealType=[type]`
  * Search recipes based on the type of meal
  * This query can be used multiple times just as `difficulty`

### `/api/recipes/<ID>`

This will return the recipe with a given ID.

## `/api/users`

This will return all the users in the database.

### `/api/users/<ID>`

This will return the user with the given ID.

### `/api/users/<ID>/recipes`

This will return all the recipes of a given user.
Here you can also add the query `name`, to filter based on the name of the recipe,
this filter is not a full text search, but rather a `SQL` `match` expression,
this means that just giving in a value will only return exact matches,
and for searching `%` and `_` should be used.

### `/api/units`

> For specifying units you can use the `enums` in [`composables/unit.ts`](./composables/unit.ts), these can be directly given to the API, 
> if you want the full name use the `unitNames` dictionary inside of this file to convert units to full names.

API route used for converting between to units, this request should include a `fromUnit`, a `toUnit` and an `quantity`.
The `fromUnit` and `toUnit` define the units you are converting from and to, these units should be of the same type,
e.g. both measures of length, or both measures of mass, if this is not the case, an error will be thrown.
These units should also be of type `Unit` defined in [`composables/unit.ts`](./composables/unit.ts).
The `quantity` is how much of the `fromUnit` you have that should be converted to the `toUnit`, if `quantity` is not specified an `quantity` of 1 is assumed.

This returns a singular number, this is the converted value.
If you specified the wrong values (e.g. converting kilogram into liters) or you forgot to specify a value, an error is returned.

### `/api/units/search`

> For specifying units you can use the `enums` in [`composables/unit.ts`](./composables/unit.ts), these can be directly given to the API.
 
API route used for searching for new units, this request should include a `query` and a `unitType`.
The `query` parameter is simple the query you are searching for.
The `unitType` is the type of the unit you would like to get e.g. volume, mass, ....
`unitType` should be of the `UnitTypes` type in [`composables/unit.ts`](./composables/unit.ts).

This returns an array of of arrays containing the units code and the units name, the name can be used to display to the user,
while the code should be used for converting between this unit and another unit using `/api/units`
If there is an unspecified value, an error is returned.

Example query:
```ts
GET `/api/units/search?query=kilo&unitType=${UnitTypes.Mass}`
```
result
```json
[["kg", "kilogram"]]
```

## `/api/auth/...`

Handled by [authJS](https://authjs.dev/) don't worry about it.
