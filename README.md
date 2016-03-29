# parking-space
Webapp to share parking spaces

# TO-DO
- endpoints
  - GET /services/v1/available/:owner:
  - DELETE /services/v1/available/:uuid:
  - GET /services/v1/booked/:owner:
  - DELETE /services/v1/booked/:uuid:
  - GET /services/v1/bookings/:booker:
  - POST /services/v1/book/:uuid:
  - DELETE /services/v1/book/:uuid:
- improve statement building => lightweight orm & generic mapping in db class => model class toSQL
- Add log of user actions => Text file
- Check before add booked parking space if is already booked
- Add hint in case of booking is deleted => please contact the booker to make sure he does not park there

# Data structure of parking space items
```javascript
{
    uuid: '71ca9b30-ed64-42b6-ad4b-aeed810f671d',
    available:   1458604800000, // milliseconds since 01.01.1970 => start of day as GMT
    number: 37,         
    owner: 'Björn',
    booker: 'Joe' | null, // could be null if not booked
    booked: 1458645396000 | null // milliseconds since 01.01.1970, could be null if not booked,
    created: 1458645396000 | null // milliseconds since 01.01.1970,
    updated: 1458645396000 | null // milliseconds since 01.01.1970
}
```

# REST endpoints for someone who would like to offer parking spaces
## GET /services/v1/available
Get all offered available parking spaces today and in the future ordered by date ASC
### Request
n/a
### Response
```javascript
[ {parking-space-item}, {parking-space-item}, ... ]
```

## GET /services/v1/available/:owner:
Get offered available parking spaces by owner today and in the future ordered by date ASC
### Request
n/a
### Response
```javascript
[ {parking-space-item}, {parking-space-item}, ... ]
```

## PUT /services/v1/available
Add offer for available parking space 
### Request
```javascript
 {
    available:   1458604800000, // milliseconds since 01.01.1970 => start of day as GMT
    number: 37,         
    owner: 'Björn'
}
```
### Response
#### Success
Http-Code: 200
```javascript
{ message: 'okay' }
```
#### Error
Http-Code: 409
```javascript
{ message: 'offer for parking space at selected date already exists' }
```

## DELETE /services/v1/available/:uuid:
Delete offer for available parking space
### Request
n/a
### Response
#### Success
Http-Code: 200
```javascript
{ message: 'okay' }
```
#### Error - Not found
Http-Code: 404
```javascript
{ message: 'offer for parking space not found' }
```

#### Error - Is booked offer
Http-Code: 409
```javascript
{ message: 'offer for parking space has been booked and is not available any more' }
```

## GET /services/v1/booked/:owner:
Get offered and booked parking spaces by owner today and in the future ordered by date ASC
### Request
n/a
### Response
```javascript
[ {parking-space-item}, {parking-space-item}, ... ]
```

## DELETE /services/v1/booked/:uuid:
Delete offer for booked parking space
### Request
n/a
### Response
#### Success
Http-Code: 200
```javascript
{ message: 'okay' }
```
#### Error - Not found
Http-Code: 404
```javascript
{ message: 'offer for parking space not found' }
```

#### Error - Is booked offer
Http-Code: 409
```javascript
{ message: 'offer for parking space is not booked anymore' }
```

# REST endpoints for someone who would like to book parking spaces
## GET /services/v1/bookings/:booker:
Get booked parking spaces by booker today and in the future ordered by date ASC
### Request
n/a
### Response
```javascript
[ {parking-space-item}, {parking-space-item}, ... ]
```

## POST /services/v1/book/:uuid:
Book available parking space
### Request
```javascript
{ message: 'okay' }
```
### Response
#### Success
Http-Code: 200
```javascript
{ booker: 'Björn' }
```
#### Error - Not found
Http-Code: 404
```javascript
{ message: 'offer for parking space not found' }
```

#### Error - Is not available
Http-Code: 409
```javascript
{ message: 'offer for parking space has been booked and is not available any more' }
```

## DELETE /services/v1/book/:uuid:
Revoke booking for parking space
### Request
n/a
### Response
#### Success
Http-Code: 200
```javascript
{ message: 'okay' }
```
#### Error - Not found
Http-Code: 404
```javascript
{ message: 'offer for parking space not found' }
```

#### Error - Is not booked
Http-Code: 409
```javascript
{ message: 'offer for parking space was already available' }
```

# SQLLite-Database
## Columns
uuid - VARCHAR(36) NOT NULL

available - DATE NOT NULL 

number - INT NOT NULL

owner - VARCHAR(256) NOT NULL

booker - VARCHAR(256)

booked - INT

created - INT default now() tbd in application

updated - INT default now() on update now() tbd in application

## Index
Unique index on timestamp and number
## SQL
tbd