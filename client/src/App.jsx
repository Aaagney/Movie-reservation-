<<<<<<< HEAD
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import BookingSummary from './pages/BookingSummary.jsx';
import BookingSuccess from './pages/BookingSuccess.jsx';
import Login from './pages/Login.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Theatres from './pages/Theatres.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminMovies from './pages/admin/AdminMovies.jsx';
import AdminTheatres from './pages/admin/AdminTheatres.jsx';
import AdminScreens from './pages/admin/AdminScreens.jsx';
import AdminShowtimes from './pages/admin/AdminShowtimes.jsx';
import AdminBookings from './pages/admin/AdminBookings.jsx';

function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cine-black">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
      <Route path="/movies/:id" element={<SiteLayout><MovieDetail /></SiteLayout>} />
      <Route path="/showtimes/:showtimeId/seats" element={<SiteLayout><SeatSelection /></SiteLayout>} />
      <Route path="/booking/summary" element={<SiteLayout><BookingSummary /></SiteLayout>} />
      <Route path="/booking/success/:bookingId" element={<SiteLayout><BookingSuccess /></SiteLayout>} />
      <Route path="/theatres" element={<SiteLayout><Theatres /></SiteLayout>} />
      <Route path="/my-bookings" element={<SiteLayout><MyBookings /></SiteLayout>} />
      <Route path="/login" element={<SiteLayout><Login /></SiteLayout>} />

      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="theatres" element={<AdminTheatres />} />
        <Route path="screens" element={<AdminScreens />} />
        <Route path="showtimes" element={<AdminShowtimes />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
=======
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
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
