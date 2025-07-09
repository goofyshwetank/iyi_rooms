iYi Rooms Public API Documentation
Overview
The iYi Rooms Public API provides read-only access to hotel information for public consumption. This API is designed for travel websites, mobile apps, and other public-facing applications that need to display hotel data.
Base URL: https://admin.iyirooms.com/api/public
Features
✓ Read-only access (No authentication required for public data)
✓ CORS enabled (Can be called from any frontend application)
✓ Caching (Server-side caching with 30-minute cache for performance)
✓ Pagination (Efficient handling of large datasets)
✓ Filtering & Sorting (Find hotels by location, price, etc.)
✓ JSON responses (Clean, structured data format)
✓ Nightly & Hourly Rates (Complete pricing information for both booking types)
Authentication
No authentication required. All endpoints are publicly accessible.
Endpoints
List Hotels
Get a paginated list of all active hotels with filtering and sorting options.
GET /api/public/hotels
Query Parameters
Parameter
Type
Default
Description
page
integer
1
Page number (1-based)
size
integer
20
Items per page (max 100)
city
string


Filter by city name (partial match)
state
string


Filter by state name (partial match)
country
string


Filter by country name (partial match)
minPrice
decimal


Minimum price per night (after discount)
maxPrice
decimal


Maximum price per night (after discount)
sortBy
string
name
Sort field: name, city, state, featured, created
sortOrder
string
asc
Sort order: asc or desc
featured
boolean


Filter featured hotels only

Example Request
curl “https://admin.iyirooms.com/api/public/hotels?page=1&size=10&city=Mumbai&minPrice=1000&maxPrice=5000&sortBy=name&sortOrder=asc”
Example Response
{ “data”: […], “pagination”: {…}, “filters”: {…} }
Get Hotel Details
Get detailed information about a specific hotel.
GET /api/public/hotels/{id}
Example Request
curl “https://admin.iyirooms.com/api/public/hotels/1”
Example Response
{ “id”: 1, “name”: “iYi Rooms Premium Mumbai”, … }
Get Hotel Rooms
Get room types and pricing for a specific hotel.
GET /api/public/hotels/{id}/rooms
Example Request
curl “https://admin.iyirooms.com/api/public/hotels/1/rooms”
Example Response
{ “hotelId”: 1, “rooms”: […], “totalRoomTypes”: 4, “priceRange”: {…} }
Get Available Cities
GET /api/public/hotels/cities
Example Response
[ { “id”: 1, “city”: “Mumbai”, “state”: “Maharashtra”, “hotelCount”: 25 }, …]
Find Nearby Hotels
GET /api/public/hotels/nearby
Query Parameters
Parameter
Type
Required
Description
lat
decimal
Yes
Latitude (-90 to 90)
lng
decimal
Yes
Longitude (-180 to 180)
radius
integer
No
Search radius in km (1-100, default: 10)
page
integer
No
Page number (default: 1)
size
integer
No
Items per page (default: 20, max: 100)

Example Request
curl “https://admin.iyirooms.com/api/public/hotels/nearby?lat=19.1136&lng=72.8697&radius=5&page=1&size=10”
Example Response
{ “searchLocation”: {…}, “radiusKm”: 5, “hotels”: […], “totalFound”: 8, “pagination”: {…} }
Data Structures
Pricing Information
Nightly Rates
pricePerNight: Original room price per night
discountPerNight: Discount amount per night (if any)
payableAmount: Final amount to pay per night
Hourly Rates
hourlyPrice: Basic hourly price for the room
hourlyDiscount: Hourly discount (if any)
hourlyPayableAmount: Final hourly amount
roomCategoryHourlyRates: Array of specific hour packages
Price Ranges
minPricePerNight / maxPricePerNight: Range of nightly stays
minHourlyPrice / maxHourlyPrice: Range of hourly stays
Error Responses
All error responses follow a consistent format:
{ “error”: “Error type”, “message”: “Detailed error message” }
Common HTTP Status Codes
200 OK - Success 400 Bad Request - Invalid parameters 404 Not Found - Resource not found 500 Internal Server Error - Server error
Validation Rules
Pagination: Page must be >= 1, size between 1-100 Coordinates: Latitude between -90 and 90, longitude between -180 and 180 Radius: Between 1 and 100 kilometers Sort fields: Only name, city, state, featured, created allowed Sort order: Only asc or desc allowed
Caching
Server-side caching: 30 minutes for hotel data, 1 hour for cities Client recommendations: Cache responses for 15-30 minutes Cache headers: Responses include appropriate cache-control headers
Best Practices
Efficient API Usage
Use Appropriate Page Sizes
Combine Filters
Error Handling
Coordinate Validation
Code Examples
Examples in React.js, JavaScript, PHP, Python provided.
Changelog
Version 1.2
Added nightly and hourly rate information
Enhanced room endpoint with hourly rate packages
Improved price range calculations
Added payableAmount fields
Updated all endpoints to include hourly pricing
Version 1.1
Added CORS support
Implemented server-side caching
Enhanced filtering and pagination
Added coordinate validation
Version 1.0
Initial release with hotel search, pagination, filtering, and public read-only access
