/// Nairobi PowerBikes email component library — editorial email system.
///
/// Email-first building blocks: tables + inline styles + safe media queries.
/// The visual language is editorial (Apple/Headspace-style reading flow), NOT
/// dashboard UI: one centered column, generous whitespace, hairline dividers,
/// sentence-case headlines, small tracked category labels, single primary CTA.
///
/// Every function takes (t, vars) where t is the active palette (styles.js).
/// All user-supplied values must go through `esc` before injection.

const st = require(__hooks + "/lib/email/styles.js")

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/// Keep a value for HTML attributes (fully escaped).
function attr(v) { return esc(v) }

function siteOf(vars) { return vars.siteUrl || "https://www.nairobi-powerbikes.co.ke" }
/// Logo asset always resolves to the public HTTPS origin. Local/dev site URLs
/// (localhost, 127.0.0.1, etc.) are never embedded into delivered mail.
function logoUrl(vars, width) {
  const site = String(siteOf(vars) || "").replace(/\/+$/, "")
  const isLocal = /^(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?(?:\/|$)/i.test(site)
  const origin = isLocal ? "https://www.nairobi-powerbikes.co.ke" : site
  return origin + "/NPB%20Logo.png"
}

// ---------------------------------------------------------------------------
// Layout shell
// ---------------------------------------------------------------------------
// Structure: canvas → centered 600px container → logo / content / footer.
// Content padding is 48px (24px on mobile) so body lines stay short.

function layout(t, inner, vars, opts) {
  const o = opts || {}
  const preview = esc(o.previewText || vars.previewText || "")
  const year = vars.currentYear || String(new Date().getFullYear())
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="${o.mode === "dark" ? "dark" : "light"}" />
  <meta name="supported-color-schemes" content="${o.mode === "dark" ? "dark" : "light"}" />
  <title>${esc(o.subject || vars.siteName || "Nairobi Powerbikes")}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  ${st.headStyle(o.mode)}
</head>
<body style="margin:0;padding:0;word-spacing:normal;background-color:${t.canvas};">
  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:${t.canvas};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preview}&#847;&zwnj;&#160;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${t.canvas}" style="background-color:${t.canvas};">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" class="npb-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin:0 auto;background-color:${t.container};">
          ${header(t, vars, o)}
          ${inner}
          ${footer(t, vars, o)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Header — small centered logo, generous breathing room. No red bars, no nav.
// ---------------------------------------------------------------------------

function header(t, vars, o) {
  const logo = `<a href="${attr(siteOf(vars))}" target="_blank" style="text-decoration:none;">
    <img src="${attr(logoUrl(vars))}" alt="Nairobi Powerbikes" width="176" height="75" class="npb-img" style="display:block;width:176px;max-width:176px;height:auto;border:0;outline:none;text-decoration:none;" />
  </a>`
  return `<tr>
    <td align="center" class="npb-head" style="padding:44px 24px 36px;">
      ${logo}
    </td>
  </tr>`
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/// Small tracked category label (red) — the "WHY AM I RECEIVING THIS" line.
function category(t, text, opts) {
  const o = opts || {}
  const color = o.color || t.red
  const align = o.align || "left"
  return `<p style="margin:0 0 14px;font-family:${st.FONT_LABEL};font-size:11px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${color};text-align:${align};">${esc(text)}</p>`
}

/// Headline — controlled size, bold, sentence case, unbreakable wrap control.
function heading(t, text, opts) {
  const o = opts || {}
  const size = o.size || 28
  const align = o.align || "left"
  const color = o.color || t.ink
  return `<h1 style="margin:0 0 ${o.mb !== undefined ? o.mb : 14}px;font-family:${st.FONT_BODY};font-size:${size}px;font-weight:800;line-height:1.28;letter-spacing:-0.01em;color:${color};text-align:${align};word-break:break-word;overflow-wrap:break-word;">${esc(text)}</h1>`
}

/// Muted heading — secondary headline (e.g. product name or secondary story).
function subheading(t, text, opts) {
  const o = opts || {}
  return `<h2 style="margin:0 0 ${o.mb !== undefined ? o.mb : 10}px;font-family:${st.FONT_BODY};font-size:${o.size || 19}px;font-weight:800;line-height:1.3;letter-spacing:-0.01em;color:${o.color || t.ink};word-break:break-word;overflow-wrap:break-word;">${esc(text)}</h2>`
}

/// Body copy — short lines, comfortable leading, muted ink.
function paragraph(t, text, opts) {
  const o = opts || {}
  const color = o.muted ? t.inkMuted : t.inkSoft
  return `<p style="margin:0 0 ${o.mb !== undefined ? o.mb : 16}px;font-family:${st.FONT_BODY};font-size:${o.size || 15}px;line-height:${o.lh || 1.7};color:${color};text-align:${o.align || "left"};word-break:break-word;overflow-wrap:break-word;">${esc(text)}</p>`
}

/// Spacer (block) + hairline divider.
function spacer(t, h) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-size:0;line-height:0;height:${h || 24}px;">&nbsp;</td></tr></table>`
}

function divider(t, opts) {
  const o = opts || {}
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${o.mt !== undefined ? o.mt : 28}px 0 ${o.mb !== undefined ? o.mb : 28}px;">
    <tr><td style="border-top:1px solid ${o.color || t.line};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>
  </table>`
}

/// Short grouped copy paragraph aligned center (for hero-ish intros).
function lead(t, text, opts) {
  const o = opts || {}
  return `<p style="margin:0 auto ${o.mb !== undefined ? o.mb : 18}px;font-family:${st.FONT_BODY};font-size:17px;line-height:1.65;color:${o.color || t.inkSoft};text-align:left;">${esc(text)}</p>`
}

// ---------------------------------------------------------------------------
// Buttons — ONE primary CTA, controlled width on desktop, full width mobile.
// ---------------------------------------------------------------------------

function button(t, text, url, opts) {
  const o = opts || {}
  const href = attr(url || "")
  if (!href) return ""
  const variant = o.variant || "primary"
  const bg = variant === "secondary" ? t.container : t.bgAction
  const fg = variant === "secondary" ? t.ink : t.fgAction
  const stroke = variant === "secondary" ? t.inkMuted : t.bgAction
  const font = `${st.FONT_LABEL};font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase`
  const vml = variant === "secondary"
    ? `<v:roundrect href="${href}" style="height:46px;v-text-anchor:middle;width:200px;" arcsize="20%" fillcolor="${t.container}" strokecolor="${stroke}" strokeweight="1pt"><w:anchorlock/><center style="color:${fg};${font};">${esc(text)}</center></v:roundrect>`
    : `<v:roundrect href="${href}" style="height:46px;v-text-anchor:middle;width:200px;" arcsize="20%" fillcolor="${bg}" strokecolor="${bg}" stroke="f"><w:anchorlock/><center style="color:${fg};${font};">${esc(text)}</center></v:roundrect>`
  return `<table role="presentation" class="npb-btn-wrap" cellpadding="0" cellspacing="0" border="0" style="margin:${o.mt !== undefined ? o.mt : 26}px 0 0;">
    <tr>
      <td align="${o.align || "center"}" style="border-radius:10px;mso-padding-alt:2px;">
        <!--[if mso]>${vml}<![endif]-->
        <!--[if !mso]><!--><a href="${href}" class="npb-btn" style="display:inline-block;background-color:${bg};border:${variant === "secondary" ? "1px solid " + stroke : "1px solid " + bg};color:${fg};padding:14px 34px;border-radius:10px;${font};text-decoration:none;box-sizing:border-box;white-space:nowrap;">${esc(text)}</a><!--<![endif]-->
      </td>
    </tr>
  </table>`
}

/// Small text link (secondary actions, e.g. "View all articles").
function link(t, text, url, opts) {
  const o = opts || {}
  const href = attr(url || "")
  if (!href) return ""
  return `<p style="margin:${o.mt !== undefined ? o.mt : 18}px 0 0;font-family:${st.FONT_LABEL};font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;text-align:${o.align || "center"};"><a href="${href}" target="_blank" style="color:${o.color || t.ink};text-decoration:underline;text-decoration-color:${t.line};">${esc(text)}</a></p>`
}

// ---------------------------------------------------------------------------
// Imagery
// ---------------------------------------------------------------------------

/// Editorial hero/visual — full content width, rounded subtly, responsive.
/// Renders nothing when no image is available (keeps emails clean).
function imageHero(t, image, opts) {
  const o = opts || {}
  const src = attr(image || "")
  if (!src) return ""
  const alt = o.alt || ""
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 ${o.mb !== undefined ? o.mb : 30}px;">
    <tr>
      <td style="padding:0;border-radius:14px;overflow:hidden;background-color:${o.bg || t.surfaceAlt};">
        <img src="${src}" alt="${esc(alt)}" width="100%" class="npb-img" style="display:block;width:100%;height:auto;max-height:${o.maxHeight || 320}px;object-fit:cover;border:0;border-radius:0;outline:none;text-decoration:none;" />
      </td>
    </tr>
  </table>`
}

// ---------------------------------------------------------------------------
// Product block — editorial bike presentation (image, name, price, CTA).
// No card, no border — the image and type hierarchy carry the design.
// ---------------------------------------------------------------------------

function product(t, vars, opts) {
  const o = opts || {}
  const name = esc(vars.motorcycleName || o.name || "")
  const brand = esc(vars.motorcycleBrand || o.brand || "")
  const price = esc(vars.motorcyclePrice || o.price || "")
  const oldPrice = esc(vars.motorcycleOldPrice || o.oldPrice || "")
  const image = vars.motorcycleImage || o.image || ""
  const url = (vars.motorcycleUrl || o.url || siteOf(vars)).trim()
  const meta = esc(o.meta || [vars.motorcycleYear, vars.motorcycleCc ? vars.motorcycleCc + "cc" : ""].filter(Boolean).join(" · "))
  const stock = esc(vars.stockStatus || o.stock || "")
  const stockKind = stock ? (/out of stock/i.test(stock) ? "danger" : /few|low/i.test(stock) ? "warning" : "success") : ""
  const stockColor = stockKind === "danger" ? t.danger : stockKind === "warning" ? t.warning : t.success
  const nameRow = name ? `<p style="margin:0 0 3px;font-family:${st.FONT_BODY};font-size:${o.nameSize || 19}px;font-weight:800;line-height:1.3;color:${t.ink};word-break:break-word;overflow-wrap:break-word;">${name}</p>` : ""
  const brandRow = brand ? `<p style="margin:0 0 3px;font-family:${st.FONT_LABEL};font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:${t.inkMuted};">${brand}</p>` : ""
  const metaRow = (meta || stock) ? `<p style="margin:0 0 2px;font-family:${st.FONT_BODY};font-size:13.5px;color:${t.inkMuted};word-break:break-word;overflow-wrap:break-word;">${meta}${meta && stock ? " · " : ""}${stock ? `<span style="color:${stockColor};">${stock}</span>` : ""}</p>` : ""
  const priceRow = price ? `<p style="margin:8px 0 0;font-family:${st.FONT_BODY};font-size:17px;font-weight:800;color:${t.red};">${price}${oldPrice ? ` <span style="font-weight:600;color:${t.faint};text-decoration:line-through;">${oldPrice}</span>` : ""}</p>` : ""
  const cta = (o.cta && url) ? button(t, o.cta, url, { align: "left", mt: 22, variant: o.ctaVariant }) : ""
  const row = (image ? imageHero(t, image, { alt: name || "Nairobi Powerbikes motorcycle", mb: 22 }) : "") + `${brandRow}${nameRow}${metaRow}${priceRow}${cta}`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 ${o.mb !== undefined ? o.mb : 10}px;"><tr><td style="padding:0;">${row}</td></tr></table>`
}

// ---------------------------------------------------------------------------
// Details — structured information with hairline rows. No dashboard card.
// Missing values are skipped entirely so emails stay clean.
// ---------------------------------------------------------------------------

function details(t, title, rows, opts) {
  const o = opts || {}
  const heading = o.title || o.label || ""
  const present = (rows || []).filter((r) => r && r.value)
  if (present.length === 0 && !heading && !o.keepTitle) return ""
  let body = ""
  for (const r of present) {
    body += `<tr>
      <td width="38%" style="padding:13px 18px;border-top:1px solid ${t.lineSoft};font-family:${st.FONT_LABEL};font-size:10.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${t.inkMuted};vertical-align:top;">${esc(r.label || "")}</td>
      <td width="62%" style="padding:13px 18px;border-top:1px solid ${t.lineSoft};font-family:${st.FONT_BODY};font-size:14.5px;font-weight:600;color:${r.color || t.ink};text-align:right;vertical-align:top;word-break:break-word;overflow-wrap:break-word;">${esc(r.value)}</td>
    </tr>`
  }
  const titleRow = heading ? `<tr><td style="padding:18px 18px 6px;"><p style="margin:0;font-family:${st.FONT_LABEL};font-size:10.5px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${t.red};">${esc(heading)}</p></td></tr>` : ""
  const emptyRow = (!body && o.emptyText) ? `<tr><td style="padding:16px 18px;font-size:14px;color:${t.inkMuted};">${esc(o.emptyText)}</td></tr>` : ""
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${o.mt !== undefined ? o.mt : 26}px 0 4px;">
    <tr>
      <td style="border:1px solid ${t.lineSoft};border-radius:14px;background-color:${t.surface};padding:0;overflow:hidden;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${titleRow}
          ${body}
          ${emptyRow}
        </table>
      </td>
    </tr>
  </table>`
}

// ---------------------------------------------------------------------------
// OTP — clean code treatment, the visual focus of the email.
// ---------------------------------------------------------------------------

function otp(t, code, opts) {
  const o = opts || {}
  const digits = String(code || "").replace(/[^0-9]/g, "")
  const d = digits.length ? digits : "000000"
  return `<table role="presentation" class="npb-otp" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px 0 24px;">
    <tr>
      <td align="center" bgcolor="${t.codeBg}" style="background-color:${t.codeBg};border:1px solid ${t.codeLine};border-radius:14px;padding:20px 18px;">
        <span style="font-family:${st.FONT_MONO};font-size:30px;font-weight:700;letter-spacing:0.35em;padding-left:0.35em;color:${t.ink};">${esc(d)}</span>
      </td>
    </tr>
  </table>`
}

// ---------------------------------------------------------------------------
// Alerts + status lines (security/notice boxes, service statuses)
// ---------------------------------------------------------------------------

function alertBox(t, text, opts) {
  const o = opts || {}
  const kind = o.kind || "neutral"
  const accent = kind === "danger" ? t.danger : kind === "warning" ? t.warning : kind === "success" ? t.success : kind === "info" ? t.info : t.inkMuted
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${o.mt !== undefined ? o.mt : 24}px 0 4px;">
    <tr>
      <td style="border:1px solid ${t.lineSoft};border-left:3px solid ${accent};border-radius:12px;background-color:${t.surface};padding:16px 18px;">
        <p style="margin:0;font-family:${st.FONT_BODY};font-size:13.5px;line-height:1.65;color:${o.color || t.inkSoft};">${esc(text)}</p>
      </td>
    </tr>
  </table>`
}

/// Inline status line e.g. "✓ CONFIRMED" — a quiet signal, not a badge.
function statusLine(t, kind, text, opts) {
  const o = opts || {}
  const colors = { success: t.success, warning: t.warning, danger: t.danger, info: t.info, neutral: t.inkMuted }
  const c = colors[kind] || colors.neutral
  const mark = kind === "success" ? "&#10003;" : kind === "danger" ? "&#10005;" : kind === "warning" ? "&#33;" : "&#8212;"
  return `<p style="margin:0 0 ${o.mb !== undefined ? o.mb : 16}px;font-family:${st.FONT_LABEL};font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:${c};">${mark}&nbsp; ${esc(text)}</p>`
}

/// Editorial pull quote (chat replies, review asks).
function quote(t, text, opts) {
  const o = opts || {}
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${o.mt !== undefined ? o.mt : 24}px 0 4px;">
    <tr>
      <td style="border-left:3px solid ${t.red};padding:6px 18px 8px;">
        <p style="margin:0;font-family:${st.FONT_BODY};font-size:16px;font-style:italic;line-height:1.7;color:${t.ink};">${esc(text)}</p>
      </td>
    </tr>
  </table>`
}

// ---------------------------------------------------------------------------
// Link row (onboarding steps, related articles)
// ---------------------------------------------------------------------------

function linkRow(t, opts) {
  const o = opts || {}
  const title = o.title || ""
  const meta = o.meta || ""
  const url = o.url || ""
  if (!url || !title) return ""
  return `<tr>
    <td style="padding:0 0 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:middle;">
            <a href="${attr(url)}" target="_blank" style="text-decoration:none;">
              <p style="margin:0 0 3px;font-family:${st.FONT_BODY};font-size:15px;font-weight:800;line-height:1.35;color:${t.ink};word-break:break-word;overflow-wrap:break-word;">${esc(title)}</p>
            </a>
            ${meta ? `<p style="margin:0;font-family:${st.FONT_LABEL};font-size:10.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${t.inkMuted};">${esc(meta)}</p>` : ""}
          </td>
          <td width="48" align="right" style="vertical-align:middle;">
            <a href="${attr(url)}" target="_blank" style="font-size:20px;color:${t.inkMuted};text-decoration:none;">&#8250;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ---------------------------------------------------------------------------
// Footer — small, clean, centered. Marketing emails get unsubscribe block.
// ---------------------------------------------------------------------------

function footer(t, vars, o) {
  const site = siteOf(vars)
  const year = vars.currentYear || String(new Date().getFullYear())
  const marketing = o.marketing === true
  const unsub = vars.unsubscribeUrl || (vars.unsubLink || "")
  const prefs = vars.preferencesUrl || (vars.prefsLink || "")
  const links = [
    `<a href="${attr(site + "/privacy")}" target="_blank" style="color:${t.inkMuted};text-decoration:none;">Privacy Policy</a>`,
    `<a href="${attr(site + "/terms")}" target="_blank" style="color:${t.inkMuted};text-decoration:none;">Terms of Service</a>`,
    `<a href="${attr(site + "/contact")}" target="_blank" style="color:${t.inkMuted};text-decoration:none;">Contact Us</a>`,
  ]
  const pill = (label, url, solid) => solid
    ? `<td style="padding:7px 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" bgcolor="${t.bgAction}" style="background-color:${t.bgAction};border-radius:10px;mso-padding-alt:2px;"><a href="${attr(url)}" target="_blank" class="npb-btn" style="display:inline-block;padding:12px 22px;font-family:${st.FONT_LABEL};font-size:10.5px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${t.fgAction};text-decoration:none;">${esc(label)}</a></td></tr></table></td>`
    : `<td style="padding:7px 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="border:1px solid ${t.line};border-radius:10px;mso-padding-alt:2px;"><a href="${attr(url)}" target="_blank" class="npb-btn" style="display:inline-block;padding:12px 22px;font-family:${st.FONT_LABEL};font-size:10.5px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${t.ink};text-decoration:none;">${esc(label)}</a></td></tr></table></td>`
  const marketingBlock = marketing ? (prefs || unsub ? `<tr><td align="center" style="padding:24px 0 2px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" class="npb-stack" style="width:100%;max-width:340px;">
      <tr>
        <td style="padding:0 3px 0 0;width:50%;">${prefs ? pill("Manage Preferences", prefs, false) : ""}</td>
        <td style="padding:0 0 0 3px;width:50%;">${unsub ? pill("Unsubscribe", unsub, true) : ""}</td>
      </tr>
    </table>
  </td></tr>
  <tr><td align="center" style="padding:14px 0 0;font-family:${st.FONT_BODY};font-size:11px;line-height:1.6;color:${t.inkMuted};">You're receiving this because you're subscribed to Nairobi Powerbikes updates.</td></tr>` : "") : ""
  return `<tr>
    <td align="center" class="npb-foot" style="border-top:1px solid ${t.line};padding:36px 48px 40px;">
      <img src="${attr(logoUrl(vars))}" alt="Nairobi Powerbikes" width="132" height="56" class="npb-img" style="display:inline-block;width:132px;max-width:132px;height:auto;border:0;outline:none;" />
      <p style="margin:16px 0 4px;font-family:${st.FONT_LABEL};font-size:12px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${t.ink};">Nairobi Powerbikes</p>
      <p style="margin:0 0 4px;font-family:${st.FONT_BODY};font-size:13px;color:${t.inkMuted};">Premium motorcycles. Built for riders.</p>
      <p style="margin:0 0 16px;font-family:${st.FONT_BODY};font-size:13px;color:${t.inkMuted};">Nairobi, Kenya</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
        <tr><td align="center" style="font-family:${st.FONT_BODY};font-size:12px;color:${t.inkMuted};">${links.join('<span style="color:' + t.faint + ';">&nbsp;·&nbsp;</span>')}</td></tr>
      </table>
      ${marketingBlock}
      <p style="margin:22px 0 0;font-family:${st.FONT_BODY};font-size:10.5px;letter-spacing:0.06em;color:${t.faint};">&copy; ${year} Nairobi Powerbikes. All rights reserved.</p>
    </td>
  </tr>`
}

/// Content area wrapper (standard editorial column).
function content(t, inner, opts) {
  const o = opts || {}
  return `<tr>
    <td class="npb-pad" style="padding:0 48px 8px;font-family:${st.FONT_BODY};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0;">${inner}</td></tr></table>
    </td>
  </tr>`
}

/// Standard help line — points at the public contact page (origin-guarded).
function contactLine(t, vars, opts) {
  const o = opts || {}
  return paragraph(t, "Questions? Reply to this email, or visit " + siteOf(vars) + "/contact" + ".", { muted: true, size: o.size || 12, mb: o.mb !== undefined ? o.mb : 0 })
}

// ---------------------------------------------------------------------------
// Legacy aliases (kept so all callers keep working — restyled internally)
// ---------------------------------------------------------------------------

const eyebrow = category
const infoCard = details
const statusPill = statusLine
const accentBar = divider
const productCard = product
const securityBox = alertBox
const listRow = linkRow
const otpBox = otp
const hero = (t, vars, opts) => imageHero(t, (opts && opts.image) || (vars && vars.image) || (vars && vars.motorcycleImage) || "", Object.assign({}, opts || {}, { alt: (opts && opts.imageAlt) || (opts && opts.splashAlt) || ((opts && opts.title) || "") }))

module.exports = {
  esc, attr, siteOf, logoUrl,
  layout, header, footer, content,
  category, eyebrow, heading, subheading, lead, paragraph, spacer, divider, accentBar,
  button, link, details, infoCard, statusLine, statusPill, otp, otpBox, product, productCard,
  imageHero, hero, alertBox, securityBox, quote, linkRow, listRow, contactLine,
}