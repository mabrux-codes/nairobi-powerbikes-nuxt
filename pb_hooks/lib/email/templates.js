/// Shared email template rendering helpers.
///
/// NOTE: PB JSVM hook callbacks run in isolated contexts, so modules are
/// required inside callbacks. `$app` is not passed in — the sender/queue
/// helpers receive it as a parameter.

const DEFAULT_VARS = (app) => {
  const meta = app.settings().meta
  return {
    siteName: meta.appName || "Nairobi Powerbikes",
    siteUrl: meta.appURL || "https://nairobipowerbikes.com",
    currentYear: String(new Date().getFullYear()),
    brandRed: "#ef2a2a",
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

/** Branded responsive HTML email wrapper. */
function layout(innerHtml, vars) {
  const v = vars || {}
  const siteName = v.siteName || "Nairobi Powerbikes"
  const siteUrl = v.siteUrl || "https://nairobipowerbikes.com"
  const year = v.currentYear || String(new Date().getFullYear())
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${siteName}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0c;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${v.previewText || ""}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0c;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#101013;border:1px solid #26262b;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:28px 24px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="font-family:'Trebuchet MS',Arial,sans-serif;font-size:24px;font-weight:900;letter-spacing:1px;color:#ffffff;">NAIROBI&nbsp;<span style="color:#ef2a2a;">POWERBIKES</span></span>
                    <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:4px;color:#6b6b74;text-transform:uppercase;">Ride The Power</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="padding:8px 24px 0;"><div style="height:1px;background:#26262b;"></div></td></tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px 24px 8px;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#c9c9d1;">
              ${innerHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:16px 24px 28px;">
              <div style="height:1px;background:#26262b;margin-bottom:20px;"></div>
              <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:#6b6b74;">
                ${siteName} · Nairobi, Kenya
              </p>
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;color:#6b6b74;">
                <a href="${siteUrl}/privacy" style="color:#ef2a2a;text-decoration:none;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}/terms" style="color:#ef2a2a;text-decoration:none;">Terms</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}/contact" style="color:#ef2a2a;text-decoration:none;">Contact</a>
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#3f3f46;">
                © ${year} ${siteName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Build a CTA button block. */
function buttonBlock(text, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
  <tr>
    <td align="center" style="background-color:#ef2a2a;border-radius:10px;padding:0;">
      <a href="${url}" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${text}</a>
    </td>
  </tr>
</table>`
}

function money(n) {
  const num = Number(n || 0)
  if (isNaN(num)) return "0"
  return "KSh " + num.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

/** Load a template record by key (cached in app.store to avoid re-queries). */
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
    variables: tpl.getString("variables"),
  }
  app.store().set(cacheKey, obj)
  return obj
}

/** Resolve a template by key, falling back to a plain subject/body pair. */
function resolveTemplate(app, key, vars, fallbackSubject, fallbackBody) {
  const tpl = loadTemplate(app, key)
  if (tpl && tpl.enabled !== false) {
    let subject = substitute(tpl.subject, vars)
    let html = tpl.html || ""
    let text = tpl.text || ""
    if (html) {
      html = substitute(html, vars)
    } else {
      html = substitute(fallbackBody, vars)
    }
    if (text) text = substitute(text, vars)
    return { subject, html, text, key: tpl.key }
  }
  return {
    subject: substitute(fallbackSubject || key, vars),
    html: substitute(fallbackBody || "", vars),
    text: "",
    key,
  }
}

/** Read a JSON field value (PB returns a JsonRaw-like object). */
function readJson(v) {
  if (v == null) return {}
  if (typeof v === "object" && typeof v.string === "function") {
    try {
      const s = v.string()
      return s ? JSON.parse(s) : {}
    } catch (err) {
      return {}
    }
  }
  if (typeof v === "string") {
    try { return JSON.parse(v) } catch (err) { return {} }
  }
  return v
}

module.exports = { DEFAULT_VARS, deepMergeVars, substitute, layout, buttonBlock, money, loadTemplate, resolveTemplate, readJson }
