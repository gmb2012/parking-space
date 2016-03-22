# parking-space
Webapp to share parking spaces

# TO-DO
- Implement service layer

# REST endpoints

## GET /services/v1/available/all
Get all available parking spaces
### Request
### Response

## GET /services/v1/available/mine
Get my available parking spaces
### Request
### Response

## PUT /services/v1/available/mine/:UUID:
Add available parking space to mine
### Request
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
UUID - Date - Location - Number - Owner - BookedBy - BookedAt
