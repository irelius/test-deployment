/session
GET  /session                       <!-- Get the Current Login User info -->
POST /session                       <!-- Log In a User >>> always start with this function first -->
DELETE /session                     <!-- Delete the Log In and the session -->

/users
GET  /users/:userId/reviews         <!-- Get all Reviews of the Current user -->
GET  /users/:userId                 <!-- Get information on a userId, can be provided (to check a user) or the current Log In user -->
POST /users/signup                  <!-- Sign Up a User + change from /new to /signup -->


/spots
GET  /spots/users/:userId/spots     <!-- Get all Spots owned by the Current User -->
DELETE /spots/:spotId/images/:spotImageId/users/:userId <!-- Delete a Spot Image + userId as owner of the Spot -->
POST /spots/:spotId/images/users/:userId  <!-- Add an Image to a Spot based on the Spot's id + userId as owner -->
GET  /spots/:spotId/reviews         <!-- Get all Reviews by a Spot's Id -->
POST /spots/:spotId/reviews/users/:userId <!-- Create a Review for a Spot based on the Spot's id + userId to check if already has a review -->
GET  /spots/:spotId/bookings        <!-- Get all Bookings for a Spot based on the Spot's id -->
POST /spots/:spotId/bookings/:userId  <!-- Create a Booking from a Spot based on the Spot's id + userId as the one created the booking -->
GET  /spots/query                   <!-- Add query Filter to Get All Spots -->
GET  /spots/:spotId                 <!-- Get details of a Spot from an id -->
PUT  /spots/:spotId/users/:userId   <!-- Edit a Spot + only by the owner -->
DELETE /spots/:spotId/users/:userId <!-- Delete a Spot + only by the owner -->
POST /spots/users/:userId/new       <!-- Create a Spot + need userId for owner in Spot -->
GET  /spots                         <!-- Get all the Spots -->


/reviews
DELETE /reviews/:reviewId/image/:reviewImageId/users/:userId  <!-- Delete a Review Image + userId as the owner of the review -->
POST /reviews/:reviewId/users/:userId/images      <!-- Add an Image to a Review based on the Reviews's id + userId for the owner -->
PUT  /reviews/:reviewId/users/:userId             <!-- Edit a Review + userId of the review owner -->
DELETE /reviews/:reviewId/users/:userId           <!-- Delete a Review + userId of the review owner -->


/bookings
GET  /bookings/:userId                            <!-- Get all the Current User's Bookings -->
PUT  /bookings/:bookingId/users/:userId           <!-- Edit a Booking + userId as the owner of the booking -->
DELETE /bookings/:bookingId/users/:userId         <!-- Delete a Booking + userId as the owner of the booking or the owner of the Spot -->