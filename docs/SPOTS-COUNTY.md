# County Spot Data Operations

## `GET /spot-data-county`

Returns county spot data objects that match specified query params.

User can supply query params for:

- `county`
- `fips`
- `hostAc`
- `spots`
- `state`
- `year`

## `POST /spot-data-county/query`

Returns county spot data objects that match provided mongo query.

User can supply mongo query in body.
