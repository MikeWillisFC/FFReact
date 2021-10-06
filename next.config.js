module.exports = {
  reactStrictMode: true,
  "trailingSlash": false,

  images: {
    minimumCacheTTL: 31536000,
  },

  "headers": [
     {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|svg)",
        "headers" : [
           {
              "key" : "Cache-Control",
              "value" : "s-max-age=31536000"
           }
        ]
     }
  ],

  images: {
    domains: ['www.favorfavor.com','www.nicepricefavors.com','localhost','cart.favorfavor.com'],
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
    ]
  },
}
