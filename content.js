/* =====================================================
   NORGATES — EDIT YOUR CONTENT HERE
   Change the text between the quotes. To add an item,
   copy a line (including the comma) and edit it.
   Images: put the file in /images and write its path.
   Leave image as "" to show a placeholder box.
   ===================================================== */

const SITE = {

  // Where the "Apply" buttons go (opens in a new tab)
  applyLink: "https://norgates.com/signup",
  loginLink: "https://next.norgates.com",

  // Artist cards under the hero
  artists: [
    { name: "akselbolt", image: "images/artists/akselbolt.jpg" },
    { name: "lungskull", image: "images/artists/lungskull.png" },
    { name: "pupsies",   image: "images/artists/pupsies.jpg" },
    { name: "korpsebunny",  image: "images/artists/korpsebunny.webp" },
    { name: "backrooms",   image: "images/artists/backrooms.jpg" },
    { name: "yom",  image: "images/artists/yom.jpg" },
  ],

  // Scrolling platform logos (white logos on transparent look best)
  platforms: [
    { name: "Spotify",       image: "images/platforms/spotify.png" },
    { name: "Apple Music",   image: "images/platforms/apple_music.png" },
    { name: "YouTube Music", image: "images/platforms/youtube.png" },
    { name: "Deezer",        image: "images/platforms/deezer.png" },
    { name: "Amazon Music",  image: "images/platforms/amazon_music.png" },
    { name: "Pandora",       image: "images/platforms/pandora.png" },
    { name: "SiriusXM",      image: "images/platforms/siriusxm.png" },
    { name: "TIDAL",         image: "images/platforms/tidal.png" },
  ],

  // Image on the left of "Your music, in one place" (any size/shape fits)
  dashboardImage: "",

  // Video block under the side scroller.
  // videoImage = poster frame ("" shows a placeholder box); videoLink = where the play button goes.
  videoImage: "",
  videoLink: "",

  // "Why Norgates" side-scroller steps (image shows on the left; any size/shape fits)
  features: [
    { title: "Keep your masters", text: "You own your music, and your publishing. Always.", image: "https://www.datocms-assets.com/116987/1767882143-centralized-management.png?auto=format" },
    { title: "See your numbers", text: "See the data behind your catalog, across every platform.", image: "images/analytics.svg" },
    { title: "Worldwide distribution", text: "Every major DSP and UGC platform.", image: "https://www.datocms-assets.com/116987/1727700521-global-market.png?auto=format" },
    { title: "Transparent royalties", text: "Track earnings by release, store and country.", image: "https://www.datocms-assets.com/116987/1727354811-statement-approval.png?auto=format" },
    { title: "Fast payouts", text: "Partnered with Tipalti.", image: "https://www.datocms-assets.com/116987/1777282788-payment-gateways.png?auto=format" },
  ],

  // Footer "Company" links
  footerLinks: [
    { text: "Careers",            link: "#" },
    { text: "Terms & Conditions", link: "#" },
    { text: "Privacy Policy",     link: "#" },
    { text: "Content Policy",     link: "#" },
    { text: "DMCA",               link: "mailto:legal@norgates.com" },
  ],

  // Footer social buttons (leave link as "" to hide one)
  socials: {
    instagram: "https://instagram.com/norgatesrecords",
    email:     "mailto:hello@norgates.com",
    discord:   "https://discord.gg/norgates",
  },
};