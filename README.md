# parking-space
Webapp to share parking spaces

# TO-DO
- Implement service layer
- Add list which parking-space is where => Anette Just used for display
- Add log of user actions => Text file
- Check before add booked parking space if is already booked

# REST endpoints

## GET /services/v1/available/all
Get all available parking spaces
### Request
-
### Response
```javascript
[
    {
        uuid: '71ca9b30-ed64-42b6-ad4b-aeed810f671d',
        timestamp: 1458642611943, // milliseconds since 01.01.1970
        number: 37,
        owner: 'Björn' 
    },
    ...
]
```

## GET /services/v1/available/mine
Get my available parking spaces
### Request
### Response

## POST /services/v1/available/mine
Add available parking space to mine
### Request
```javascript

```
### Response


## DELETE /services/v1/available/mine/:UUID:
Delete available parking space from mine
### Request
### Response

## GET /services/v1/booked/all
Get all booked parking spaces
### Request
### Response

## GET /services/v1/booked/mine
Get my booked parking spaces
### Request
### Response

## PUT /services/v1/booked/mine/:UUID:
Add booked parking space to mine
### Request
### Response

## DELETE /services/v1/booked/mine/:UUID:
Delete booked parking space from mine
### Request
### Response

# Database
## MySQL

// add datatypes here
// add create table statement

uuid
timestamp
number
owner
booked_by
booked_at
