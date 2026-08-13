import { useEffect, useState } from "react";
import { getMyBookings } from "../services/bookingService";
import "./MyBookingsPage.css";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);

        const data = await getMyBookings();

        setBookings(data);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError("Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <main className="bookings-page">
        <div className="bookings-container">
          <p className="bookings-state">Loading bookings...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bookings-page">
        <div className="bookings-container">
          <p className="bookings-state bookings-error">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bookings-page">
      <div className="bookings-container">

        <div className="bookings-heading">
          <h1>My Bookings</h1>

          <p>
            View and manage your upcoming reservations.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h2>No bookings yet</h2>
            <p>Your confirmed bookings will appear here.</p>
          </div>
        ) : (
          <div className="bookings-list">

            {bookings.map((booking) => (
              <article
                className="booking-card"
                key={booking.bookingId}
              >

                {/* Temporary poster until movie API provides image */}
                <div className="booking-poster">
                  <div className="poster-glow" />

                  <span>THE</span>

                  <strong>
                    VENETIAN
                    <br />
                    HEIST
                  </strong>
                </div>

                <div className="booking-content">

                  <div className="booking-main">

                    <h2>{booking.movieTitle}</h2>

                    <p className="booking-screen">
                      {booking.screen}
                    </p>

                    <div className="booking-show-details">

                      <div>
                        <span>DATE</span>
                        <strong>{booking.date}</strong>
                      </div>

                      <div>
                        <span>TIME</span>
                        <strong>{booking.time}</strong>
                      </div>

                      <div>
                        <span>SEATS</span>
                        <strong>
                          {booking.seats.join(", ")}
                        </strong>
                      </div>

                    </div>

                    <div className="booking-meta">

                      <span className="booking-status">
                        {booking.status}
                      </span>

                      <span className="booking-reference">
                        {booking.bookingId}
                      </span>

                    </div>

                  </div>

                  <div className="booking-side">

                    <div className="booking-price">
                      ${Number(booking.totalAmount).toFixed(1)}
                    </div>

                    <button
                      className="cancel-booking-button"
                      type="button"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default MyBookingsPage;