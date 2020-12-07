# User Operations

## `GET /user`

Expects authorization header with Bearer token.
Returns all user objects in the database

## `GET /user/:id`

Expects authorization header with Bearer token.
Returns user object of specified `id` in the database

## `PUT /user/:id`

Expects authorization header with Bearer token.
Updates user object of specified `id` in the database with the fields supplied in a JSON body.

## `DELETE /user/:id`

Expects authorization header with Bearer token.
Deletes user object of specified `id` in the database

## `POST /user/sign-up`

Creates user with fields provided in JSON body. Requires `first_name`, `email`, and `password`. Has optional `last_name` field.

## `GET /user/login`

Expects basic auth header with username as email and plain text password.
Returns JWT auth token for user if salted and hashed version of password matches in database.

## `GET /user/auth`

Expects authorization header with Bearer token.
Returns 200 with no payload if auth header is valid. This route can be used on the automation server for verifying protected routes.

## `GET /user/forgot-password/:email`

Generates random new password for user with provided email (if a user object for that email exists). Sends email with this new password to the user's email. User can then check their email to get their new password and login.
