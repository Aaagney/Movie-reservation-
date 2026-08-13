# CinéVault seat booking

Run `node server.js`, then open [http://localhost:4173](http://localhost:4173).

The API holds selected seats on the server for 10 minutes. A confirmation turns a hold into a booking; another simultaneous customer receives a 409 conflict and refreshed availability. `booking-data.json` is created automatically and retains confirmed bookings between restarts.
