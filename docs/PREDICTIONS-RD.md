# Ranger District Predictions Data Operations

## `GET /rd-prediction`

Returns ranger district predictions objects that match specified query params.

User can supply query params for:

- `cleridPerDay`
- `rangerDistrict`
- `spbPerDay`
- `state`
- `trapCount`
- `year`

## `POST /rd-prediction/query`

Returns ranger district predictions objects that match provided mongo query.

User can supply mongo query in body.
