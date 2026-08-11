/// Nairobi PowerBikes email template registry — core.
///
/// Every email is rendered from the branded editorial design system
/// (styles.js + components.js). Authentic templates live in templates_ops.js
/// and templates_mkt.js; this module wires the registry, aliases, overrides,
/// previews and legacy exports used by hooks.
///
/// Mode: LIGHT by default (editorial marketing/transactional). The
/// security/authentication family opts into DARK via its template meta.

const components = require(__hooks + "/lib/email/components.js")
const styles = require(__hooks + "/lib/email/styles.js")
const { esc } = components

const DEFAULT_VARS = (app) => {
  const meta = app ? app.settings().meta : {}
  return {
    siteName: meta.appName || "Nairobi Powerbikes",
    siteUrl: meta.appURL || "https://www.nairobi-powerbikes.co.ke",
    currentYear: String(new Date().getFullYear()),
    brandRed: styles.LIGHT.red,
  }
}

function deepMergeVars(base, extra) {
  const out = Object.assign({}, base || {})
  for (const k of Object.keys(extra || {})) {
    const v = extra[k]
    if (v !== null && v !== undefined && typeof v === "object" && !Array.isArray(v) && typeof out[k] === "object" && out[k] !== null && !Array.isArray(out[k])) {
      out[k] = deepMergeVars(out[k], v)
    } else {
      out[k] = v
    }
  }
  return out
}

/** Substitute {{var}} tokens (and dot paths like {{user.name}}). */
function substitute(template, vars) {
  let out = String(template || "")
  const resolve = (path) => {
    let cur = vars
    for (const part of path.split(".")) {
      if (cur == null) return ""
      cur = cur[part]
    }
    if (cur == null) return ""
    if (typeof cur === "object") return JSON.stringify(cur)
    return String(cur)
  }
  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, path) => resolve(path))
  return out
}

function money(n) {
  const num = Number(n || 0)
  if (isNaN(num)) return "KSh 0"
  return "KSh " + num.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function readJson(v) {
  if (v == null) return {}
  if (typeof v === "object" && typeof v.string === "function") {
    try {
      const s = v.string()
      return s ? JSON.parse(s) : {}
    } catch (err) { return {} }
  }
  if (typeof v === "string") {
    try { return JSON.parse(v) } catch (err) { return {} }
  }
  return v
}

/** Legacy layout — editorial light shell. */
function layout(innerHtml, vars, opts) {
  return components.layout(styles.palette("light"), innerHtml, vars, opts || {})
}

function buttonBlock(text, url, opts) {
  return components.button(styles.palette("light"), text, url, opts || {})
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const REGISTRY = {}

function def(key, meta, render) {
  REGISTRY[key] = Object.assign({ key, mode: meta.mode || "light" }, meta, { render })
}

const extra = require(__hooks + "/lib/email/templates_ops.js")
for (const k of Object.keys(extra.LIST || {})) {
  const v = extra.LIST[k]
  REGISTRY[k] = Object.assign({ key: k, mode: (v.meta && v.meta.mode) || "light" }, v.meta, { render: v.render })
}
const mkt = require(__hooks + "/lib/email/templates_mkt.js")
for (const k of Object.keys(mkt.LIST || {})) {
  const v = mkt.LIST[k]
  REGISTRY[k] = Object.assign({ key: k, mode: (v.meta && v.meta.mode) || "light" }, v.meta, { render: v.render })
}

// --- legacy key -> registry key (dynamic where noted) ---
const ALIASES = {
  auth_verify: "verify_email",
  auth_welcome: "welcome",
  auth_password_reset: "password_reset",
  auth_password_changed: "password_changed",
  auth_email_change: "email_changed",
  auth_new_login: "new_login",
  restock_notification: "restock",
  payment_receipt: "payment_received",
  financing_activated: "financing_approved",
  payment_reminder: "payment_due",
  payment_overdue: "payment_overdue",
}

/** booking_status_<status> legacy keys -> status-specific template keys. */
function bookingTemplateKey(rawStatus, isTestRide) {
  const status = String(rawStatus || "").toLowerCase()
  const map = {
    pending: "received",
    awaiting_verification: "received",
    confirmed: "confirmed",
    rescheduled: "rescheduled",
    cancelled: "cancelled",
    rejected: "cancelled",
    no_show: "cancelled",
    diagnosed: "diagnosis",
    awaiting_approval: "approval_required",
    approved: "in_progress",
    checked_in: "in_progress",
    in_progress: "in_progress",
    quality_check: "in_progress",
    ready: "ready",
    completed: "completed",
  }
  const step = map[status] || "received"
  if (isTestRide) {
    if (step === "received") return "test_ride_received"
    if (step === "confirmed") return "test_ride_confirmed"
    if (step === "rescheduled") return "test_ride_rescheduled"
    if (step === "cancelled") return "test_ride_cancelled"
    if (step === "completed" || step === "ready") return "test_ride_completed"
    if (step === "diagnosis" || step === "approval_required") return "test_ride_received"
    return "test_ride_reminder"
  }
  const svc = {
    received: "service_booking_received",
    confirmed: "service_booking_confirmed",
    rescheduled: "service_booking_rescheduled",
    cancelled: "service_booking_cancelled",
    diagnosis: "service_diagnosis",
    approval_required: "service_approval_required",
    in_progress: "service_in_progress",
    ready: "service_ready",
    completed: "service_completed",
  }
  return svc[step] || "service_booking_received"
}

function resolveKey(key) {
  if (REGISTRY[key]) return key
  if (key && key.indexOf("booking_status_") === 0) return null
  return ALIASES[key] || ("campaign_" === (key || "").slice(0, 9) ? "campaign" : null) || "fallback"
}

/**
 * Render a registry template into a full branded HTML document.
 * key may be a registry key, alias or raw legacy key; unknown -> fallback.
 * Mode: explicit opts.mode wins, otherwise the template's own mode
 * (security family = dark, everything else = editorial light).
 */
function renderKey(key, vars, opts) {
  const o = opts || {}
  const rkey = resolveKey(key)
  const defn = REGISTRY[rkey] || REGISTRY.fallback
  const mode = o.mode || (vars && vars.mode) || defn.mode || "light"
  const t = styles.palette(mode)
  const out = defn.render(t, vars || {}) || {}
  const html = components.layout(t, out.html || "", vars || {}, {
    subject: out.subject || "",
    previewText: out.previewText || "",
    marketing: defn.marketing === true,
    mode: mode,
  })
  return {
    subject: out.subject || "",
    previewText: out.previewText || "",
    html,
    marketing: defn.marketing === true,
    key: rkey,
    mode,
  }
}

// ---------------------------------------------------------------------------
// Local (auth/security + system) templates
// ---------------------------------------------------------------------------

const contactLine = (t, vars) => components.contactLine(t, vars)

def("fallback", { category: "system", name: "Simple Message", marketing: false, mode: "light" }, (t, vars) => ({
  subject: vars.subject || "Message from Nairobi Powerbikes",
  previewText: vars.previewText || "",
  html:
    components.category(t, "From Nairobi Powerbikes") +
    components.heading(t, vars.headline || "A message from Nairobi Powerbikes") +
    (vars.bodyHtml || components.paragraph(t, vars.body || "Nothing to worry about — this is a simple message from the Nairobi Powerbikes team.")) +
    contactLine(t, vars),
}))

def("verify_email", { category: "authentication", name: "Email Verification", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Verify your Nairobi PowerBikes account",
  previewText: "One last step and your account is ready to ride.",
  html:
    components.category(t, "Account Verification") +
    components.heading(t, "Confirm your email") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", thanks for joining Nairobi Powerbikes. Confirm your email address to activate your account.") +
    components.button(t, "Go To My Account", vars.actionUrl || vars.siteUrl + "/login") +
    components.paragraph(t, "If you didn't create this account, you can safely ignore this email.", { muted: true, mb: 0 }),
}))

def("welcome", { category: "authentication", name: "Welcome", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Welcome to Nairobi Powerbikes, " + (vars.firstName || "rider") + "!",
  previewText: "Your account is verified — time to find your next ride.",
  html:
    components.category(t, "Welcome To Nairobi Powerbikes") +
    components.heading(t, "Welcome aboard, " + (vars.firstName || "rider") + ".") +
    components.paragraph(t, "Your account is verified and ready. Here's where to start:") +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 4px;">` +
    components.linkRow(t, { title: "Browse Motorcycles", meta: "Explore the full lineup", url: vars.siteUrl + "/motorcycles" }) +
    components.linkRow(t, { title: "Book A Test Ride", meta: "Feel the machine", url: vars.siteUrl + "/service/test-ride" }) +
    components.linkRow(t, { title: "Book A Service", meta: "Keep your machine fighting fit", url: vars.siteUrl + "/service/booking" }) +
    `</table>` +
    components.paragraph(t, "Manage your account, bookings and preferences from your dashboard at any time.", { muted: true, mb: 0 }),
}))

def("otp", { category: "authentication", name: "Verification Code (OTP)", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Your Nairobi PowerBikes security code",
  previewText: "Use your one-time code to securely continue signing in.",
  html:
    components.category(t, "Account Security") +
    components.heading(t, "Verify your account") +
    components.paragraph(t, "Use the verification code below to continue.") +
    components.otp(t, vars.otpCode || "000000") +
    components.paragraph(t, "Valid for " + (vars.otpExpiry || "10 minutes") + ".", { muted: true, align: "center", size: 12.5 }) +
    components.alertBox(t, "Never share this code with anyone. Nairobi Powerbikes staff will never ask for your verification code."),
}))

def("password_reset", { category: "authentication", name: "Password Reset", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Reset your Nairobi PowerBikes password",
  previewText: "We received a request to reset your password.",
  html:
    components.category(t, "Account Security") +
    components.heading(t, "Reset your password") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", we received a request to reset the password for your Nairobi Powerbikes account. Tap the button below to choose a new one.") +
    components.button(t, "Reset Password", vars.actionUrl || vars.siteUrl + "/login") +
    components.paragraph(t, "Reset links expire in 24 hours. If you didn't request this, you can ignore this email and your password will stay unchanged.", { muted: true, mb: 0 }),
}))

def("password_changed", { category: "authentication", name: "Password Changed", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Your Nairobi PowerBikes password was changed",
  previewText: "Your password was just updated.",
  html:
    components.category(t, "Account Security") +
    components.heading(t, "Password updated") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", the password for your Nairobi Powerbikes account was just changed. If this was you, no further action is needed.") +
    components.alertBox(t, "If you didn't make this change, reset your password immediately and contact our support team.", { kind: "danger" }),
}))

def("email_changed", { category: "authentication", name: "Email Address Changed", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Confirm your new Nairobi PowerBikes email",
  previewText: "We need to confirm a change to your account email.",
  html:
    components.category(t, "Account Security") +
    components.heading(t, "Confirm your new email") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", please confirm the change of your account email to " + "<strong style='color:" + t.ink + ";'>" + esc(vars.newEmail || "") + "</strong>" + ". Your account details will update once confirmed.") +
    components.alertBox(t, "If you didn't request this change, contact us immediately so we can secure your account.", { kind: "danger" }),
}))

def("new_login", { category: "authentication", name: "New Sign-In Detected", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "New sign-in to your Nairobi PowerBikes account",
  previewText: "A new sign-in was detected on your account.",
  html:
    components.category(t, "Account Security") +
    components.heading(t, "New sign-in detected") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", a new sign-in to your Nairobi Powerbikes account was detected.") +
    components.details(t, "Sign-In Details", [
      { label: "Date", value: vars.loginDate },
      { label: "Time", value: vars.loginTime },
      { label: "Device", value: vars.loginDevice || "Desktop" },
      { label: "Browser", value: vars.loginBrowser || "—" },
      { label: "Location", value: vars.loginLocation || "Nairobi, Kenya" },
    ]) +
    components.button(t, "Secure My Account", vars.siteUrl + "/login", { mt: 28 }) +
    components.paragraph(t, "If this wasn't you, secure your account immediately.", { muted: true, mb: 0 }),
}))

def("security_alert", { category: "system", name: "Security Alert", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Security alert — Nairobi PowerBikes",
  previewText: "An important security notice for your account.",
  html:
    components.category(t, "Security Alert") +
    components.heading(t, "Action needed") +
    components.paragraph(t, vars.alertMessage || "We noticed unusual activity on your account. Please review your recent activity.") +
    components.paragraph(t, vars.alertDetail || "If you recognise this activity, no action is needed.") +
    components.button(t, "Review My Account", vars.siteUrl + "/dashboard", { mt: 28 }),
}))

def("important_account_update", { category: "system", name: "Important Account Update", marketing: false, mode: "dark" }, (t, vars) => ({
  subject: "Important update about your Nairobi PowerBikes account",
  previewText: "Please read — an important update regarding your account.",
  html:
    components.category(t, "Account Update") +
    components.heading(t, "Important update") +
    components.paragraph(t, vars.updateMessage || "There is an important update regarding your Nairobi Powerbikes account.") +
    (vars.updateUrl ? components.button(t, vars.updateCta || "Read More", vars.updateUrl, { mt: 26 }) : "") +
    contactLine(t, vars),
}))

def("booking_new_admin", { category: "admin", name: "New Booking (Admin)", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "New booking: " + (vars.customerName || "customer") + " — " + (vars.motorcycleName || "motorcycle"),
  previewText: "A new booking request just landed.",
  html:
    components.category(t, "Booking Alert") +
    components.heading(t, "New " + (vars.bookingType === "test_ride" ? "test ride" : "service") + " request") +
    components.paragraph(t, (vars.customerName || "A customer") + " has submitted a new booking request.") +
    components.details(t, "Booking", [
      { label: "Customer", value: vars.customerName, strong: true },
      { label: "Contact", value: vars.email || vars.phone },
      { label: "Motorcycle", value: vars.motorcycleName },
      { label: "Service", value: vars.serviceType },
      { label: "Date", value: (vars.bookingDate + (vars.bookingTime ? " · " + vars.bookingTime : "")) },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference, strong: true },
    ]) +
    components.button(t, "Open Bookings", vars.siteUrl + "/dashboard/service-bookings", { mt: 28 }),
}))

def("booking_reminder", { category: "bookings", name: "Booking Reminder (Same Day)", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Reminder: your booking is today",
  previewText: "See you at the branch today!",
  html:
    components.category(t, "Booking Reminder") +
    components.heading(t, "Your booking is today") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", a quick reminder that your " + (vars.bookingType === "test_ride" ? "test ride" : "booking") + " is scheduled for today. We look forward to seeing you at the branch.") +
    components.details(t, "Today's Visit", [
      { label: "Motorcycle", value: vars.motorcycleName, strong: true },
      { label: "Time", value: vars.bookingTime || "Flexible" },
      { label: "Branch", value: vars.branchName },
      { label: "Reference", value: vars.bookingReference },
    ]) +
    components.button(t, "View Booking", vars.bookingUrl || vars.siteUrl + "/dashboard/my-bookings", { mt: 28 }),
}))

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function listTemplates() {
  const list = []
  for (const k of Object.keys(REGISTRY)) {
    if (k === "fallback") continue
    const t = REGISTRY[k]
    list.push({
      key: k,
      name: t.name,
      category: t.category,
      description: t.description || "",
      marketing: t.marketing === true,
      mode: t.mode || "light",
    })
  }
  list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
  return list
}

function sampleVars(app, key) {
  const vars = DEFAULT_VARS(app)
  const base = {
    // Deterministic QA fixture: John Kamau · Tekken 400RR · KSh 385,000 ·
    // Nairobi HQ · PB-TR-2026-001.
    customerName: "John Kamau",
    firstName: "John",
    email: "john.kamau@example.com",
    phone: "+254 700 123 456",
    siteName: "Nairobi Powerbikes",
    motorcycleName: "Tekken 400RR",
    motorcycleBrand: "Powerbikes",
    motorcyclePrice: "KSh 385,000",
    motorcycleOldPrice: "",
    motorcycleYear: "2026",
    motorcycleCc: "400",
    motorcycleUrl: vars.siteUrl + "/motorcycles/tekken-400rr",
    motorcycleImage: "",
    blogTitle: "The Ultimate Guide To Your First Track Day",
    blogExcerpt: "From tyre warmers to body position — everything John needs to know before his first session at the track.",
    blogReadingTime: "4 min read",
    blogCategory: "Riding Culture",
    blogUrl: vars.siteUrl + "/blog/track-day-guide",
    blogImage: "",
    moreArticles: [
      { title: "Why The Right Motorcycle Changes The Way You Ride Nairobi", url: vars.siteUrl + "/blog/motorcycle-for-nairobi", meta: "Riding Culture · 3 min" },
      { title: "Service Checklist: 5 Things Before The Long Weekend", url: vars.siteUrl + "/blog/service-checklist", meta: "Maintenance · 2 min" },
    ],
  }
  const samples = {
    verification: {
      bookingReference: "PB-TR-2026-001",
      bookingDate: "13 August 2026",
      bookingTime: "10:30 AM",
      branchName: "Nairobi HQ",
      bookingStatus: "confirmed",
      serviceType: "Full Service",
      otpCode: "492817",
      otpExpiry: "10 minutes",
      actionUrl: vars.siteUrl + "/login",
      newEmail: "john.kamau.new@example.com",
      loginDate: "11 August 2026",
      loginTime: "3:44 PM EAT",
      loginDevice: "Desktop",
      loginBrowser: "Chrome",
      loginLocation: "Nairobi, Kenya",
      saleReference: "PB-SALE-2026-001",
      amountReceived: "KSh 385,000",
      amountPaid: "KSh 385,000",
      totalPayable: "KSh 385,000",
      outstandingBalance: "KSh 0",
      totalPrice: "KSh 385,000",
      paymentMethod: "M-Pesa",
      paymentReference: "MP-9KJ2X8T",
      s: "subscribed",
      installments: "12",
      installmentAmount: "KSh 23,750",
      financedAmount: "KSh 285,000",
      deposit: "KSh 100,000",
      frequency: "monthly",
      provider: "Nairobi Powerbikes Finance",
      dueDate: "28 August 2026",
      stockCount: "2",
      stockStatus: "In Stock",
      supportAgentName: "Brian Kariuki",
      chatUrl: vars.siteUrl + "/chat",
      messagePreview: "Thanks for waiting, John — we've confirmed your slot at Nairobi HQ for Thursday at 10:30 AM. See you there!",
      announcementTitle: "New Branch Opening — Westlands",
      announcementMessage: "We're thrilled to announce our second Nairobi Powerbikes showroom, opening this month at Westlands. Full service bay, the complete lineup, and a rider lounge. Come say hello.",
    },
  }
  return Object.assign({}, vars, base, samples.verification)
}

/** Load a template override record by key (cached). */
function loadTemplate(app, key) {
  const cacheKey = "npb_email_tpl_" + key
  const cached = app.store().get(cacheKey)
  if (cached) return cached
  const recs = app.findRecordsByFilter("email_templates", "key = {:k}", "", 1, 0, { k: key })
  if (recs.length === 0) return null
  const tpl = recs[0]
  const obj = {
    key: tpl.getString("key") || key,
    name: tpl.getString("name") || key,
    subject: tpl.getString("subject"),
    html: tpl.getString("html") || tpl.getString("body"),
    text: tpl.getString("text"),
    enabled: tpl.getBool("enabled") || tpl.getBool("active"),
  }
  app.store().set(cacheKey, obj)
  return obj
}

/**
 * Resolve + render a template. Prefers an admin override record
 * (email_templates); otherwise renders the built-in branded design.
 */
function resolveTemplate(app, key, vars, fallbackSubject, fallbackBody, opts) {
  const o = opts || {}
  const rkey = resolveKey(key)
  const defn = REGISTRY[rkey] || REGISTRY.fallback
  const mode = o.mode || (vars && vars.mode) || defn.mode || "light"
  const override = (() => {
    try { return loadTemplate(app, key) } catch (e) { return null }
  })()
  if (override && override.enabled !== false && override.html && override.html.trim()) {
    const subj = substitute(override.subject || fallbackSubject || key, vars)
    const html = substitute(override.html, vars)
    const text = substitute(override.text || "", vars)
    return { subject: subj, html, text, key, overridden: true, mode }
  }
  const renderVars = deepMergeVars(vars, {
    subject: vars.subject || fallbackSubject || "",
    body: vars.body || fallbackBody || "",
  })
  const rendered = renderKey(rkey, renderVars, { mode })
  const subject = rendered.subject || substitute(fallbackSubject || "", vars) || key
  return { subject, html: rendered.html, text: substitute((vars && vars.text) || "", vars) || "", key: rkey, overridden: false, marketing: rendered.marketing, mode }
}

/** Render a registered template with VARS (for previews + tests). */
function renderTemplate(app, key, vars, opts) {
  const o = opts || {}
  const rkey = resolveKey(key)
  const defn = REGISTRY[rkey] || REGISTRY.fallback
  const mode = o.mode || (vars && vars.mode) || defn.mode || "light"
  const out = renderKey(rkey, vars, { mode })
  return Object.assign({}, out, {
    key: rkey,
    requestedKey: key,
    name: defn.name,
    category: defn.category,
  })
}

function hasTemplate(key) {
  return !!REGISTRY[resolveKey(key)] && resolveKey(key) !== "fallback"
}

module.exports = {
  DEFAULT_VARS, deepMergeVars, substitute, layout, buttonBlock, money,
  loadTemplate, resolveTemplate, readJson,
  renderTemplate, listTemplates, sampleVars, resolveKey, bookingTemplateKey, hasTemplate,
}