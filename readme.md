## REST API

- getMetadata(callback)
  **endpoint:**
  `/rest/metadata`

- getTableMetadata(table, callback)
  **endpoint:**
  `/rest/{table}/metadata`
  **example:**
  `/rest/player/metadata`

- getAll(table, callback)
  **endpoint:**
  `/rest/{table}`
  **example:**
  `/rest/player`

- getById(table, id, callback)
  **endpoint:**
  `/rest/{table}/{id}`
  **example:**
  `/rest/player/56`

- create(table, obj, callback)
  **endpoint:**
  `/rest/{table}`
  **body:**
  JSON object

- updateById(table, id, obj, callback)

- deleteById(table, id, callback)
