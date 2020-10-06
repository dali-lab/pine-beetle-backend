# Summarized County Trapping Data Operations

## `GET /summarized-county-trapping`

Returns summarized county trapping objects that match specified query params.

User can supply query params for:

- `cleridCount`
- `county`
- `spbCount`
- `state`
- `year`

## `POST /summarized-county-trapping/query`

Returns summarized county trapping objects that match provided mongo query.

User can supply mongo query in body.
