## REST API

- getMetadata(callback)  
  **endpoint:**  
  `/rest/metadata`  
  **method:**  
  `GET`

- getTableMetadata(table, callback)  
  **endpoint:**  
  `/rest/{table}/metadata`  
  **example:**  
  `/rest/player/metadata`  
  **method:**  
  `GET`

- getAll(table, callback)  
  **endpoint:**  
  `/rest/{table}`  
   **method:**  
  `GET`  
  **example:**  
  `/rest/player`

- getById(table, id, callback)  
  **endpoint:**  
  `/rest/{table}/{id}`  
   **method:**  
  `GET`  
  **example:**  
  `/rest/player/56`

- create(table, obj, callback)  
  **endpoint:**  
  `/rest/{table}`  
  **method:**  
  `POST`  
  **body:**  
  JSON object

- updateById(table, id, obj, callback)  
  **endpoint:**  
  `/rest/{table}/{id}`  
   **method:**  
  `POST`  
   **body:**  
  JSON object

- deleteById(table, id, callback)  
  **endpoint:**  
  `/rest/{table}/{id}`  
   **method:**  
  `DELETE`
