const config = {
   apiEndpoint: "https://www.favorfavor.com/mm5/merchant.mvc?Screen=api",
   apiEndpoint_static: "https://www.favorfavor.com/api/get.php?a=1", // category, product pages etc
   apiEndpoint_dynamic: "https://www.favorfavor.com/mm5/merchant.mvc?Screen=api", // search, basket, etc
   domain: "www.favorfavor.com",
   apiDomain: "www.favorfavor.com",
   siteName: "Favor Favor",
   phoneNumber: "(516) 986-3285",
   phoneNumberRaw: "5169863285",
   phonesDown: false,
   faxNumber: "(516) 781-1036",
   customerServiceEmail: "customer_service@favorfavor.com",
   phoneStatus:"up", // 2021-06-28: this should be updated to come from the API so we don't have to rebuild on change
   estDelivery: true,

   // in seconds, so 60 * 60 * 12 = 12 hours
   cacheKeepAlive: {
      home: 60 * 60 * 12,
      prod: 60 * 60 * 12,
      ctgy: 60 * 60 * 12,
      rvws: 60 * 60 * 12
   },
   // cacheKeepAlive: {
   //    home: 1,
   //    prod: 1,
   //    ctgy: 1,
   //    rvws: 1
   // },
   authorize: {
      production: {
         loginID: "6X7PF92dxW",
         publicKey: "8cEkGMsUeSc85288XknkMb9Ag3E7Va89PQ2fhc58B449WX3pUVJyEbW5MEj2YrvA"
      },
      sandbox: {
         loginID: "5KPX6kp4sR",
         publicKey: "2YkLRDnG3rW8yvLC4q9qAdY6kBB6tvw867aq2byVgZmy34A2uB37k7tNhb8YGgL8"
      }
   }
};

export default config;