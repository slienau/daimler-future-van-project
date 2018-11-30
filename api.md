# API

## Endpoint

The base URL for this APIs endpoint is  

`http://40.89.170.229:8080`

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
| `lastName` | `String` | Yes | The users last name. | `Müller` |
| `address` | `Object` | No | The users address. Contains `street`, `zipcode` and `city` | *See account example.* |

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
| `startStation` | `Object` `(VirtualBusStop)` | yes | Location (VirtualBusStop) where the user should enter the van. |  |
| `endStation` | `Object` `(VirtualBusStop)` | yes | Location (VirtualBusStop) where the user should exit the van. |  |
| `destination` | `Object` `(Location)` | yes | Final destination of the journey. |  |
| `travelTime` | `Number` | yes | Expected travel time from start to destination in minutes. | `28` |
| `vanTime` | `Number` | yes | Expected time in the van in minutes. | `15` |
| `vanArrivalTime` | `Number` | yes | Expected time (in minutes) when the van would arrive at the `startStation`. | `6` |

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

All request and response bodys are of type `application/json`.

---

### /accounts/{accountId}

**Authorization** is required for all requests to `/accounts/*`. If not authorized, the server will respond with `HTTP 401`.

---

#### GET /accounts/{accountId}

To get user account information.

##### Request

###### Path Variables

| Parameter | Type | Required | Description |
|--- |--- |--- |--- |
| `{accountId}` | `String` | Yes | The user account id |

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Account` | containing the user account information. |
| `400` | `Error` | |

###### Example

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

---

#### PUT /accounts/{accountId}

To update user account information.

##### Request

###### Path Variables

| Parameter | Type | Required | Description |
|--- |--- |--- |--- |
| `{accountId}` | `String` | Yes | The user account id |

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `newAccountData` | `Account` | Yes | containing the updated user account information. |

###### Example

```json
{
  "newAccountData": {
    "id": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
    "firstName": "Max",
    "lastName": "Müller",
    "address": {
      "street": "Ernst-Reuter-Platz 123",
      "zipcode": "10587",
      "city": "Berlin"
    }
  }
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Account` | containing the updated user account information. |
| `400` | `Error` | |

###### Example

```json
{
  "id": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
  "firstName": "Max",
  "lastName": "Müller",
  "address": {
    "street": "Ernst-Reuter-Platz 123",
    "zipcode": "10587",
    "city": "Berlin"
  }
}
```
---

### /accounts/{accountId}/orders

---

#### GET /accounts/{accountId}/orders

To get orders of a user.

##### Request

###### Path Variables

| Parameter | Type | Required | Description |
|--- |--- |--- |--- |
| `{accountId}` | `String` | Yes | The user account id |

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `active` | `Boolean` | No | - True if the response should only contain active orders<br>- False if the response should only contain active orders<br>- empty for active and past orders. |
| `fromDate` | `Datetime` | No | If set, the response will only contain orders which were placed *after* this date. |
| `toDate` | `Datetime` | No | If set, the response will only contain orders which were placed *before* this date. |

###### Example

```json
{
  "active": false,
  "fromDate": "2018-01-01T00:00:00.000Z",
  "toDate": "2018-10-01T00:00:00.000Z"
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | Array of `Order` | Orders which match the request parameters. |
| `400` | `Error` | |

###### Example

```json
[
  {
    "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
    "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
    "orderTime": "2018-02-23T18:25:43.511Z",
    "active": false,
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
    "startTime": "2018-02-23T18:30:25.000Z",
    "endTime": "2018-02-23T18:45:48.000Z"
  },
  {
    "id": "32c6281a-b05c-4cb7-8926-739842c0be86",
    "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
    "orderTime": "2018-03-23T18:25:43.511Z",
    "active": false,
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
    "startTime": "2018-03-23T18:30:25.000Z",
    "endTime": "2018-03-23T18:45:48.000Z"
  }
]
```

---

#### POST /accounts/{accountId}/orders

To create (place) a new van order.

##### Request

###### Path Variables

| Parameter | Type | Required | Description |
|--- |--- |--- |--- |
| `{accountId}` | `String` | Yes | The user account id |

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `start` | `VirtualBusStop` | Yes | Starting virtual bus stop of the order |
| `destination` | `VirtualBusStop` | Yes | Ending virtual bus stop of the order |

###### Example

```json
{
  "start": {
    "id": "d79ab15d-39e8-4817-83d0-ed21d395dded",
    "accessible": true,
    "location": {
      "n": "52.515729",
      "e": "13.323373"
    }
  },
  "destination": {
    "id": "76d7fb2f-c264-45a0-ad65-b21c5cf4b532",
    "accessible": true,
    "location": {
      "n": "52.512974",
      "e": "13.329145"
    }
  }
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Order` | The new created order. |
| `400` | `Error` | If the order couldn't be created. |

###### Example

```json
{
  "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
  "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
  "orderTime": "2018-11-23T18:25:43.511Z",
  "active": true,
  "canceled": false,
  "virtualBusStopStart": {
    "id": "d79ab15d-39e8-4817-83d0-ed21d395dded",
    "accessible": true,
    "location": {
      "n": "52.515729",
      "e": "13.323373"
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
  "startTime": null,
  "endTime": null
}
```

---

#### PUT /accounts/{accountId}/orders/{orderId}

Update an active order.  
The order can either be *changed* or *canceled*. To *cancel* an order, set the `canceled` property to `true` in the request body.

##### Request

###### Path Variables

| Parameter | Type | Required | Description |
|--- |--- |--- |--- |
| `{accountId}` | `String` | Yes | The user account id |
| `{orderId}` | `String` | Yes | The order id |

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `updatedOrder` | `Order` | Yes | The updated order. |

###### Example

```json
{
  "updatedOrder": {
    "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
    "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
    "orderTime": "2018-11-23T18:25:43.511Z",
    "active": true,
    "canceled": true,
    "virtualBusStopStart": {
      "id": "d79ab15d-39e8-4817-83d0-ed21d395dded",
      "accessible": true,
      "location": {
        "n": "52.515729",
        "e": "13.323373"
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
    "startTime": null,
    "endTime": null
  }
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Order` | The updated order |
| `400` | `Error` | If the order couldn't be updated. |

###### Example

```json
{
  "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
  "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
  "orderTime": "2018-11-23T18:25:43.511Z",
  "active": true,
  "canceled": true,
  "virtualBusStopStart": {
    "id": "d79ab15d-39e8-4817-83d0-ed21d395dded",
    "accessible": true,
    "location": {
      "n": "52.515729",
      "e": "13.323373"
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
  "startTime": null,
  "endTime": null
}
```

---

### /routes

---

#### GET /routes

Get suggested route from starting point to destination.

##### Request

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `start` | `Location` | Yes | Journey start location. |
| `destination` | `Location` | Yes | Journey destination. |

###### Example

```json
{
  "start": {
    "n": "52.512974",
    "e": "13.329145"
  },
  "destination": {
    "n": "52.285946",
    "e": "13.317390"
  }
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | Array of `Route` | Array of possible routes from desired start location to destination. Array will contain *max. 5 items* |
| `400` | `Error` | If the order couldn't be updated. |

###### Example

```json
[
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
  },
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
]
```

---

### /virtualbusstops

---

#### GET /virtualbusstops

Get nearby virtual bus stops.

- Will only return virtual bus stops which `accessible` property is `true`.
- Returns an array of virtual bus stops which are *inside of the radius* from the given location.
- Returns an empty array if no virtual bus stops are found inside that area.

##### Request

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `location` | `Location` | Yes | The location where we are looking for nearby virtual bus stops. E.g. the current location, or the final destination. |
| `radius` | `Number` | No | Maximum distance of the virtual bus stops to the location parameter. **Unit: meter** <br> Min: `100`; Max: `10000`; Default: `1000` |

###### Examples

```json
{
  "location": {
    "n": "52.512974",
    "e": "13.329145"
  },
  "radius": 2000
}
```
```json
{
  "location": {
    "n": "52.512974",
    "e": "13.329145"
  }
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | Array of `VirtualBusStop` | Array of virtual bus stops which are inside of the radius from the given location. |
| `400` | `Error` | If the order couldn't be updated. |

###### Examples

```json
[]
```

```json
[
  {
    "id": "d79ab15d-39e8-4817-83d0-ed21d395dded",
    "accessible": true,
    "location": {
      "n": "52.515729",
      "e": "13.323373"
    }
  },
  {
    "id": "7416550b-d47d-4947-b7ec-423c9fade07f",
    "accessible": true,
    "location": {
      "n": "52.515598",
      "e": "13.326860"
    }
  },
  {
    "id": "15869209-5f70-48a7-ad35-52133b959b79",
    "accessible": true,
    "location": {
      "n": "52.513287",
      "e": "13.333973"
    }
  },
  {
    "id": "76d7fb2f-c264-45a0-ad65-b21c5cf4b532",
    "accessible": true,
    "location": {
      "n": "52.512974",
      "e": "13.329145"
    }
  }
]
```
