module.exports = {
  reactStrictMode: true,
  "trailingSlash": false,

  "headers": [
     {
<<<<<<< HEAD
        "source": "**/*.@(jpg|jpeg|gif|png|webp)",
=======
        "source": "/(*.webp)",
>>>>>>> 4c99ec8bc186048b88d551099aae2777b1652dec
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
