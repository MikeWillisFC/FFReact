module.exports = {
  reactStrictMode: true,
  trailingSlash: false,

  headers: [
    {
      source: '/*.(jpg|jpeg|gif|png|webp|svg)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'max-age=31536000',
        },
      ],
    },
    {
      source: '/_next/image*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'max-age=31536000',
        },
      ],
    },
  ],

  images: {
    domains: [
      'www.favorfavor.com',
      'www.nicepricefavors.com',
      'localhost',
      'cart.favorfavor.com',
    ],
    minimumCacheTTL: 31536000,
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
    ];
  },
};
