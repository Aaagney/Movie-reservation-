const db = require("../config/db");

// CREATE PAYMENT + GENERATE INVOICE
 

const createPayment = async (req, res) => {
  let connection;

  try {
    const {
      bookingId,
      amount,
      serviceFee = 0,
      totalAmount,
    } = req.body;

    // Validate required data
    if (!bookingId || amount == null || totalAmount == null) {
      return res.status(400).json({
        message:
          "Booking ID, amount and total amount are required",
      });
    }

    // Convert amounts to numbers
    const numericAmount = Number(amount);
    const numericServiceFee = Number(serviceFee);
    const numericTotalAmount = Number(totalAmount);

    // Validate amounts
    if (
      !Number.isFinite(numericAmount) ||
      !Number.isFinite(numericServiceFee) ||
      !Number.isFinite(numericTotalAmount) ||
      numericAmount < 0 ||
      numericServiceFee < 0 ||
      numericTotalAmount <= 0
    ) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    // Get connection from MySQL pool
    connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    
    // CHECK IF BOOKING IS ALREADY PAID
    

    const [existingPayments] = await connection.query(
      `SELECT
        payment_id,
        payment_status,
        transaction_id
      FROM payments
      WHERE booking_id = ?
        AND payment_status = 'SUCCESS'
      LIMIT 1`,
      [bookingId]
    );

    if (existingPayments.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        message:
          "Payment has already been completed for this booking",
      });
    }

    
    // GENERATE TRANSACTION ID
    

    const transactionId = "TXN-" + Date.now();

     
    // CREATE PAYMENT
    

    const [paymentResult] = await connection.query(
      `INSERT INTO payments
      (
        booking_id,
        amount,
        service_fee,
        total_amount,
        payment_method,
        payment_status,
        transaction_id,
        paid_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        bookingId,
        numericAmount,
        numericServiceFee,
        numericTotalAmount,
        "CARD",
        "SUCCESS",
        transactionId,
      ]
    );

    const paymentId = paymentResult.insertId;

     
    // GENERATE INVOICE NUMBER
    

    const invoiceNumber =
      "INV-" + Date.now() + "-" + paymentId;

    // 
    // CREATE INVOICE
    // 

    const [invoiceResult] = await connection.query(
      `INSERT INTO invoices
      (
        invoice_number,
        payment_id,
        booking_id,
        subtotal,
        service_fee,
        total_amount
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        invoiceNumber,
        paymentId,
        bookingId,
        numericAmount,
        numericServiceFee,
        numericTotalAmount,
      ]
    );

    
    await connection.commit();

    return res.status(201).json({
      message:
        "Payment successful and invoice generated",

      payment: {
        paymentId,
        bookingId,
        transactionId,
        amount: numericAmount,
        serviceFee: numericServiceFee,
        totalAmount: numericTotalAmount,
        paymentMethod: "CARD",
        status: "SUCCESS",
      },

      invoice: {
        invoiceId: invoiceResult.insertId,
        invoiceNumber,
        bookingId,
        subtotal: numericAmount,
        serviceFee: numericServiceFee,
        totalAmount: numericTotalAmount,
      },
    });
  } catch (error) {
    // Rollback if something failed
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError
        );
      }
    }

    console.error("Payment error:", error);

    return res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  } finally {
    // Return connection to pool
    if (connection) {
      connection.release();
    }
  }
};

// 
// GET ALL SUCCESSFUL PAYMENTS + INVOICES
// 

const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        p.payment_id,
        p.booking_id,
        p.amount,
        p.service_fee,
        p.total_amount,
        p.payment_method,
        p.payment_status,
        p.transaction_id,
        p.paid_at,

        i.invoice_id,
        i.invoice_number,
        i.issued_at

      FROM payments p

      LEFT JOIN invoices i
        ON p.payment_id = i.payment_id

      WHERE p.payment_status = 'SUCCESS'

      ORDER BY p.paid_at DESC, p.payment_id DESC`
    );

    return res.status(200).json({
      message:
        "Payments retrieved successfully",

      count: rows.length,

      data: rows,
    });
  } catch (error) {
    console.error(
      "Get all payments error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to retrieve payments",
      error: error.message,
    });
  }
};


// GET PAYMENT + INVOICE USING BOOKING ID


const getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    const [rows] = await db.query(
      `SELECT
        p.payment_id,
        p.booking_id,
        p.amount,
        p.service_fee,
        p.total_amount,
        p.payment_method,
        p.payment_status,
        p.transaction_id,
        p.paid_at,

        i.invoice_id,
        i.invoice_number,
        i.issued_at

      FROM payments p

      LEFT JOIN invoices i
        ON p.payment_id = i.payment_id

      WHERE p.booking_id = ?

      ORDER BY p.payment_id DESC

      LIMIT 1`,
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      message:
        "Payment details retrieved successfully",

      data: rows[0],
    });
  } catch (error) {
    console.error(
      "Get payment error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to retrieve payment details",
      error: error.message,
    });
  }
};


module.exports = {
  createPayment,
  getAllPayments,
  getPaymentByBookingId,
};