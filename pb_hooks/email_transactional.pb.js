/// <reference path="../pb_data/types.d.ts" />

/// Transactional emails.
/// Hooks existing domain events and enqueues customer + admin emails through
/// the centralized queue engine. In-app notifications are handled separately
/// by the existing notification hooks — emails are an additional channel.

// --- SERVICE BOOKINGS / TEST RIDES ---

onRecordAfterCreateSuccess((e) => {
  const tx = require(__hooks + "/lib/email/transactional.js")
  const r = e.record
  try {
    tx.bookingReceived(e.app, r)
    tx.bookingNewAdmin(e.app, r)
  } catch (err) {
    e.app.logger().error("booking email: " + (err && err.message))
  }
  e.next()
}, "service_bookings")

// Status change detection (mirrors notifications.pb.js pattern)
onRecordUpdateRequest((e) => {
  try {
    const r = e.record
    const newStatus = r.getString("status")
    let oldStatus = newStatus
    try {
      oldStatus = e.app.findRecordById("service_bookings", r.id).getString("status")
    } catch (err) {}
    if (oldStatus !== newStatus) {
      e.app.store().set("npb_booking_prev_" + r.id, oldStatus)
    }
  } catch (err) {}
  e.next()
}, "service_bookings")

onRecordAfterUpdateSuccess((e) => {
  const tx = require(__hooks + "/lib/email/transactional.js")
  const r = e.record
  const oldStatus = e.app.store().get("npb_booking_prev_" + r.id)
  e.app.store().remove("npb_booking_prev_" + r.id)
  if (oldStatus && oldStatus !== r.getString("status")) {
    try {
      tx.bookingStatusChanged(e.app, r, oldStatus)
    } catch (err) {
      e.app.logger().error("booking status email: " + (err && err.message))
    }
  }
  e.next()
}, "service_bookings")

// --- SALES ---
onRecordAfterCreateSuccess((e) => {
  const tx = require(__hooks + "/lib/email/transactional.js")
  const r = e.record
  const status = r.getString("status")
  if (status && status !== "draft" && status !== "cancelled") {
    try {
      tx.saleConfirmation(e.app, r)
      tx.saleNewAdmin(e.app, r)
    } catch (err) {
      e.app.logger().error("sale email: " + (err && err.message))
    }
  }
  e.next()
}, "sales")

// --- PAYMENTS ---
onRecordAfterCreateSuccess((e) => {
  const tx = require(__hooks + "/lib/email/transactional.js")
  const r = e.record
  try {
    const saleId = r.getString("sale")
    if (saleId) {
      const sale = e.app.findRecordById("sales", saleId)
      tx.paymentReceipt(e.app, r, sale)
      tx.paymentNewAdmin(e.app, r, sale)
    }
  } catch (err) {
    e.app.logger().error("payment email: " + (err && err.message))
  }
  e.next()
}, "payments")

// --- FINANCING ---
onRecordAfterCreateSuccess((e) => {
  const tx = require(__hooks + "/lib/email/transactional.js")
  const r = e.record
  try {
    const saleId = r.getString("sale")
    if (saleId) {
      const sale = e.app.findRecordById("sales", saleId)
      tx.financingActivated(e.app, r, sale)
    }
  } catch (err) {
    e.app.logger().error("financing email: " + (err && err.message))
  }
  e.next()
}, "financing")
