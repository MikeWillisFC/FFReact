const config = {
   apiEndpoint: "https://www.favorfavor.com/mm5/merchant.mvc?Screen=api",
   apiEndpoint_static: "https://www.favorfavor.com/api/get.php?a=1", // category, product pages etc
   apiEndpoint_dynamic: "https://www.favorfavor.com/mm5/merchant.mvc?Screen=api", // search, basket, etc
   domain: "www.favorfavor.com",
   siteName: "Favor Favor",
   phoneNumber: "(516) 986-3285",
   phoneStatus:"up", // 2021-06-28: this should be updated to come from the API so we don't have to rebuild on change
   estDelivery: true
};

export default config;