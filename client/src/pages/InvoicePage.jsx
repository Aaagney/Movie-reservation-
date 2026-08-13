import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPaymentByBookingId } from "../services/paymentService";
import "./InvoicePage.css";

function InvoicePage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const response = await getPaymentByBookingId(bookingId);
        setPayment(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [bookingId]);

  if (loading) {
    return <div className="invoice-state">Loading invoice...</div>;
  }

  if (error || !payment) {
    return (
      <div className="invoice-state invoice-error">
        {error || "Invoice not found."}
      </div>
    );
  }

  const paymentDate = payment.paid_at
    ? new Date(payment.paid_at).toLocaleString("en-IN")
    : "—";

  return (
    <main className="invoice-page">
      <div className="invoice-wrapper">

        <div className="invoice-actions no-print">
          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            type="button"
            className="download-button"
            onClick={() => window.print()}
          >
            Download Invoice
          </button>
        </div>

        <section className="invoice-card">

          <div className="invoice-header">
            <div>
              <div className="invoice-brand">CINEVAULT</div>
              <p>Movie Reservation System</p>
            </div>

            <div className="invoice-title">
              <h1>INVOICE</h1>
              <span>{payment.invoice_number || "—"}</span>
            </div>
          </div>

          <div className="invoice-line" />

          <div className="invoice-info">
            <div>
              <span>BOOKING ID</span>
              <strong>{payment.booking_id}</strong>
            </div>

            <div>
              <span>TRANSACTION ID</span>
              <strong>{payment.transaction_id}</strong>
            </div>

            <div>
              <span>PAYMENT DATE</span>
              <strong>{paymentDate}</strong>
            </div>

            <div>
              <span>PAYMENT METHOD</span>
              <strong>{payment.payment_method}</strong>
            </div>
          </div>

          <div className="invoice-table">

            <div className="invoice-table-header">
              <span>Description</span>
              <span>Amount</span>
            </div>

            <div className="invoice-table-row">
              <span>Movie Tickets</span>
              <strong>
                ${Number(payment.amount).toFixed(2)}
              </strong>
            </div>

            <div className="invoice-table-row">
              <span>Service Fee</span>
              <strong>
                ${Number(payment.service_fee).toFixed(2)}
              </strong>
            </div>

          </div>

          <div className="invoice-total">
            <span>Total Paid</span>

            <strong>
              ${Number(payment.total_amount).toFixed(2)}
            </strong>
          </div>

          <div className="invoice-status">
            ✓ PAYMENT {payment.payment_status}
          </div>

          <div className="invoice-footer">
            <p>Thank you for booking with CineVault.</p>
            <span>
              This invoice was generated electronically.
            </span>
          </div>

        </section>
      </div>
    </main>
  );
}

export default InvoicePage;