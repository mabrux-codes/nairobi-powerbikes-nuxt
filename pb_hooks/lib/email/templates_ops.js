/// Nairobi PowerBikes email templates — operations (editorial LIGHT mode).
/// Service bookings, test rides, sales, payments and financing follow the
/// same reading flow: category → headline → short copy → visual → CTA →
/// structured details → supportive note. No dashboard cards.

const components = require(__hooks + "/lib/email/components.js")

const LIST = {}

function d(key, meta, render) { LIST[key] = { meta, render } }

const contactLine = (t, vars) => components.contactLine(t, vars)

// ---------------------------------------------------------------------------
// SERVICE BOOKINGS
// ---------------------------------------------------------------------------

d("service_booking_received", { category: "bookings", name: "Service Booking Received", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Booking request received — " + (vars.motorcycleName || "your motorcycle"),
  previewText: "Thanks for booking with Nairobi Powerbikes. We'll confirm your slot shortly.",
  html:
    components.category(t, "Service Booking") +
    components.heading(t, "Booking request received") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", thank you for booking with Nairobi Powerbikes. Our team will confirm your slot shortly — here's a summary of your request:") +
    components.product(t, vars, { cta: "View Booking", ctaVariant: "secondary", meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.details(t, "Service Booking", [
      { label: "Service", value: vars.serviceType },
      { label: "Date", value: vars.bookingDate },
      { label: "Time", value: vars.bookingTime || "Flexible" },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.button(t, "View Booking", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

d("service_booking_confirmed", { category: "bookings", name: "Service Booking Confirmed", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your service booking is confirmed — " + (vars.motorcycleName || "motorcycle"),
  previewText: "Your slot is locked in. See you at the branch!",
  html:
    components.category(t, "Service Booking") +
    components.heading(t, "Your service is confirmed") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your service appointment has been confirmed. Please arrive 10 minutes early and carry your booking reference.") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.details(t, "Service Details", [
      { label: "Service", value: vars.serviceType },
      { label: "Date", value: vars.bookingDate, strong: true },
      { label: "Time", value: vars.bookingTime || "Flexible", strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.button(t, "View Service", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { mt: 28 }) +
    contactLine(t, vars),
}))

d("service_booking_rescheduled", { category: "bookings", name: "Service Booking Rescheduled", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your service booking has been rescheduled",
  previewText: "A new time has been confirmed for your service booking.",
  html:
    components.category(t, "Service Booking") +
    components.heading(t, "Booking rescheduled") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your service booking has been moved. Here are the updated details:") +
    components.details(t, "Updated Booking", [
      { label: "Motorcycle", value: vars.motorcycleName, strong: true },
      { label: "Service", value: vars.serviceType },
      { label: "New Date", value: vars.bookingDate, strong: true },
      { label: "Time", value: vars.bookingTime || "Flexible", strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.paragraph(t, "If the new time doesn't work for you, contact us and we'll find another slot.", { muted: true }) +
    components.button(t, "View Booking", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { mt: 24 }) +
    contactLine(t, vars),
}))

d("service_booking_cancelled", { category: "bookings", name: "Service Booking Cancelled", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your service booking was cancelled",
  previewText: "We've cancelled your booking as requested.",
  html:
    components.category(t, "Service Booking") +
    components.heading(t, "Booking cancelled") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your service booking for the " + (vars.motorcycleName || "motorcycle") + " has been cancelled.") +
    components.paragraph(t, "Changed your mind? You can book a new slot any time, or reach out and we'll help you get back on the road.") +
    components.button(t, "Book Again", vars.siteUrl + "/service/booking", { mt: 26 }) +
    contactLine(t, vars),
}))

d("service_diagnosis", { category: "bookings", name: "Service Diagnosis Started", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Diagnosis started — " + (vars.motorcycleName || "your motorcycle"),
  previewText: "Our technicians have started working on your machine.",
  html:
    components.category(t, "Service Update") +
    components.heading(t, "Diagnosis started") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", our technicians have started diagnosing your " + (vars.motorcycleName || "motorcycle") + ". If any work beyond the approved scope is needed, we'll get your approval before proceeding.") +
    components.details(t, "Service", [
      { label: "Motorcycle", value: vars.motorcycleName, strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference },
    ]) +
    components.button(t, "View Booking", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

d("service_approval_required", { category: "bookings", name: "Service Approval Required", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your approval is needed — " + (vars.motorcycleName || "service"),
  previewText: "Your service requires your approval before we proceed.",
  html:
    components.category(t, "Service Update") +
    components.heading(t, "Approval needed") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", our technicians found additional work needed on your " + (vars.motorcycleName || "motorcycle") + ". Please review and approve so we can proceed.") +
    components.alertBox(t, "No work will be carried out without your approval.", { kind: "warning" }) +
    components.button(t, "Review & Approve", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { mt: 26 }) +
    contactLine(t, vars),
}))

d("service_in_progress", { category: "bookings", name: "Service In Progress", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "In progress — " + (vars.motorcycleName || "your motorcycle"),
  previewText: "Your machine is on the work bay right now.",
  html:
    components.category(t, "Service Update") +
    components.heading(t, "Work in progress") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your " + (vars.motorcycleName || "motorcycle") + " is now on the work bay. We'll keep you posted as the service progresses and when it's ready for collection.") +
    components.details(t, "Service", [
      { label: "Motorcycle", value: vars.motorcycleName, strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference },
    ]) +
    components.button(t, "View Booking", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

d("service_ready", { category: "bookings", name: "Service Ready For Collection", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Ready for collection — " + (vars.motorcycleName || "your motorcycle"),
  previewText: "Your motorcycle is serviced and ready to ride.",
  html:
    components.category(t, "Service Update") +
    components.heading(t, "Ready for collection") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", great news — your " + (vars.motorcycleName || "motorcycle") + " is serviced and ready for collection.") +
    components.details(t, "Ready For Pickup", [
      { label: "Motorcycle", value: vars.motorcycleName, strong: true },
      { label: "Collection", value: "During branch hours" },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference },
    ]) +
    components.button(t, "View Booking", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { mt: 28 }) +
    contactLine(t, vars),
}))

d("service_completed", { category: "bookings", name: "Service Completed", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Service completed — thank you!",
  previewText: "Your service is complete. Thanks for riding with us.",
  html:
    components.category(t, "Service Update") +
    components.heading(t, "Service completed") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your service has been completed. Thank you for trusting Nairobi Powerbikes with your machine.") +
    components.paragraph(t, "Ride safe — and if anything feels off, we're always here.") +
    components.button(t, "Book A Service", vars.siteUrl + "/service/booking", { variant: "secondary", mt: 26 }) +
    contactLine(t, vars),
}))

// ---------------------------------------------------------------------------
// TEST RIDES
// ---------------------------------------------------------------------------

d("test_ride_received", { category: "test_rides", name: "Test Ride Request Received", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Test ride request received — " + (vars.motorcycleName || "motorcycle"),
  previewText: "Thanks for requesting a test ride. We'll confirm your slot shortly.",
  html:
    components.category(t, "Test Ride Booking") +
    components.heading(t, "Request received") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", thanks for requesting a test ride on the " + (vars.motorcycleName || "motorcycle") + ". Here's what we've got down:") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.details(t, "Test Ride Request", [
      { label: "Date", value: vars.bookingDate, strong: true },
      { label: "Time", value: vars.bookingTime || "Flexible", strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.paragraph(t, "Please carry your national ID and a valid driver's licence.", { muted: true }) +
    components.button(t, "View Test Ride", vars.bookingUrl || vars.siteUrl + "/dashboard/my-test-rides", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

d("test_ride_confirmed", { category: "test_rides", name: "Test Ride Confirmed", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your test ride is confirmed",
  previewText: "Your Nairobi Powerbikes test ride details are inside.",
  html:
    components.category(t, "Test Ride Booking") +
    components.heading(t, "Your test ride is confirmed") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", you're all set. We've reserved your slot and our team will be ready to welcome you.") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.details(t, "Your Test Ride", [
      { label: "Date", value: vars.bookingDate, strong: true },
      { label: "Time", value: vars.bookingTime || "Flexible", strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.paragraph(t, "Remember to bring your national ID and a valid driver's licence. We'll have a helmet and riding gear ready for you.", { size: 13.5 }) +
    components.button(t, "View Test Ride", vars.bookingUrl || vars.siteUrl + "/dashboard/my-test-rides", { mt: 26 }) +
    contactLine(t, vars),
}))

d("test_ride_rescheduled", { category: "test_rides", name: "Test Ride Rescheduled", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your test ride has been rescheduled",
  previewText: "A new time has been confirmed for your test ride.",
  html:
    components.category(t, "Test Ride Booking") +
    components.heading(t, "Test ride rescheduled") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your test ride has been moved to a new slot:") +
    components.details(t, "Updated Slot", [
      { label: "Motorcycle", value: vars.motorcycleName, strong: true },
      { label: "New Date", value: vars.bookingDate, strong: true },
      { label: "Time", value: vars.bookingTime || "Flexible", strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.paragraph(t, "If the new time doesn't work for you, contact us and we'll find another slot.", { muted: true }) +
    components.button(t, "View Test Ride", vars.bookingUrl || vars.siteUrl + "/dashboard/my-test-rides", { mt: 24 }) +
    contactLine(t, vars),
}))

d("test_ride_cancelled", { category: "test_rides", name: "Test Ride Cancelled", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your test ride was cancelled",
  previewText: "We've cancelled your test ride as requested.",
  html:
    components.category(t, "Test Ride Booking") +
    components.heading(t, "Test ride cancelled") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your test ride has been cancelled.") +
    components.paragraph(t, "Changed your mind? Book another slot any time or visit the branch for a walk-in test ride.") +
    components.button(t, "Book A Test Ride", vars.siteUrl + "/service/test-ride", { mt: 26 }) +
    contactLine(t, vars),
}))

d("test_ride_reminder", { category: "test_rides", name: "Test Ride Reminder", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your test ride is today — " + (vars.motorcycleName || "motorcycle"),
  previewText: "Today's the day. See you at the branch.",
  html:
    components.category(t, "Test Ride Booking") +
    components.heading(t, "Your test ride is today") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", just a reminder that your test ride on the " + (vars.motorcycleName || "motorcycle") + " is today. Bring your national ID and a valid driver's licence.") +
    components.details(t, "Today's Ride", [
      { label: "Time", value: vars.bookingTime || "Flexible", strong: true },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.button(t, "View Test Ride", vars.bookingUrl || vars.siteUrl + "/dashboard/my-test-rides", { mt: 28 }) +
    contactLine(t, vars),
}))

d("test_ride_completed", { category: "test_rides", name: "Test Ride Completed", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Thanks for the test ride, " + (vars.firstName || "rider") + "!",
  previewText: "We hope you loved the ride. Your next steps await.",
  html:
    components.category(t, "Test Ride Booking") +
    components.heading(t, "Hope you enjoyed the ride") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", thanks for test riding the " + (vars.motorcycleName || "motorcycle") + ". We hope it felt like home.") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.button(t, "Make It Yours", vars.motorcycleUrl || vars.siteUrl + "/motorcycles", { mt: 24 }) +
    components.paragraph(t, "Questions about financing or the trade-in value of your current bike? Our team is ready to help.", { muted: true, mt: 4 }) +
    contactLine(t, vars),
}))

d("test_ride_followup", { category: "test_rides", name: "Test Ride Follow-Up", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "How was the ride, " + (vars.firstName || "rider") + "?",
  previewText: "We'd love to hear your thoughts on the test ride.",
  html:
    components.category(t, "Test Ride Booking") +
    components.heading(t, "How was the ride?") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", a couple of days ago you test rode the " + (vars.motorcycleName || "motorcycle") + ". Still thinking it over? Ask us anything — or lock it in and join the family.") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.button(t, "View Motorcycle", vars.motorcycleUrl || vars.siteUrl + "/motorcycles", { mt: 24 }) +
    components.link(t, "Apply for financing", vars.siteUrl + "/finance", { align: "left", mt: 14 }) +
    contactLine(t, vars),
}))

// ---------------------------------------------------------------------------
// SALES
// ---------------------------------------------------------------------------

d("sale_confirmation", { category: "sales", name: "Sale Confirmation", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your new ride awaits — " + (vars.motorcycleName || "motorcycle") + " | Nairobi PowerBikes",
  previewText: "Thank you for choosing Nairobi Powerbikes. Your machine is ready.",
  html:
    components.category(t, "Purchase Confirmed") +
    components.heading(t, "Your new ride is almost home") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", thank you for choosing Nairobi Powerbikes. You're now the proud owner of a " + (vars.motorcycleName || "new motorcycle") + ".") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.details(t, "Order Details", [
      { label: "Order", value: vars.saleReference || vars.bookingReference, strong: true },
      { label: "Purchase Price", value: vars.totalPayable || "KSh 0" },
      { label: "Amount Received", value: vars.amountReceived || vars.amountPaid || "KSh 0", color: t.success, strong: true },
      { label: "Outstanding Balance", value: vars.outstandingBalance || "KSh 0" },
      { label: "Payment Method", value: vars.paymentMethod },
    ]) +
    components.paragraph(t, "Your ownership documents will be prepared by our team. For anything at all, reply to this email or visit the branch.") +
    components.button(t, "View Order", vars.saleUrl || vars.siteUrl + "/dashboard", { mt: 26 }) +
    contactLine(t, vars),
}))

d("sale_new_admin", { category: "admin", name: "New Sale (Admin)", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "New sale: " + (vars.customerName || "customer") + " — " + (vars.motorcycleName || "motorcycle"),
  previewText: "A new sale was just recorded.",
  html:
    components.category(t, "Sales Alert") +
    components.heading(t, "New sale recorded") +
    components.paragraph(t, "A new sale just went through:") +
    components.details(t, "Sale", [
      { label: "Customer", value: vars.customerName, strong: true },
      { label: "Motorcycle", value: vars.motorcycleName },
      { label: "Total", value: vars.totalPayable },
      { label: "Received", value: vars.amountReceived || vars.amountPaid, color: t.success },
      { label: "Outstanding", value: vars.outstandingBalance || "KSh 0" },
      { label: "Method", value: vars.paymentMethod },
      { label: "Reference", value: vars.saleReference, strong: true },
    ]) +
    components.button(t, "Open Sales", vars.siteUrl + "/dashboard/sales-inventory", { mt: 28 }),
}))

d("payment_received", { category: "payments", name: "Payment Received", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Payment received — " + (vars.amountReceived || "KSh") + " | Nairobi PowerBikes",
  previewText: "Your payment has been successfully recorded.",
  html:
    components.category(t, "Payment Receipt") +
    components.heading(t, "Payment received") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your payment has been successfully recorded.") +
    `<p style="margin:4px 0 22px;font-size:36px;font-weight:800;letter-spacing:-0.01em;line-height:1.1;color:${t.red};">${components.esc(vars.amountReceived || "KSh 0")}</p>` +
    components.details(t, "Transaction Details", [
      { label: "Motorcycle", value: vars.motorcycleName },
      { label: "Sale Reference", value: vars.saleReference },
      { label: "Payment Reference", value: vars.paymentReference },
      { label: "Payment Date", value: vars.paymentDate },
      { label: "Payment Method", value: vars.paymentMethod },
      { label: "Amount Received", value: vars.amountReceived, color: t.success, strong: true },
      { label: "Total Paid", value: vars.amountPaid, strong: true },
      { label: "Outstanding", value: vars.outstandingBalance || "KSh 0" },
    ]) +
    components.button(t, "View Purchase", vars.saleUrl || vars.siteUrl + "/dashboard", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

d("payment_new_admin", { category: "admin", name: "New Payment (Admin)", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Payment received — " + (vars.amountReceived || "KSh") + " (" + (vars.customerName || "customer") + ")",
  previewText: "A payment was recorded against a sale.",
  html:
    components.category(t, "Sales Alert") +
    components.heading(t, "Payment recorded") +
    components.paragraph(t, "A payment was recorded against a sale:") +
    components.details(t, "Payment", [
      { label: "Customer", value: vars.customerName, strong: true },
      { label: "Motorcycle", value: vars.motorcycleName },
      { label: "Amount", value: vars.amountReceived, color: t.success, strong: true },
      { label: "Method", value: vars.paymentMethod },
      { label: "Reference", value: vars.paymentReference },
    ]) +
    components.button(t, "Open Sales", vars.siteUrl + "/dashboard/sales-inventory", { mt: 28 }),
}))

// ---------------------------------------------------------------------------
// FINANCING
// ---------------------------------------------------------------------------

d("financing_received", { category: "finance", name: "Financing Application Received", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Financing application received — " + (vars.motorcycleName || "motorcycle"),
  previewText: "We're reviewing your financing application.",
  html:
    components.category(t, "Financing") +
    components.heading(t, "Application under review") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", we've received your financing application for the " + (vars.motorcycleName || "motorcycle") + ". Our team is reviewing it and will get back to you shortly.") +
    components.details(t, "Application", [
      { label: "Motorcycle", value: vars.motorcycleName },
      { label: "Total Price", value: vars.totalPrice || "KSh 0" },
      { label: "Deposit", value: vars.deposit },
      { label: "Status", value: "Under Review", color: t.warning, strong: true },
    ]) +
    components.button(t, "View Financing", vars.siteUrl + "/finance", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

d("financing_approved", { category: "finance", name: "Financing Approved", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your financing is approved, " + (vars.firstName || "rider") + "!",
  previewText: "Great news — your financing plan is active.",
  html:
    components.category(t, "Financing") +
    components.heading(t, "Your financing is approved") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your financing plan is now active for your " + (vars.motorcycleName || "motorcycle") + ".") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.details(t, "Your Plan", [
      { label: "Provider", value: vars.provider || "Nairobi Powerbikes" },
      { label: "Deposit Paid", value: vars.deposit, color: t.success },
      { label: "Financed Amount", value: vars.financedAmount },
      { label: "Installments", value: (vars.installments || "—") + " × " + (vars.installmentAmount || "—") + " (" + (vars.frequency || "monthly") + ")" },
      { label: "Total Payable", value: vars.totalPayable, strong: true },
    ]) +
    components.button(t, "View Financing", vars.financeUrl || vars.siteUrl + "/dashboard", { mt: 28 }) +
    components.paragraph(t, "Ride it well — we'll remind you before each installment is due.", { muted: true }) +
    contactLine(t, vars),
}))

d("financing_declined", { category: "finance", name: "Financing Declined", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "An update on your financing application",
  previewText: "We're unable to approve your application at this time.",
  html:
    components.category(t, "Financing") +
    components.heading(t, "Application update") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", thank you for applying for financing at Nairobi Powerbikes. We're unable to approve your application at this time.") +
    components.paragraph(t, "This doesn't mean the end of the road — you can re-apply later, build your deposit, or explore our other payment options. Our team can also walk you through the decision and what might help next time.") +
    components.button(t, "Explore Options", vars.siteUrl + "/finance", { mt: 26 }) +
    contactLine(t, vars),
}))

d("payment_due", { category: "finance", name: "Payment Reminder (Due)", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your next installment is due soon — " + (vars.installmentAmount || "KSh"),
  previewText: "A friendly reminder about your upcoming installment.",
  html:
    components.category(t, "Financing") +
    components.heading(t, "Payment reminder") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your next installment is due soon. Keep your plan on track with a quick payment:") +
    `<p style="margin:0 0 8px;font-size:34px;font-weight:800;letter-spacing:-0.01em;line-height:1.1;color:${t.red};">${components.esc(vars.installmentAmount || "")}</p>` +
    components.details(t, "Installment", [
      { label: "Due Date", value: vars.dueDate, strong: true },
      { label: "Outstanding Balance", value: vars.outstandingBalance || "KSh 0" },
      { label: "Motorcycle", value: vars.motorcycleName },
    ]) +
    components.button(t, "Make Payment", vars.financeUrl || vars.siteUrl + "/dashboard", { mt: 26 }) +
    components.paragraph(t, "Having trouble? Talk to us — we're flexible and we'd rather help than see you fall behind.", { muted: true }) +
    contactLine(t, vars),
}))

d("payment_overdue", { category: "finance", name: "Payment Overdue", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your installment is overdue — " + (vars.installmentAmount || "KSh"),
  previewText: "Your installment is now overdue. Let's sort it out together.",
  html:
    components.category(t, "Financing") +
    components.heading(t, "Payment overdue") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your installment was due on " + (vars.dueDate || "the scheduled date") + " and hasn't been received yet. Let's sort it out together — you can pay now or reach out and we'll arrange a plan.") +
    `<p style="margin:0 0 8px;font-size:34px;font-weight:800;letter-spacing:-0.01em;line-height:1.1;color:${t.red};">${components.esc(vars.installmentAmount || "")}</p>` +
    components.details(t, "Overdue Installment", [
      { label: "Due Date", value: vars.dueDate, strong: true },
      { label: "Outstanding Balance", value: vars.outstandingBalance || "KSh 0" },
      { label: "Reference", value: vars.financeReference || vars.bookingReference },
    ]) +
    components.button(t, "Make Payment", vars.financeUrl || vars.siteUrl + "/dashboard", { mt: 26 }) +
    components.paragraph(t, "If you've already paid, thank you — ignore this email.", { muted: true }),
}))

d("financing_completed", { category: "finance", name: "Financing Completed", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "You own it outright, " + (vars.firstName || "rider") + "!",
  previewText: "Your financing is complete — the bike is fully yours.",
  html:
    components.category(t, "Financing") +
    components.heading(t, "It's all yours") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", congratulations — your financing for the " + (vars.motorcycleName || "motorcycle") + " is now fully paid off. No more installments — just open roads.") +
    components.product(t, vars, { meta: (vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : "") }) +
    components.button(t, "Browse New Rides", vars.siteUrl + "/motorcycles", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

module.exports = { LIST }