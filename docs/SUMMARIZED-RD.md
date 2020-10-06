# Summarized Ranger District Trapping Data Operations

## `GET /summarized-rangerdistrict-trapping`

Returns summarized ranger district trapping objects that match specified query params.

User can supply query params for:

- `cleridCount`
- `rangerDistrict`
- `spbCount`
- `state`
- `year`

## `POST /summarized-rangerdistrict-trapping/query`

Returns summarized ranger district trapping objects that match provided mongo query.

User can supply mongo query in body.
