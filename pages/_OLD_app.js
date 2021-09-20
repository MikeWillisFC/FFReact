import {useState,useEffect} from "react";
import { Provider } from "react-redux";
import axios from "axios";
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import {
   ChakraProvider,
   Box,
   Center,
   Stack,
   Grid,
   Flex,
   Skeleton,
   SkeletonCircle,
   SkeletonText
} from "@chakra-ui/react";

import store from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import leftnav,{leftnav_bestOfferItems} from "../config/leftnav";
import LeftNav from "../components/LeftNav";
import { theme } from "../styles/theme";

import "../styles/_globalStyles.scss";
import "../styles/miscSpriteMain.css";
import appStyles from "../styles/_app.module.scss";

function MyApp(props) {
   //console.log("theme",theme);
   const { Component, pageProps } = props;
   //console.log("MyApp props",props);

   const [state_mobileNavVisible, setState_mobileNavVisible] = useState( false );
   const [state_routeChanging, setState_routeChanging] = useState( false );

   useEffect(()=>{
      Router.events.on( "routeChangeStart", startRouteChange );
      Router.events.on( "routeChangeComplete", endRouteChange );
      Router.events.on( "routeChangeError", endRouteChange );

      return ()=>{
         Router.events.off( "routeChangeStart", startRouteChange );
         Router.events.off( "routeChangeComplete", endRouteChange );
         Router.events.off( "routeChangeError", endRouteChange );
      }
   },[]);

   let startRouteChange = () =>{ setState_routeChanging(true); };
   let endRouteChange = () =>{ setState_routeChanging(false); };

   let toggleMobileNav = () => {
      //console.log("toggling mobile nav");
      setState_mobileNavVisible(prevState=>{
         return !prevState;
      });
   };

   let mainComponentOpacity = state_routeChanging ? 0 : 1;

   return (
      <Provider store={store}>
         <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
         </Head>
         <ChakraProvider theme={theme}>
            <Box
               className={appStyles.appRoot}
               marginTop={["0px","0px","5px"]}
               marginBottom={["0px","0px","20px"]}
               borderRadius={["0px","0px","9px"]}
               maxWidth={[
                     "100%", // 0-30em
                     "100%", // 30em-48em
                     "976px", // 48em-62em
                     "976px", // 62em-80
                     "1200px", // 80em+
               ]}
            >
               <Stack>
                  <Header toggleMobileNav={toggleMobileNav} />
                  <Flex style={{margin:"0px",overflow:"hidden",paddingTop: "5px",backgroundColor:"#fff"}}>
                     <Box
                        className={appStyles.leftnav}
                        style={{zIndex:"1"}}
                        position={["relative","relative","static"]}
                        left={[(state_mobileNavVisible ? "0px" : "-100%"),(state_mobileNavVisible ? "0px" : "-100%"),"0px"]}
                        width={["100%","100%","20%"]}
                        overflow={["hidden","hidden","visible"]}
                        flexShrink={["0","0","1"]}
                     >
                        <LeftNav leftnav={leftnav} bestOfferItems={leftnav_bestOfferItems} />
                     </Box>
                     <Box
                        className={appStyles.mainComponent}
                        position={["relative","relative","static"]}
                        left={["-100%","-100%","0px"]}
                        width={["100%","100%","80%"]}
                        flexShrink={["0","0","1"]}
                        style={{opacity: mainComponentOpacity}}
                     >
                        <Component {...pageProps} />
                     </Box>
                  </Flex>
                  <Footer />
               </Stack>
            </Box>
         </ChakraProvider>
      </Provider>
   )
}

/* 2021-08-24: since we're not importing the leftnav, this block ends up doing nothing.
* see https://nextjs.org/docs/messages/opt-out-auto-static-optimization
*/
if ( false ) {
   MyApp.getInitialProps = async (context) => {
      console.log("MyApp.getInitialProps",MyApp.getInitialProps);
      const pageProps = await App.getInitialProps(context); // Retrieves page's `getInitialProps`

      /* 2021-07-27: it would be nice to import the left nav, but unfortunately
      * the call happens on every single route change, which sucks. So for now
      * it's hardcoded in a separate file
      */
      if ( true ) {
         return {
            ...pageProps
         };
      } else {
         let config = await import("../config/config");
         //console.log("config",config);
         let response = await axios.get(`${config.default.apiEndpoint}&cAction=getLeftNav`);

         //console.log("response",response);
         if ( response ) {
            return {
               ...pageProps,
               leftnav: response.data.leftNav
            };
         } else {
            return {
               ...pageProps,
               leftnav: null
            };
         }
      }
   };
}


export default MyApp;
