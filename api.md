# API

## Authorization

TODO

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

## Objects

### Location

This object represents a geographical location.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `n` | `String` (?) | yes | The north coordinate. | `52.478442` |
| `e` | `String` (?) | yes | The east coordinate. | `13.405938` |

#### Example

```json
{
  "n": "52.478442",
  "e": "13.405938"
}
```

### VirtualBusStop

This object represents a virtual bus stop.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `id` | `String` | yes | The ID. | `0e8cedd0-ad98-11e6-bf2e-47644ada7c0b` |
| `accessible` | `Boolean` | Yes | True if the virtual bus stop is currently accessible, false if not. | `true`, `false` |
| `location` | `Object` `(Location)` | Yes | The location of the VirtualBusStop. | *See location object.* |

#### Example

```json
{
  "id": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0b",
  "accessible": true,
  "location": {
    "n": "52.478442",
    "e": "13.405938"
  }
}
```

### Account

This object represents a user account.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `id` | `String` | yes | The ID. | `0e8cedd0-ad98-11e6-bf2e-47644ada7c0f` |
| `firstName` | `String` | Yes | The users first name. | `Max` |
| `lastName` | `String` | Yes | The users lasst name. | `Müller` |
| `address` | `Object` | No | The users address. For the Schema, see example. | See account example. |

#### Example

```json
{
  "id": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
  "firstName": "Max",
  "lastName": "Müller",
  "address": {
    "street": "Salzufer 1",
    "zipcode": "10587",
    "city": "Berlin"
  }
}
```

### Order

This object represents a van order which can be made by a user.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `id` | `String` | yes | The order ID. | `13cf81ee-8898-4b7a-a96e-8b5f675deb3c` |
| `accountId` | `String` | yes | User account ID which placed this order. | `0e8cedd0-ad98-11e6-bf2e-47644ada7c0f` |
| `orderTime` | `Datetime` | yes | Time at which the order was placed. | `2018-11-23T18:25:43.511Z` |
| `active` | `Boolean` | yes | True if this order is active (user is still travelling to the ending virtual bus stop).<br>False if the user reached the ending virtual bus stop (finished the journey), or if the order was canceled. | `true` |
| `canceled` | `Boolean` | yes | True if the user canceled the order. | `false` |
| `virtualBusStopStart` | `Object` `(VirtualBusStop)` | yes | Starting Virtual Bus Stop |  |
| `virtualBusStopEnd` | `Object` `(VirtualBusStop)` | yes | Ending Virtual Bus Stop |  |
| `startTime` | `Datetime` | no | Time at which the user entered the van.<br> Null if the user canceled the order. | `2018-11-23T18:30:25.000Z` |
| `endTime` | `Datetime` | no | Time at which the user left the van.<br> Null if the user canceled the order. | `2018-11-23T18:45:48.000Z` |

#### Example

```json
{
  "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
  "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
  "orderTime": "2018-11-23T18:25:43.511Z",
  "active": true,
  "canceled": false,
  "virtualBusStopStart": {
    "id": "7416550b-d47d-4947-b7ec-423c9fade07f",
    "accessible": true,
    "location": {
      "n": "52.515598",
      "e": "13.326860"
    }
  },
  "virtualBusStopEnd": {
    "id": "76d7fb2f-c264-45a0-ad65-b21c5cf4b532",
    "accessible": true,
    "location": {
      "n": "52.512974",
      "e": "13.329145"
    }
  },
  "startTime": "2018-11-23T18:30:25.000Z",
  "endTime": "2018-11-23T18:45:48.000Z"
}
```

### Route

This object represents a travel route from journey start to the final destination of the journey.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `startLocation` | `Object` `(Location)` | yes | Location where the journey starts. |  |
| `startStation` | `Object` `(VirtualBusStop)` | yes | Location where the user should enter the van. |  |
| `endStation` | `Object` `(VirtualBusStop)` | yes | Location where the user should exit the van. |  |
| `destination` | `Object` `(Location)` | yes | Final destination of the journey. |  |
| `travelTime` | `Number` | yes | Expected travel time from start to destination in minutes. | `28` |
| `vanTime` | `Number` | yes | Expected time in the van in minutes. | `15` |
| `vanArrivalTime` | `Number` | yes | Expected time (in minutes) when the van will arrive at the `startStation`. | `6` |

#### Examples

```json
{
  "startLocation": {
    "n": "52.516639",
    "e": "13.331985"
  },
  "startStation": {
    "id": "7416550b-d47d-4947-b7ec-423c9fade07f",
    "accessible": true,
    "location": {
      "n": "52.515598",
      "e": "13.326860"
    }
  },
  "endStation": {
    "id": "76d7fb2f-c264-45a0-ad65-b21c5cf4b532",
    "accessible": true,
    "location": {
      "n": "52.512974",
      "e": "13.329145"
    }
  },
  "destination": {
    "n": "52.513245",
    "e": "13.332684"
  },
  "travelTime": 28,
  "vanTime": 15,
  "vanArrivalTime": 6
}
```

## Resources

TODO
