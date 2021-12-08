import {useState,useEffect,useCallback} from "react";
import { Provider,useSelector } from "react-redux";
import axios from "axios";
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import _ from "lodash";
import {
   ChakraProvider,
   Box,
   Center,
   Stack,
   Grid,
   Flex,
   Skeleton,
   SkeletonCircle,
   SkeletonText,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,

   useDisclosure
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
   const [state_navVisible, setState_navVisible] = useState( true );
   const [state_miscModal,setState_miscModal] = useState( {title: false,content: false, size:false} );

   const miscModalDisclosure = useDisclosure();

   let toggleMobileNav = useCallback(() => {
      //console.log("toggling mobile nav");
      setState_mobileNavVisible(prevState=>{
         return !prevState;
      });
   },[]);

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
                  <Header
                     toggleMobileNav={toggleMobileNav}
                     miscModalDisclosure={miscModalDisclosure}
                     setMiscModal={setState_miscModal}
                  />
                  <Flex style={{margin:"0px",overflow:"hidden",paddingTop: "5px",backgroundColor:"#fff",paddingBottom:"50px"}}>
                     <Box
                        className={appStyles.leftnav}
                        style={{zIndex:"1"}}
                        position={["relative","relative","static"]}
                        left={[(state_mobileNavVisible ? "0px" : "-100%"),(state_mobileNavVisible ? "0px" : "-100%"),"0px"]}
                        width={["100%","100%",(state_navVisible ? "20%" : "0%")]}
                        height={["auto","auto",(state_navVisible ? "auto" : "0px")]}
                        overflow={["hidden","hidden",(state_navVisible ? "visible" : "hidden")]}
                        flexShrink={["0","0","1"]}
                     >
                        <LeftNav leftnav={leftnav} bestOfferItems={leftnav_bestOfferItems} />
                     </Box>
                     <Box
                        className={appStyles.mainComponent}
                        position={["relative","relative","static"]}
                        left={["-100%","-100%","0px"]}
                        width={["100%","100%",(state_navVisible ? "80%" : "100%")]}
                        flexShrink={["0","0","1"]}
                     >
                        <Component
                           {...pageProps}
                           setNavVisibility={setState_navVisible}
                           miscModalDisclosure={miscModalDisclosure}
                           setMiscModal={setState_miscModal}
                        />
                     </Box>
                  </Flex>
                  <Footer />
               </Stack>
            </Box>

            <Modal
               isOpen={miscModalDisclosure.isOpen}
               onClose={miscModalDisclosure.onClose}
               size={state_miscModal.size}
               isCentered
            >
               <ModalOverlay />
               <ModalContent
                  className={appStyles.miscModal}
               >
                  <ModalHeader className="blueHeader">
                     {state_miscModal.title}
                     <ModalCloseButton />
                  </ModalHeader>
                  <Box>
                     {
                        typeof( state_miscModal.content ) === "object" ?
                           <ModalBody className={appStyles.mmBody}>
                              {state_miscModal.content}
                           </ModalBody>
                        : <ModalBody
                           className={appStyles.mmBody}
                           dangerouslySetInnerHTML={{__html: _.unescape(state_miscModal.content)}}
                          >
                        </ModalBody>
                     }

                  </Box>
               </ModalContent>
            </Modal>

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
         let responseD = await axios.get(`${config.default.apiEndpoint}&cAction=getLeftNav`);

         //console.log("responseD",responseD);
         if ( responseD ) {
            return {
               ...pageProps,
               leftnav: responseD.data.leftNav
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
