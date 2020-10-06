# Spot Data Operations

## `GET /spot-data`

Returns spot data objects that match specified query params.

User can supply query params for:

- `county`
- `fips`
- `hostAc`
- `rangerDistrict`
- `spbCount`
- `state`
- `year`

## `POST /spot-data/query`

Returns spot data objects that match provided mongo query.

User can supply mongo query in body.
