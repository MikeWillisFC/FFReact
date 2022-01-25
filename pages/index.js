import {useEffect} from "react";
import axios from "axios";
import Head from 'next/head';
import _ from "lodash";

import Home_And_404 from "../components/Home_And_404";

// import { createMD5 } from "../utilities/";

const Home = props => {
   //console.log("Home props", props);

   let {setNavVisibility} = props;
   useEffect(()=>{
      setNavVisibility(true);
   },[setNavVisibility]);

   return (
      <Home_And_404
         hProps={props}
      />
   );
};

// let _fetchHome = _.memoize(async (endpoint) => {
//    let request = "&cAction=getHome";
//    let hash = createMD5( request );
//    return await axios.get(`${endpoint}${request}&h=${hash}`);
// }); // _fetchHome

// server-side render
// Home.getInitialProps = async (context) => {
//    //console.log("context",context);
//
//    let config = await import("../config/config");
//    //console.log("config",config);
//
//    let response = await _fetchHome(config.default.apiEndpoint_static);
//    //console.log("response",response);
//    if ( response ) {
//       return response.data.home;
//    } else {
//       return null;
//    }
// };

// server-side render and pre-render
export async function getStaticProps() {
   //console.log("context",context);

   let config = await import("../config/config");
   //console.log("config",config);

   let response = await axios.get(`${config.default.apiEndpoint}&cAction=getHome`);
   //console.log("response",response);
   if ( response ) {
      return {
         props: response.data.home,
         revalidate: config.default.cacheKeepAlive.home
      }
   } else {
      return {
         props: null
      }
   }
}

export default Home;