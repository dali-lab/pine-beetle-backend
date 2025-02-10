# Histogram Operations

## `GET /histogram`

Returns the histogram data stored in the database.

## `POST /histogram/update`

Expects authorization header with Bearer token.
If no histogram data is stored in the database, creates one. If there is previous data, updates the existing data with the results of latest calculations.
