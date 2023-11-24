# Blog Operations

## `GET /blog`

Returns all blog post objects in the database.

## `GET /blog/:id`

Returns blog post object of specified `id` in the database.

## `PUT /blog/:id`

Expects authorization header with Bearer token.
Updates blog post object of specified `id` in the database with the fields supplied in a JSON body.

## `DELETE /blog/:id`

Expects authorization header with Bearer token.
Deletes blog post object of specified `id` in the database

## `POST /blog/create`

Expects authorization header with Bearer token.
Creates blog post with fields provided in multipart/form-data body. Requires `title` and `body`, has optional `image` field. `author` is fetched from the session info.

## `GET /blog/user/:id`

Returns blog post object of specified author `id` in the database.
