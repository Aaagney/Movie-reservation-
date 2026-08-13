import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment } from "../services/paymentService";
import "./PaymentPage.css";

function PaymentPage() {
  const navigate = useNavigate();

  // Seat hold timer
  const [timeLeft, setTimeLeft] = useState(4 * 60 + 12);

  // Payment form
  const [cardNumber, setCardNumber] = useState("");
  const [cardholder, setCardholder] = useState("Alex Rivera");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Validation / API
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState("");

  
  const [booking] = useState(() => ({
  bookingId: `BKN${Date.now().toString().slice(-6)}`,
  amount: 17.9,
  serviceFee: 1.0,
  totalAmount: 18.9,
}));

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Format card number
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);

    const formatted = value
      .replace(/(.{4})/g, "$1 ")
      .trim();

    setCardNumber(formatted);

    if (errors.cardNumber) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }));
    }

    setApiError("");
  };

  // Cardholder
  const handleCardholderChange = (e) => {
    setCardholder(e.target.value);

    if (errors.cardholder) {
      setErrors((prev) => ({
        ...prev,
        cardholder: "",
      }));
    }

    setApiError("");
  };

  // Format expiry
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 4);

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    setExpiry(value);

    if (errors.expiry) {
      setErrors((prev) => ({
        ...prev,
        expiry: "",
      }));
    }

    setApiError("");
  };

  // CVV
  const handleCvvChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 3);

    setCvv(value);

    if (errors.cvv) {
      setErrors((prev) => ({
        ...prev,
        cvv: "",
      }));
    }

    setApiError("");
  };

  // Validate expiry
  const isValidExpiry = () => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return false;
    }

    const [monthString, yearString] = expiry.split("/");

    const month = Number(monthString);
    const year = Number(yearString);

    if (month < 1 || month > 12) {
      return false;
    }

    const now = new Date();

    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (year < currentYear) {
      return false;
    }

    if (year === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    const digits = cardNumber.replace(/\s/g, "");

    if (digits.length !== 16) {
      newErrors.cardNumber =
        "Please enter a valid 16-digit card number.";
    }

    if (!cardholder.trim()) {
      newErrors.cardholder =
        "Cardholder name is required.";
    }

    if (!isValidExpiry()) {
      newErrors.expiry =
        "Please enter a valid expiry date.";
    }

    if (cvv.length !== 3) {
      newErrors.cvv =
        "Please enter a valid 3-digit CVV.";
    }

    if (timeLeft <= 0) {
      newErrors.timer =
        "Your seat hold has expired.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit payment to Express backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsProcessing(true);

      const paymentData = {
        bookingId: booking.bookingId,
        amount: booking.amount,
        serviceFee: booking.serviceFee,
        totalAmount: booking.totalAmount,
      };

      const result = await createPayment(paymentData);

      console.log("Payment successful:", result);

      // Go to confirmation screen
      navigate(
        `/booking-confirmed/${booking.bookingId}`
      );
    } catch (error) {
      console.error("Payment failed:", error);

      setApiError(
        error.response?.data?.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="payment-page">
      <div className="payment-container">

        {/* Back */}
        <button
          className="order-summary"
          type="button"
        >
          ← Order Summary
        </button>

        {/* Heading + Timer */}
        <div className="payment-title-row">

          <h1>Payment</h1>

          <div className="seat-timer">
            <span className="timer-icon">
              ◷
            </span>

            <span>
              Seats held for{" "}
              <strong>
                {minutes}:{seconds}
              </strong>
            </span>
          </div>

        </div>

        {errors.timer && (
          <p className="payment-error timer-error">
            {errors.timer}
          </p>
        )}

        {/* Card Preview */}
        <div className="payment-card">

          <div className="card-label">
            PAYMENT CARD
          </div>

          <div className="card-number-preview">
            {cardNumber ||
              "••••  ••••  ••••  ••••"}
          </div>

          <div className="card-bottom">

            <div>
              <span className="card-small-label">
                Card Holder
              </span>

              <strong>
                {cardholder
                  ? cardholder.toUpperCase()
                  : "CARD HOLDER"}
              </strong>
            </div>

            <div className="card-expiry-preview">
              <span className="card-small-label">
                Expires
              </span>

              <strong>
                {expiry || "MM/YY"}
              </strong>
            </div>

          </div>
        </div>

        {/* Payment Form */}
        <form
          className="payment-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Card Number */}
          <div className="form-group">

            <label htmlFor="cardNumber">
              CARD NUMBER
            </label>

            <input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className={
                errors.cardNumber ? "input-error" : ""
              }
            />

            {errors.cardNumber && (
              <span className="payment-error">
                {errors.cardNumber}
              </span>
            )}

          </div>

          {/* Cardholder */}
          <div className="form-group">

            <label htmlFor="cardholder">
              CARDHOLDER NAME
            </label>

            <input
              id="cardholder"
              type="text"
              autoComplete="cc-name"
              value={cardholder}
              onChange={handleCardholderChange}
              className={
                errors.cardholder ? "input-error" : ""
              }
            />

            {errors.cardholder && (
              <span className="payment-error">
                {errors.cardholder}
              </span>
            )}

          </div>

          {/* Expiry + CVV */}
          <div className="form-row">

            <div className="form-group">

              <label htmlFor="expiry">
                EXPIRY (MM/YY)
              </label>

              <input
                id="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="08/27"
                maxLength="5"
                value={expiry}
                onChange={handleExpiryChange}
                className={
                  errors.expiry ? "input-error" : ""
                }
              />

              {errors.expiry && (
                <span className="payment-error">
                  {errors.expiry}
                </span>
              )}

            </div>

            <div className="form-group">

              <label htmlFor="cvv">
                CVV
              </label>

              <input
                id="cvv"
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="•••"
                maxLength="3"
                value={cvv}
                onChange={handleCvvChange}
                className={
                  errors.cvv ? "input-error" : ""
                }
              />

              {errors.cvv && (
                <span className="payment-error">
                  {errors.cvv}
                </span>
              )}

            </div>

          </div>

          {/* Security */}
          <div className="security-message">
            🔒 Payments are end-to-end encrypted and
            processed securely.
            <br />
            (Demo — no real charge.)
          </div>

          {/* Backend Error */}
          {apiError && (
            <div className="api-error-message">
              {apiError}
            </div>
          )}

          {/* Pay */}
          <button
            className="pay-button"
            type="submit"
            disabled={
              timeLeft <= 0 || isProcessing
            }
          >
            {isProcessing
              ? "Processing..."
              : timeLeft > 0
                ? "Pay $18.9 & Confirm"
                : "Seat Hold Expired"}
          </button>

        </form>

      </div>
    </main>
  );
}

export default PaymentPage;