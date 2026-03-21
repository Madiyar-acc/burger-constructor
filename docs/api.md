# Burger API

---

## Объекты

### Ingredient
```json
{
  "_id": "string",
  "name": "string",
  "type": "string",
  "proteins": 0,
  "fat": 0,
  "carbohydrates": 0,
  "calories": 0,
  "price": 0,
  "image": "string",
  "image_large": "string",
  "image_mobile": "string"
}
```

### Order
```json
{
  "_id": "string",
  "status": "string",
  "name": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "number": 0,
  "ingredients": ["string"]
}
```

### User
```json
{
  "email": "string",
  "name": "string"
}
```

---

## Auth

### POST `/auth/register`
**Body**
```json
{ "email": "string", "name": "string", "password": "string" }
```

**Response**
```json
{
  "success": true,
  "refreshToken": "string",
  "accessToken": "string",
  "user": { "email": "string", "name": "string" }
}
```

---

### POST `/auth/login`
**Body**
```json
{ "email": "string", "password": "string" }
```

**Response**
```json
{
  "success": true,
  "refreshToken": "string",
  "accessToken": "string",
  "user": { "email": "string", "name": "string" }
}
```

---

### POST `/auth/token`
**Body**
```json
{ "token": "refreshToken" }
```

**Response**
```json
{
  "success": true,
  "refreshToken": "string",
  "accessToken": "string"
}
```

---

### POST `/auth/logout`
**Body**
```json
{ "token": "refreshToken" }
```

**Response**
```json
{ "success": true }
```

---

## User

### GET `/auth/user`
**Headers**
```
authorization: <accessToken>
```

**Response**
```json
{
  "success": true,
  "user": { "email": "string", "name": "string" }
}
```

---

### PATCH `/auth/user`
**Headers**
```
Content-Type: application/json
authorization: <accessToken>
```

**Body (partial)**
```json
{ "email": "string", "name": "string", "password": "string" }
```

**Response**
```json
{
  "success": true,
  "user": { "email": "string", "name": "string" }
}
```

---

## Password reset

### POST `/password-reset`
**Body**
```json
{ "email": "string" }
```

**Response**
```json
{ "success": true }
```

---

### POST `/password-reset/reset`
**Body**
```json
{ "password": "string", "token": "string" }
```

**Response**
```json
{ "success": true }
```

---

## Ingredients

### GET `/ingredients`
**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "type": "string",
      "proteins": 0,
      "fat": 0,
      "carbohydrates": 0,
      "calories": 0,
      "price": 0,
      "image": "string",
      "image_large": "string",
      "image_mobile": "string"
    }
  ]
}
```

---

## Orders

### GET `/orders/all`
**Response**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "string",
      "status": "string",
      "name": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "number": 0,
      "ingredients": ["string"]
    }
  ],
  "total": 0,
  "totalToday": 0
}
```

---

### GET `/orders`
**Headers**
```
Content-Type: application/json
authorization: <accessToken>
```

**Response**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "string",
      "status": "string",
      "name": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "number": 0,
      "ingredients": ["string"]
    }
  ],
  "total": 0,
  "totalToday": 0
}
```

---

### POST `/orders`
**Headers**
```
Content-Type: application/json
authorization: <accessToken>
```

**Body**
```json
{ "ingredients": ["ingredientId1", "ingredientId2"] }
```

**Response**
```json
{
  "success": true,
  "order": {
    "_id": "string",
    "status": "string",
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "number": 0,
    "ingredients": ["string"]
  },
  "name": "string"
}
```

---

### GET `/orders/{number}`
**Response**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "string",
      "status": "string",
      "name": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "number": 0,
      "ingredients": ["string"]
    }
  ]
}
```
