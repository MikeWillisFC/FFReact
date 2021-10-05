module.exports = {
  reactStrictMode: true,
  "trailingSlash": false,

  "headers": [
     {
        "source": "(*.webp)",
        "headers" : [
           {
              "key" : "Cache-Control",
              "value" : "max-age=31536000"
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
