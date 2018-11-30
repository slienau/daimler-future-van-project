# API

## Error handling

This API uses standard HTTP status codes to indicate the status of a response.

### Error types

| Name | Code |	Description |
|--- |--- |--- |
| Bad request | 400 | The request was unacceptable |
| Unauthorized | 401 | The request has not been applied because it lacks valid authentication credentials for the target resource. |
| Forbidden | 403 | The server understood the request, but is refusing to fulfill it |
| Not Found | 404 | The server has not found anything matching the request URI |
| Server error | 500 | A technical error occured in the Cloud |

### Error object

This general error structure is used throughout this API.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `code` | `Integer` | yes | The error code. | `400` |
| `description` | `String` | No | (Long) description of the error. | `The server understood the request, but is refusing to fulfill it` |
| `reasonPhrase` | `String` | No | Reason of the error | `Forbidden`<br>`Bad Request` |

#### Example

```json
{
  "code": 400,
  "description": "Bad query parameter [$size]: Invalid integer value [abc]",
  "reasonPhrase": "Bad Request"
}
```
