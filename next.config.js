module.exports = {
  reactStrictMode: true,
  "trailingSlash": false,

  "headers": [
     {
       "source": "/*.(jpg|jpeg|gif|png|webp|svg)",
       "headers" : [
          {
              "key" : "Cache-Control",
              "value" : "s-max-age=31536000"
          },
          {
              "key" : "TEST",
              "value" : "ASDF"
          }
       ]
    },
    {
      "source": "/_next/image*",
      "headers" : [
          {
             "key" : "Cache-Control",
             "value" : "s-max-age=31536000"
          },
          {
             "key" : "TEST",
             "value" : "ASDF"
          }
      ]
    }
  ],

  images: {
    domains: ['www.favorfavor.com','www.nicepricefavors.com','localhost','cart.favorfavor.com'],
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'], // see https://calibreapp.com/blog/nextjs-performance
  },

  async rewrites() {
    return [
      {
        source: '/page/FF/CTGY/:ctgyCode',
        destination: '/ctgy/:ctgyCode',
      },
      {
        source: '/page/FF/PROD/:prodCode',
        destination: '/prod/:prodCode',
      },
      { source: '/aboutus.html', destination: '/static/AboutUs', },
      { source: '/contact_us.php', destination: '/static/ContactUs', },
      { source: '/order-favor-samples.php', destination: '/static/Samples', },
      { source: '/terms_etc.php', destination: '/static/Terms', },
      { source: '/o-status.htm', destination: '/static/OrderStatus', },
      { source: '/wedding-planning.html', destination: '/static/WeddingPlanning', },
      { source: '/wedding-planning-bridal.html', destination: '/static/WeddingPlanning/1', },
      { source: '/bridal-party-checklist.php', destination: '/static/WeddingPlanning/2', },
      { source: '/managing-bridesmaids.php', destination: '/static/WeddingPlanning/3', },
      { source: '/wedding-dress.php', destination: '/static/WeddingPlanning/4', },
      { source: '/wedding-veil.php', destination: '/static/WeddingPlanning/5', },
      { source: '/kiss-the-bride.php', destination: '/static/WeddingPlanning/6', },
      { source: '/wedding-toasts.php', destination: '/static/WeddingPlanning/7', },
      { source: '/wedding-cakes.php', destination: '/static/WeddingPlanning/8', },
      { source: '/first-wedding-dance.php', destination: '/static/WeddingPlanning/9', },
      { source: '/tossing-bouquet.php', destination: '/static/WeddingPlanning/10', },
      { source: '/wedding-programs.php', destination: '/static/WeddingPlanning/11', },
      { source: '/tiny-treasure-favors.php', destination: '/static/WeddingPlanning/12', },
      { source: '/vintage-weddings.php', destination: '/static/WeddingPlanning/13', },
      { source: '/wedding-planning-ceremony.html', destination: '/static/WeddingPlanning/14', },
      { source: '/african-american-weddings.php', destination: '/static/WeddingPlanning/15', },
      { source: '/jewish-weddings.php', destination: '/static/WeddingPlanning/16', },
      { source: '/wedding-rice.php', destination: '/static/WeddingPlanning/17', },
      { source: '/children-at-wedding.php', destination: '/static/WeddingPlanning/18', },
      { source: '/wedding-gifts.html', destination: '/static/WeddingPlanning/19', },
      { source: '/wedding-planning-family-friends.html', destination: '/static/WeddingPlanning/20', },
      { source: '/wedding-children.php', destination: '/static/WeddingPlanning/21', },
      { source: '/wedding-seating-charts.php', destination: '/static/WeddingPlanning/22', },
      { source: '/eloping.php', destination: '/static/WeddingPlanning/23', },
      { source: '/wedding-seating-charts-explained.php', destination: '/static/WeddingPlanning/24', },
      { source: '/wedding-receptions-tents.php', destination: '/static/WeddingPlanning/25', },
      { source: '/cheap-chic-favors.php', destination: '/static/WeddingPlanning/26', },
      { source: '/discount-wedding-favors.php', destination: '/static/WeddingPlanning/27', },
      { source: '/make-wedding-favors.html', destination: '/static/WeddingPlanning/28', },
      { source: '/wedding-dress-sample-sales.php', destination: '/static/WeddingPlanning/29', },
      { source: '/wedding-planning-savings-tips.html', destination: '/static/WeddingPlanning/30', },
      { source: '/rehearsal-dinner.php', destination: '/static/WeddingPlanning/31', },
      { source: '/out-of-town-guests.php', destination: '/static/WeddingPlanning/32', },
      { source: '/engagement-parties.php', destination: '/static/WeddingPlanning/33', },
      { source: '/unique-wedding-favors.php', destination: '/static/WeddingPlanning/34', },
      { source: '/wedding-budgets.html', destination: '/static/WeddingPlanning/35', },
      { source: '/honeymoon-destinations.html', destination: '/static/WeddingPlanning/36', },
      { source: '/wedding-planning-preparation.html', destination: '/static/WeddingPlanning/37', },
      { source: '/bridal-consultant-checklist.php', destination: '/static/WeddingPlanning/38', },
      { source: '/ceremony-site-questions.php', destination: '/static/WeddingPlanning/39', },
      { source: '/communication-negotiations.php', destination: '/static/WeddingPlanning/40', },
      { source: '/wedding-costs.php', destination: '/static/WeddingPlanning/41', },
      { source: '/bridal-hair.php', destination: '/static/WeddingPlanning/42', },
      { source: '/looking-great-wedding.php', destination: '/static/WeddingPlanning/43', },
      { source: '/choose-wedding-musician.php', destination: '/static/WeddingPlanning/44', },
      { source: '/wedding-music.php', destination: '/static/WeddingPlanning/45', },
      { source: '/vineyard-weddings.php', destination: '/static/WeddingPlanning/46', },
      { source: '/fall-weddings.php', destination: '/static/WeddingPlanning/47', },
      { source: '/holiday-weddings.html', destination: '/static/WeddingPlanning/48', },
      { source: '/wedding-planning-themes.html', destination: '/static/WeddingPlanning/49', },
      { source: '/country-themed-weddings.php', destination: '/static/WeddingPlanning/50', },
      { source: '/sorority-fraternity-weddings.php', destination: '/static/WeddingPlanning/51', },
      { source: '/beach-theme-weddings.php', destination: '/static/WeddingPlanning/52', },
      { source: '/wedding-colors.php', destination: '/static/WeddingPlanning/53', },
      { source: '/cruise-theme-weddings.php', destination: '/static/WeddingPlanning/54', },
      { source: '/your-wedding-theme.php', destination: '/static/WeddingPlanning/55', },
      { source: '/springWeddingPlanning2012.php', destination: '/static/WeddingPlanning/56', },
      { source: '/allAboutFlowers.php', destination: '/static/WeddingPlanning/57', },
    ]
  },
}
