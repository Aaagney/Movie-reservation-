import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PaymentPage from "./pages/PaymentPage";
import BookingConfirmedPage from "./pages/BookingConfirmedPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import InvoicePage from "./pages/InvoicePage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<PaymentPage />}
        />

        <Route
          path="/payment"
          element={<PaymentPage />}
        />

        <Route
          path="/booking-confirmed/:bookingId"
          element={<BookingConfirmedPage />}
        />

        <Route
          path="/bookings"
          element={<MyBookingsPage />}
        />

        <Route
        path="/invoice/:bookingId"
        element={<InvoicePage />}
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;