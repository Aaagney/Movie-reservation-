import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

// 💡 Changed './components/NavBar' to './components/Navbar' (lowercase 'b')
import Navbar from "./components/Navbar"; 

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import OrderSummary from "./pages/OrderSummary";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/seats/:showtimeId" element={<SeatSelection />} />
              <Route path="/summary" element={<OrderSummary />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;