/users
GET  /users/:userId/reviews         <!-- Get all Reviews of the Current user -->
GET  /users/:userId                 <!-- Get the Current User -->
POST /users/login                   <!-- Log In a User -->
POST /users/new                     <!-- Sign Up a User -->


/spots
GET  /spots/users/:userId/spots     <!-- Get all Spots owned by the Current User -->
DELETE /spots/:spotId/images/:spotImageId   <!-- Delete a Spot Image -->
POST /spots/:spotId/images          <!-- Add an Image to a Spot based on the Spot's id -->
GET  /spots/:spotId/reviews         <!-- Get all Reviews by a Spot's Id -->
POST /spots/:spotId/reviews         <!-- Create a Review for a Spot based on the Spot's id -->
GET  /spots/:spotId/bookings        <!-- Get all Bookings for a Spot based on the Spot's id -->
POST /spots/:spotId/bookings        <!-- Create a Booking from a Spot based on the Spot's id -->
GET  /spots/:spotId                 <!-- Get details of a Spot from an id -->
PUT  /spots/:spotId/user/:userId    <!-- Edit a Spot only by the owner -->
DELETE /spots/:spotId               <!-- Delete a Spot -->
POST /spots/new                     <!-- Create a Spot -->
GET  /spots/query                   <!-- Add query Filter to Get All Spots -->
GET  /spots                         <!-- Get all the Spots -->


/reviews
DELETE /reviews/:reviewId/image/:reviewImageId  <!-- Delete a Review Image -->
POST /reviews/:reviewId/images      <!-- Add an Image to a Review based on the Reviews's id -->
PUT  /reviews/:reviewId             <!-- Edit a Review -->
DELETE /reviews/:reviewId           <!-- Delete a Review -->


/bookings
GET  /bookings/:userId              <!-- Get all the Current User's Bookings -->
PUT  /bookings/:bookingId           <!-- Edit a Booking -->
DELETE /bookings/:bookingId         <!-- Delete a Booking -->