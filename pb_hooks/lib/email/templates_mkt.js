/// Nairobi PowerBikes email templates — marketing & editorial (LIGHT mode).
/// Inventory/restock, wishlist, chat, blog newsletters, campaigns and
/// announcements. Templates flagged `marketing: true` automatically get the
/// branded unsubscribe / preferences footer (see components.footer).
///
/// The blog email is a real editorial newsletter: category → headline →
/// hero image → title + excerpt → CTA → "more from the garage" → all articles.

const components = require(__hooks + "/lib/email/components.js")

const LIST = {}

function d(key, meta, render) { LIST[key] = { meta, render } }

const contactLine = (t, vars) => components.contactLine(t, vars)

const bikeMeta = (vars) => ((vars.motorcycleYear || "") + (vars.motorcycleCc ? " · " + vars.motorcycleCc + "cc" : ""))

// ---------------------------------------------------------------------------
// INVENTORY / RESTOCK
// ---------------------------------------------------------------------------

d("restock", { category: "inventory", name: "Back In Stock (Restock)", marketing: true, mode: "light" }, (t, vars) => ({
  subject: "Good news — " + (vars.motorcycleName || "your bike") + " is back in stock",
  previewText: "The bike you were waiting for is back.",
  html:
    components.category(t, "Back In The Garage") +
    components.heading(t, "Your bike is back in stock") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", the " + (vars.motorcycleName || "motorcycle") + " you asked us to watch is available again.") +
    components.product(t, vars, { cta: "View Motorcycle", meta: bikeMeta(vars) }) +
    components.paragraph(t, "Good bikes don't wait around — swing by or reserve it online before it's gone again.", { muted: true }) +
    contactLine(t, vars),
}))

d("wishlist_restock", { category: "inventory", name: "Wishlist Bike Back In Stock", marketing: true, mode: "light" }, (t, vars) => ({
  subject: "Your wishlist bike is back in stock — " + (vars.motorcycleName || "motorcycle"),
  previewText: "Your wishlist just got an update.",
  html:
    components.category(t, "Wishlist Update") +
    components.heading(t, "Your wishlist is back in stock") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", the " + (vars.motorcycleName || "motorcycle") + " from your wishlist is back. Don't sit on it too long — good bikes move fast.") +
    components.product(t, vars, { cta: "View Motorcycle", meta: bikeMeta(vars) }) +
    components.paragraph(t, "You can manage your wishlist and the emails we send about it from your dashboard.", { muted: true }) +
    contactLine(t, vars),
}))

d("wishlist_price_change", { category: "inventory", name: "Wishlist Price Change", marketing: true, mode: "light" }, (t, vars) => ({
  subject: "Price update on your wishlist bike — " + (vars.motorcycleName || "motorcycle"),
  previewText: "The price on one of your wishlist bikes just changed.",
  html:
    components.category(t, "Wishlist Update") +
    components.heading(t, "Price update on your wishlist") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", the price of the " + (vars.motorcycleName || "motorcycle") + " on your wishlist has changed.") +
    components.product(t, vars, { cta: "View Motorcycle", meta: bikeMeta(vars) }) +
    components.paragraph(t, "You can manage your wishlist and the emails we send about it from your dashboard.", { muted: true }) +
    contactLine(t, vars),
}))

d("wishlist_low_stock", { category: "inventory", name: "Wishlist Low Stock", marketing: true, mode: "light" }, (t, vars) => ({
  subject: "Only a few left — " + (vars.motorcycleName || "motorcycle"),
  previewText: "Your wishlist bike is selling fast.",
  html:
    components.category(t, "Wishlist Update") +
    components.heading(t, "It's selling fast") +
    components.statusLine(t, "warning", "Low Stock") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", the " + (vars.motorcycleName || "motorcycle") + " on your wishlist is almost gone. If it's the one, don't wait.") +
    components.product(t, vars, { cta: "View Motorcycle", meta: bikeMeta(vars) }) +
    components.paragraph(t, "You can manage your wishlist and the emails we send about it from your dashboard.", { muted: true }) +
    contactLine(t, vars),
}))

// ---------------------------------------------------------------------------
// CHAT
// ---------------------------------------------------------------------------

d("chat_reply", { category: "chat", name: "Support Replied (Chat)", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "You have a new message from Nairobi PowerBikes",
  previewText: "Your support conversation just got a reply.",
  html:
    components.category(t, "Support") +
    components.heading(t, "You have a new message") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", " + (vars.supportAgentName || "a member of our team") + " from Nairobi Powerbikes replied to your conversation.") +
    (vars.messagePreview ? components.quote(t, vars.messagePreview) : "") +
    components.button(t, "Continue Chat", vars.chatUrl || vars.siteUrl + "/", { mt: 24 }) +
    components.paragraph(t, "We don't include full conversations in email for your privacy — open the chat to see everything.", { muted: true }) +
    contactLine(t, vars),
}))

d("chat_resolved", { category: "chat", name: "Chat Resolved", marketing: false, mode: "light" }, (t, vars) => ({
  subject: "Your conversation is resolved",
  previewText: "Thanks for chatting with us. We're here anytime.",
  html:
    components.category(t, "Support") +
    components.heading(t, "Conversation resolved") +
    components.statusLine(t, "success", "Resolved") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ", your conversation with Nairobi Powerbikes has been marked as resolved.") +
    components.paragraph(t, "Need anything else? Start a new chat or visit us at the branch — we're always happy to help.") +
    components.button(t, "Start New Chat", vars.chatUrl || vars.siteUrl + "/", { variant: "secondary", mt: 24 }) +
    contactLine(t, vars),
}))

// ---------------------------------------------------------------------------
// BLOG — editorial newsletter
// ---------------------------------------------------------------------------

d("new_blog_article", { category: "blog", name: "New Blog Article", marketing: true, mode: "light" }, (t, vars) => {
  const blogUrl = vars.blogUrl || vars.siteUrl + "/blog"
  const more = Array.isArray(vars.moreArticles) ? vars.moreArticles.slice(0, 2) : []
  return {
    subject: "New from the garage: " + (vars.blogTitle || "a fresh read"),
    previewText: "Discover the latest stories, bikes and riding insights.",
    html:
      components.category(t, "From The Powerbikes Garage") +
      components.heading(t, "New from the garage") +
      components.paragraph(t, "A fresh read from Nairobi Powerbikes — stories, guides and news from the crew.") +
      (vars.blogImage ? components.imageHero(t, vars.blogImage, { alt: vars.blogTitle || "Blog article" }) : "") +
      components.category(t, vars.blogCategory || "Riding Culture", { mb: 8 }) +
      `<a href="${components.attr(blogUrl)}" target="_blank" style="text-decoration:none;"><h2 style="margin:0 0 10px;font-family:Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;line-height:1.35;letter-spacing:-0.01em;color:${t.ink};word-break:break-word;overflow-wrap:break-word;">${components.esc(vars.blogTitle || "Read the story")}</h2></a>` +
      (vars.blogReadingTime ? `<p style="margin:0 0 12px;font-size:12px;color:${t.inkMuted};">${components.esc(vars.blogReadingTime)}</p>` : "") +
      (vars.blogExcerpt ? components.paragraph(t, vars.blogExcerpt) : "") +
      components.button(t, "Read Article", blogUrl, { align: "left", mt: 20 }) +
      (more.length ? `${components.divider(t)}
      <p style="margin:0 0 18px;font-family:Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:${t.inkMuted};">More From The Garage</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px;">
        ${more.map((a) => components.linkRow(t, { title: a.title || "Read", meta: a.meta || "", url: a.url || blogUrl })).join("")}
      </table>
      ${components.link(t, "View all articles", vars.siteUrl + "/blog", { align: "left" })}` : "") +
      contactLine(t, vars),
  }
})

d("featured_article", { category: "blog", name: "Featured Story", marketing: true, mode: "light" }, (t, vars) => {
  const blogUrl = vars.blogUrl || vars.siteUrl + "/blog"
  return {
    subject: "Editor's pick: " + (vars.blogTitle || "this week's story"),
    previewText: "The story our crew thinks you should read this week.",
    html:
      components.category(t, "Editor's Pick") +
      components.heading(t, "From the Powerbikes garage") +
      components.paragraph(t, "Hi " + (vars.firstName || "there") + ", our editors picked this story for you this week.") +
      (vars.blogImage ? components.imageHero(t, vars.blogImage, { alt: vars.blogTitle || "Blog article" }) : "") +
      components.category(t, vars.blogCategory || "Riding Culture", { mb: 8 }) +
      `<a href="${components.attr(blogUrl)}" target="_blank" style="text-decoration:none;"><h2 style="margin:0 0 10px;font-family:Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;line-height:1.35;letter-spacing:-0.01em;color:${t.ink};word-break:break-word;overflow-wrap:break-word;">${components.esc(vars.blogTitle || "Read the story")}</h2></a>` +
      (vars.blogReadingTime ? `<p style="margin:0 0 12px;font-size:12px;color:${t.inkMuted};">${components.esc(vars.blogReadingTime)}</p>` : "") +
      (vars.blogExcerpt ? components.paragraph(t, vars.blogExcerpt) : "") +
      components.button(t, "Read Article", blogUrl, { align: "left", mt: 20 }) +
      components.link(t, "All articles", vars.siteUrl + "/blog", { align: "left" }) +
      contactLine(t, vars),
  }
})

// ---------------------------------------------------------------------------
// CAMPAIGN + ANNOUNCEMENT
// ---------------------------------------------------------------------------

d("campaign", { category: "marketing", name: "Marketing Campaign", marketing: true, mode: "light" }, (t, vars) => {
  let body = vars.bodyHtml || ""
  if (!body) {
    body = components.paragraph(t, vars.campaignMessage || "")
  }
  let products = ""
  const items = Array.isArray(vars.products) ? vars.products : []
  for (const p of items.slice(0, 3)) {
    products += components.product(t, Object.assign({}, vars, {
      motorcycleName: p.name || p.motorcycleName,
      motorcycleBrand: p.brand || p.motorcycleBrand,
      motorcyclePrice: p.price || p.motorcyclePrice,
      motorcycleOldPrice: p.oldPrice || p.motorcycleOldPrice,
      motorcycleImage: p.image || p.motorcycleImage,
      motorcycleUrl: p.url || p.motorcycleUrl,
      stockStatus: p.stock || p.stockStatus || "",
    }), { cta: p.cta || "View Motorcycle", meta: bikeMeta(Object.assign({}, vars, p)) })
  }
  return {
    subject: vars.campaignSubject || vars.subject || "Nairobi Powerbikes update",
    previewText: vars.previewText || vars.campaignHeadline || "A special offer from Nairobi Powerbikes",
    html:
      components.category(t, "Nairobi Powerbikes") +
      components.heading(t, vars.campaignHeadline || "Something big is rolling in") +
      body +
      products +
      (vars.campaignCta && vars.campaignUrl ? components.button(t, vars.campaignCta, vars.campaignUrl, { mt: 20 }) : "") +
      contactLine(t, vars),
  }
})

d("announcement", { category: "marketing", name: "Dealer Announcement", marketing: true, mode: "light" }, (t, vars) => ({
  subject: (vars.announcementTitle || "Nairobi Powerbikes announcement"),
  previewText: "A big update from the dealership.",
  html:
    components.category(t, "Dealer Announcement") +
    components.heading(t, vars.announcementTitle || "Announcement") +
    components.paragraph(t, "Hi " + (vars.firstName || "there") + ",") +
    components.paragraph(t, vars.announcementMessage || "") +
    (vars.announcementUrl ? components.button(t, vars.announcementCta || "Learn More", vars.announcementUrl) : "") +
    components.paragraph(t, "— The Nairobi Powerbikes Team", { muted: true }) +
    contactLine(t, vars),
}))

module.exports = { LIST }