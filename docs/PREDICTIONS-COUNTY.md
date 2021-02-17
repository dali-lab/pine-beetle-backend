# County Predictions Data Operations

## `GET /county-prediction`

Returns county predictions objects that match specified query params.

User can supply query params for:

- `cleridPerDay`
- `county`
- `spbPerDay`
- `state`
- `trapCount`
- `year`

## `POST /county-prediction/query`

Returns county predictions objects that match provided mongo query.

User can supply mongo query in body.
