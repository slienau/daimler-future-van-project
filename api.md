# API

## Table of Content

<!-- toc -->

- [Endpoint](#endpoint)
- [Error handling](#error-handling)
  * [Error types](#error-types)
  * [Error object](#error-object)
    + [Example](#example)
- [Objects](#objects)
  * [Location](#location)
    + [Example](#example-1)
  * [VirtualBusStop](#virtualbusstop)
    + [Example](#example-2)
  * [Account](#account)
    + [Example](#example-3)
  * [Order](#order)
    + [Example](#example-4)
  * [Route](#route)
    + [Example](#example-5)
- [Resources](#resources)
  * [Authorization](#authorization)
    + [Authorization Header](#authorization-header)
  * [/login](#login)
    + [POST /login](#post-login)
  * [/account](#account)
    + [GET /account](#get-account)
    + [PUT /account](#put-account)
  * [/orders](#orders)
    + [GET /orders](#get-orders)
    + [POST /orders](#post-orders)
  * [/activeorder](#activeorder)
    + [GET /activeorder](#get-activeorder)
    + [PUT /activeorder](#put-activeorder)
    + [GET /activeorder/status](#get-activeorderstatus)
  * [/routes](#routes)
    + [POST /routes](#post-routes)
  * [/virtualbusstops](#virtualbusstops)
    + [GET /virtualbusstops](#get-virtualbusstops)
  * [/leaderboard](#leaderboard)
    + [GET /leaderboard](#get-leaderboard)

<!-- tocstop -->

## Endpoint

The base URL for this APIs endpoint is  

`http://3.120.249.73:8080`

## Error handling

This API uses standard HTTP status codes to indicate the status of a response.

### Error types

| Name | Code | Description |
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
| `message` | `String` | No | (Long) description of the error. | `The server understood the request, but is refusing to fulfill it` |

#### Example

```json
{
  "code": 400,
  "message": "Bad query parameter [$size]: Invalid integer value [abc]"
}
```

## Objects

### Location

This object represents a geographical location.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `latitude` | `Number` | yes | The north coordinate. | `52.478442` |
| `longitude` | `Number` | yes | The east coordinate. | `13.405938` |

#### Example

```json
{
  "latitude": 52.478442,
  "longitude": 13.405938
}
```

### VirtualBusStop

This object represents a virtual bus stop.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `id` | `String` | yes | The ID. | `0e8cedd0-ad98-11e6-bf2e-47644ada7c0b` |
| `name` | `String` | Yes | Name of the station, e.g. street name or point of interest name | `Straße des 17. Juni 135` |
| `accessible` | `Boolean` | Yes | True if the virtual bus stop is currently accessible, false if not. | `true`, `false` |
| `location` | `Object` `(Location)` | Yes | The location of the VirtualBusStop. | *See location object.* |

#### Example

```json
{
  "id": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0b",
  "name": "Straße des 17. Juni 135",
  "accessible": true,
  "location": {
    "latitude": 52.478442,
    "longitude": 13.405938
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
| `email` | `String` | Yes | The users email. | `maxmueller@tu-berlin.de` |
| `username` | `String` | Yes | The username. | `maxiboy123` |
| `loyaltyPoints` | `Number` | Yes | The users total loyalty points. | `234` |
| `loyaltyStatus` | `String` | yes | The loyalty program status. | `gold` |
| `address` | `Object` | No | The users address. Contains `street`, `zipcode` and `city` | *See account example.* |
| `distance` | `Number` | yes | Total amount of kilometres driven by the user. | `423.34` |
| `co2savings` | `Number` | yes | Total amount of CO2 savings (in kilogram) for all van rides. | `70.4` |

#### Example

```json
{
  "id": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
  "firstName": "Max",
  "lastName": "Müller",
  "email": "maxmueller@tu-berlin.de",
  "username": "maxiboy123",
  "loyaltyPoints": 234,
  "loyaltyStatus": "gold",
  "address": {
    "street": "Salzufer 1",
    "zipcode": "10587",
    "city": "Berlin"
  },
  "distance": 423.34,
  "co2savings": 70.4,
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
| `vanStartVBS` | `Object` `(VirtualBusStop)` | yes | Starting Virtual Bus Stop |  |
| `vanEndVBS` | `Object` `(VirtualBusStop)` | yes | Ending Virtual Bus Stop |  |
| `vanEnterTime` | `Datetime` | no | Time at which the user entered the van.<br> Null if the user canceled the order. | `2018-11-23T18:30:25.000Z` |
| `vanExitTime` | `Datetime` | no | Time at which the user left the van.<br> Null if the user canceled the order. | `2018-11-23T18:45:48.000Z` |
| `vanId` | `Number` | yes | The van which carried the user. | |
| `loyaltyPoints` | `Number` | yes | The amount of loyalty points for this order. | |
| `distance` | `Number` | yes | Amount of kilometres the van drove. | `12.4` |
| `co2savings` | `Number` | yes | Amount of CO2 savings (in kilogram) for this ride . | `2.2` |
| `route` | `Object` `(Route)` | only if `active` is `true` | The route object for this order. | See [Route](#route) |

#### Example

```json
{
  "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
  "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
  "orderTime": "2018-11-23T18:25:43.511Z",
  "active": true,
  "canceled": false,
  "vanStartVBS": {
    "id": "7416550b-d47d-4947-b7ec-423c9fade07f",
    "name": "Straße des 17. Juni 135",
    "accessible": true,
    "location": {
      "latitude": 52.515598,
      "longitude": 13.326860
    }
  },
  "vanEndVBS": {
    "id": "76d7fb2f-c264-45a0-ad65-b21c5cf4b532",
    "name": "Straße des 17. Juni 120",
    "accessible": true,
    "location": {
      "latitude": 52.512974,
      "longitude": 13.329145
    }
  },
  "vanEnterTime": "2018-11-23T18:30:25.000Z",
  "vanExitTime": "2018-11-23T18:45:48.000Z",
  "vanId": 7,
  "loyaltyPoints": 3980,
  "distance": 12.4,
  "co2savings": 2.2,
  "route": {}
}
```

### Route

This object represents a travel route from journey start to the final destination of the journey.

| Field | Type | Required | Description | Examples |
|--- |--- |--- |--- |--- |
| `id` | `String` | yes | The route ID. | `13cf81ee-8898-4b7a-a96e-8b5f675deb3c` |
| `userStartLocation` | `Object` `(Location)` | yes | Location where the journey starts. |  |
| `vanStartVBS` | `Object` `(VirtualBusStop)` | yes | Location (VirtualBusStop) where the user should enter the van. |  |
| `vanEndVBS` | `Object` `(VirtualBusStop)` | yes | Location (VirtualBusStop) where the user should exit the van. |  |
| `userDestinationLocation` | `Object` `(Location)` | yes | Final destination of the journey. |  |
| `vanETAatStartVBS` | `Datetime` | Yes | The expected time when the van will pick up the user at the `vanStartVBS` | `2018-12-17T17:20:00.000Z` |
| `vanETAatEndVBS` | `Datetime` | Yes | The expected time when the van will arrive at the `vanEndVBS` | `2018-12-17T17:35:00.000Z` |
| `userETAatUserDestinationLocation` | `Datetime` | Yes | The estimated time of arrival of the user at the `userDestinationLocation` | `2018-12-17T17:40:00.000Z` |
| `toStartRoute` | `Object` | Yes | Route from `startLocation` to `startStation` |  |
| `vanRoute` | `Object` | Yes | Van route from `startStation` to `endStation` |  |
| `toDestinationRoute` | `Object` | Yes | Route from `endStation` to `destination` |  |
| `vanId` | `Number` | yes | The van which will drive this route. | |
| `validUntil` | `Datetime` | Yes | Time until the route can be confirmed (create an order from this route). After this time has elapsed, a new request must be sent, otherwise no order can be created. | `2018-12-17T17:10:00.000Z` |

#### Example

```json
{
  "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
  "userStartLocation": {
    "latitude": 52.516639,
    "longitude": 13.331985
  },
  "vanStartVBS": {
    "id": "7416550b-d47d-4947-b7ec-423c9fade07f",
    "name": "Straße des 17. Juni 135",
    "accessible": true,
    "location": {
      "latitude": 52.515598,
      "longitude": 13.326860
    }
  },
  "vanEndVBS": {
    "id": "76d7fb2f-c264-45a0-ad65-b21c5cf4b532",
    "name": "Straße des 17. Juni 120",
    "accessible": true,
    "location": {
      "latitude": 52.512974,
      "longitude": 13.329145
    }
  },
  "userDestinationLocation": {
    "latitude": 52.513245,
    "longitude": 13.332684
  },
  "vanETAatStartVBS": "2018-12-17T17:20:00.000Z",
  "vanETAatEndVBS": "2018-12-17T17:35:00.000Z",
  "userETAatUserDestinationLocation": "2018-12-17T17:40:00.000Z",
  "toStartRoute": {},
  "vanRoute": {},
  "toDestinationRoute": {},
  "vanId": 7,
  "validUntil": "2018-12-17T17:10:00.000Z"
}
```

## Resources

All request and response bodys are of type `application/json`.

### Authorization

**Authorization** is required for all requests except to `/login`. If not authorized, the server will respond with `HTTP 401`.

#### Authorization Header

| Parameter | Value | Required | Description |
|--- |--- |--- |--- |
| `Authorization` | `Bearer <TOKEN>` | Yes | The JWT token from the `POST /login` response |

---

### /login

---

#### POST /login

##### Request Body

```json
{
  "username": "admin",
  "password": "xyz"
}
```

##### Response Body

```json
{
  "userId": "64e0d993-2867-44cf-872d-9a78a5c212a0",
  "token": "xxxxx.yyyyy.zzzzz"
}
```

---

### /account

---

#### GET /account

To get the user account information.

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Account` | See [Account](#account) |
| `400` | `Error` | Bad request. See [Error](#error-object) |
| `401` | `Error` | When username or password is wrong. See [Error](#error-object) |

---

#### PUT /account

To update user account information.

##### Body

| Type | Required | Description |
|--- |--- |--- |
| `Account` | Yes | Containing the updated user account information. See [Account](#account) |

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Account` | Containing the updated user account information. See [Account](#account) |
| `400` | `Error` | See [Error](#error-object) |

---

### /orders

---

#### GET /orders

Get the orders of a user.

##### Request Query Parameters

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `fromDate` | `Datetime` | No | If set, the response will only contain orders which were placed *after* this date. |
| `toDate` | `Datetime` | No | If set, the response will only contain orders which were placed *before* this date. |

###### Example

- ```/orders```  
- ```/orders?fromDate=2018-01-01T00:00:00.000Z&toDate=2018-10-01T00:00:00.000Z```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | Array of `Order` | Orders which match the request parameters. See [Order](#order) |
| `400` | `Error` | See [Error](#error-object) |

###### Example

```json
[
  {
    "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
    "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
    "orderTime": "2018-02-23T18:25:43.511Z",
    "active": false,
    "canceled": false,
    ...,
  },
  {
    "id": "13cf81ee-4b7a-8898-a96e-8b5f675deb3c",
    "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
    "orderTime": "2018-02-24T18:25:43.511Z",
    "active": false,
    "canceled": false,
    ...,
  }
]
```

---

#### POST /orders

To create (place) a new van order.

##### Request

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `routeId` | `String` | Yes | ID of the route. |

###### Example

```json
{
  "routeId": "d79ab15d-39e8-4817-83d0-ed21d395dded",
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Order` | The new created order. See [Order](#order) |
| `400` | `Error` | If the order couldn't be created. See [Error](#error-object) |
| `404` | `Error` | If the `routeId` wasn't found. See [Error object](#error-object) |

---

### /activeorder

---

#### GET /activeorder

Get the current active order object (See [Order](#order)).  
`404` error if there is no active order at the moment (See [Error object](#error-object)).

---

#### PUT /activeorder

Update an active order.

##### Request Body

The request body contains a JSON with the single property `action`, which describes what should be done/changed in the active order.  
Possible `action`-types are:

| Value | Description |
|--- |--- |
| `startride` | User has entered the van. After this request has been sent, the van should lock the doors and start the ride. `403` Error if the user isn't close enough to the van / didn't enter the van. |
| `endride` | User left the van. `403` error if the van hasn't arrived at the destination virtual bus stop yet. |
| `cancel` | User wants to cancel the order. `403` error if the order can not be canceled anymore (ride already started or ended). |

###### Example

```json
{
  "action": "startride",
  "userLocation": {
    "latitude": 52.123456,
    "longitude": 13.123456
  }
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Order` | See [Order](#order) |
| `400` | `Error` | See [Error](#error-object) |
| `403` | `Error` | If the `action` requested by the user is not allowed. See request body and [Error object](#error-object) |

---

#### GET /activeorder/status

Get information about the current active order.

##### Request Query Parameters

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `passengerLatitude` | `Number` | Yes | The users latitude. |
| `passengerLongitude` | `Number` | Yes | The users longitude. |

###### Example

```
GET /activeorder/status?passengerLatitude=52.123456&passengerLongitude=13.123456
```

##### Response

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | `Object` | The updated order (see example) |
| `400` | `Error` | See [Error](#error-object) |

On `HTTP 200` the following object will be returned:

| Property | Type | Description |
|--- |--- |--- |
| `vanId` | `Number` | |
| `userAllowedToEnter` | `Boolean` | `true` if user can enter the van (if the user is close enough to the van), `false` otherwise. |
| `userAllowedToExit` | `Boolean` | self explaining |
| `vanLocation` | `Object` | The current position of the van. |
| `vanETAatStartVBS` | `Datetime` | Esimated time of arrival of the van at the start location |
| `vanETAatDestinationVBS` | `Datetime` | Esimated time of arrival of the van at the start location |
| `otherPassengers` | `Array` | Array containing usernames (Strings) of other passengers |
| `message` | `String` | |

```json
{
  "vanId": 7,
  "userAllowedToEnter": false,
  "userAllowedToExit": false,
  "vanLocation": {
    "latitude": 52.515598,
    "longitude": 13.32686
  },
  "vanETAatStartVBS": "2018-11-23T18:20:25.000Z",
  "vanETAatDestinationVBS": "2018-11-23T18:30:25.000Z",
  "otherPassengers": [
    "Sarah",
    "Wilbert"
  ],
  "message": "Van has not arrived yet"
}
```

---

### /routes

---

#### POST /routes

Get suggested routes from starting point to destination.

##### Request

###### Body

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `start` | `Location` | Yes | Journey start location. |
| `destination` | `Location` | Yes | Journey destination. |
| `startTime` | `Datetime` | No | Route start time. Current time if not specified. |

###### Example

```json
{
  "start": {
    "latitude": 52.512974,
    "longitude": 13.329145
  },
  "destination": {
    "latitude": 52.285946,
    "longitude": 13.317390
  },
  "startTime": "2018-12-15T18:30:00.000Z"
}
```

##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | Array of `Route` | Array of possible routes from desired start location to destination. Array will contain *max. 5 items*. See [Route](#route). |
| `400` | `Error` | See [Error](#error-object) |
| `404` | `Error` | If no route was found. See [Error](#error-object) |

###### Example

```json
[
  {
    "startLocation": {
      "latitude": 52.516639,
      "longitude": 13.331985
    },
    "startStation": ...
    ...
  },{
    "startLocation": {
      "latitude": 52.516639,
      "longitude": 13.331985
    },
    "startStation": ...
    ...
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

###### Query Parameters

| Property | Type | Required | Description |
|--- |--- |--- |--- |
| `latitude` | `Location` | Yes | The latitude of the center position |
| `longitude` | `Location` | Yes | The longitude of the center position |
| `radius` | `Number` | No | Maximum distance of the virtual bus stops to the location parameter. **Unit: meter** <br> Min: `100`; Max: `10000`; Default: `1000` |

###### Examples

```/virtualbusstops?radius=2000&latitude=52.512974&longitude=13.329145```

```/virtualbusstops?latitude=52.512974&longitude=13.329145```


##### Responses

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | Array of `VirtualBusStop` | Array of virtual bus stops which are inside of the radius from the given location. See [VirtualBusStop](#virtualbusstop) |
| `400` | `Error` | See [Error](#error-object) |

###### Examples

```json
[]
```

```json
[
  {
    "id": "d79ab15d-39e8-4817-83d0-ed21d395dded",
    "name": "Straße des 17. Juni",
    "accessible": true,
    "location": {
      "latitude": 52.515729,
      "longitude": 13.323373
    }
  },
  {
    "id": "7416550b-d47d-4947-b7ec-423c9fade07f",
    "name": "Straße des 17. Juni",
    "accessible": true,
    "location": {
      "latitude": 52.515598,
      "longitude": 13.326860
    }
  }
]
```

---

### /leaderboard

---

#### GET /leaderboard

Get the top 10 users with the most loyalty points.

##### Response

| Code | Body Type | Description |
|--- |--- |--- |
| `200` | Array of `Objects` | Containing the loyalty points (for schema see example). Sorted by property `loyalty points` |
| `400` | `Error` | See [Error](#error-object) |

###### Example

```json
[
    {
        "loyaltyPoints": 175,
        "username": "antonio",
        "status": "platin"
    },
    {
        "loyaltyPoints": 125,
        "username": "philipp",
        "status": "gold"
    },
    {
        "loyaltyPoints": 75,
        "username": "alex",
        "status": "silver"
    }
]
```
