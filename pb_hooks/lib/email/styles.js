/// Nairobi PowerBikes email design tokens — editorial email system.
///
/// Two intentional modes, both email-safe:
///
///  LIGHT (default for marketing + transactional confirmations)
///    Subtle off-white canvas, white container, ink typography, hairline
///    dividers, brand-red CTAs. Whitespace does the heavy lifting — no giant
///    cards, no dashboard surfaces. Apple/Headspace-style editorial email.
///
///  DARK (reserved for the security/authentication family)
///    Near-black canvas, charcoal container, white typography, red CTAs.
///
/// Brand: Nairobi Powerbikes. Red is the only accent (controls + prices).
/// Surface language: flat, no shadows, 1px hairlines at #E8E8E5 (light) and
/// #262626 (dark), 12-16px radii only on imagery and the OTP treatment.
///
/// Type: Inter with an email-safe system fallback stack; sentence case body,
/// small tracked uppercase category labels, controlled headline sizes.

const FONT_BODY = "'Inter',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const FONT_LABEL = "'Inter',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const FONT_MONO = "'SF Mono','Menlo',Consolas,'Courier New',monospace"

/// Light — the default premium editorial mode.
const LIGHT = {
  red: "#D6001C",
  redDark: "#A30016",
  redSoft: "#FBEDEE",
  canvas: "#F4F4F2",
  container: "#FFFFFF",
  ink: "#191919",
  inkSoft: "#424242",
  inkMuted: "#7A7A7A",
  faint: "#9E9E9E",
  line: "#E8E8E5",
  lineSoft: "#F0F0EE",
  surface: "#Fafaf8",
  surfaceAlt: "#F6F6F4",
  white: "#FFFFFF",
  success: "#1E7B4C",
  warning: "#A65A00",
  danger: "#B3261E",
  info: "#1F6FB2",
  bgAction: "#D6001C",
  fgAction: "#FFFFFF",
  codeBg: "#F6F6F4",
  codeLine: "#E4E4E0",
}

/// Dark — the security/authentication family.
const DARK = {
  red: "#FF3B4E",
  redDark: "#C41124",
  redSoft: "#2A1216",
  canvas: "#0A0A0A",
  container: "#131313",
  ink: "#F5F5F2",
  inkSoft: "#C9C9C4",
  inkMuted: "#8F8F8A",
  faint: "#6E6E6A",
  line: "#262626",
  lineSoft: "#1E1E1E",
  surface: "#181818",
  surfaceAlt: "#171717",
  white: "#FFFFFF",
  success: "#4CC38A",
  warning: "#E8A23D",
  danger: "#FF6F61",
  info: "#5B9BD5",
  bgAction: "#D6001C",
  fgAction: "#FFFFFF",
  codeBg: "#1B1B1B",
  codeLine: "#2E2E2E",
}

function palette(mode) {
  return mode === "dark" ? DARK : LIGHT
}

/// Shared <style> block: color-scheme metadata + mobile media queries.
/// Kept conservative — the layout survives with inline styles alone.
function headStyle(mode) {
  const dark = mode === "dark"
  const scheme = dark ? "dark" : "light"
  return `<style>
  :root { color-scheme: ${scheme}; }
  @media (prefers-color-scheme: ${scheme}) { :root { color-scheme: ${scheme}; } }
  .npb-container { width: 100% !important; max-width: 600px !important; }
  .npb-btn-wrap { width: 100% !important; }
  .npb-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
  .npb-img { width: 100% !important; height: auto !important; }
  .npb-otp td table td { font-size: 26px !important; letter-spacing: 0.32em !important; padding: 14px 4px 14px 20px !important; }
  @media only screen and (max-width: 620px) {
    .npb-container { width: 100% !important; }
    .npb-pad { padding-left: 24px !important; padding-right: 24px !important; }
    .npb-head { padding-top: 28px !important; padding-bottom: 24px !important; }
    .npb-foot { padding: 28px 24px 32px !important; }
    .npb-img { width: 100% !important; height: auto !important; }
    .npb-btn-wrap { width: 100% !important; }
    .npb-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    .npb-stack { display: block !important; width: 100% !important; }
    .npb-center-mobile { text-align: center !important; }
  }
</style>`
}

module.exports = { LIGHT, DARK, palette, FONT_BODY, FONT_LABEL, FONT_MONO, headStyle }