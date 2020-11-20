# Unsummarized Trapping Data Operations

## `GET /unsummarized-trapping`

Returns unsummarized trapping objects that match specified query params.

User can supply query params for:

- `bloom`
- `bloomDate`
- `cleridCount`
- `collectionDate`
- `county`
- `daysActive`
- `endobrev`
- `fips`
- `latitude`
- `longitude`
- `lure`
- `rangerDistrict`
- `season`
- `sirexLure`
- `spbCount`
- `startDate`
- `state`
- `trap`
- `week`
- `year`

## `POST /unsummarized-trapping/query`

Returns unsummarized trapping objects that match provided mongo query.

User can supply mongo query in body.
