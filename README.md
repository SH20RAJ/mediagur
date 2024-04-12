
### mediagur : Upload File and Get URL

Free File Hosting with Uploading API. Upload a file to the mediagur platform and get the file URL.

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FSH20RAJ%2Fmediagur&countColor=%23263759&style=flat)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2FSH20RAJ%2Fmediagur)

[![](https://data.jsdelivr.com/v1/package/gh/mediagur/images/badge)](https://www.jsdelivr.com/package/gh/mediagur/images)

<p align="center">
<img src="https://github.com/mediagur.png">
</p>

- **URL**: `https://mediagur.vercel.app/upload`
- **Method**: `POST`
- **Request Headers**:
  - `Content-Type: multipart/form-data`

#### Request Body

- **Form Data**:
  - `file`: The file to be uploaded. Supported file types: Any.

#### Response

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "url": "https://mediagur.vercel.app/files/abcdefg/file.jpg",
      "jsdelivr": "https://cdn.jsdelivr.net/gh/mediagur/abcdefg/file.jpg"
    }
    ```
- **Error Responses**:
  - **Code**: `400 Bad Request`
    - **Content**: `{ "error": "No file uploaded" }`
  - **Code**: `500 Internal Server Error`
    - **Content**: `{ "error": "File upload failed" }`

#### Example

- **Request**:
  ```http
  POST https://mediagur.vercel.app/upload
  Content-Type: multipart/form-data

  ----WebKitFormBoundary7MA4YWxkTrZu0gW
  Content-Disposition: form-data; name="file"; filename="example.jpg"
  Content-Type: image/jpeg

  <Binary data of the file>
  ----WebKitFormBoundary7MA4YWxkTrZu0gW--
  ```
- **Response**:
  ```json
  {
    "url": "https://mediagur.vercel.app/files/abcdefg/example.jpg",
    "jsdelivr": "https://cdn.jsdelivr.net/gh/mediagur/abcdefg/example.jpg"
  }
  ```

### Explanation

- This API endpoint allows clients to upload a file to the mediagur platform using a `POST` request with `multipart/form-data` content type.
- The uploaded file is stored on the mediagur platform indefinitely.
- After successful upload, the API responds with a JSON object containing the URL of the uploaded file on the mediagur platform and a jsDelivr CDN URL for easy access to the file.
- If no file is uploaded, the API returns a `400 Bad Request` error with an appropriate error message.
- If there is an internal server error during file upload, the API returns a `500 Internal Server Error` with an error message.

### Additional Notes
- Uploaded files are stored indefinitely.
- The jsDelivr CDN URLs provided can be used to access the uploaded files.

### Contact
For any questions or support, please contact us at [support@mediagur.vercel.app](mailto:support@mediagur.vercel.app).

This simplified documentation focuses on the POST endpoint for uploading files and getting the file URL. You can expand this documentation with more endpoints, parameters, and detailed examples as needed.