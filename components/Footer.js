import {Fragment,useState,useEffect} from "react";
import {Box,HStack,Center,Flex,Grid,SimpleGrid} from "@chakra-ui/react";
import Link from "next/link";
import Image from 'next/image';
import {useRouter} from 'next/router';
import { useSelector,useDispatch } from "react-redux";

import {logOut,isLoggedIn} from "../utilities";
import {globalActions} from "../store/slices/global";

import styles from "../styles/footer.module.scss";

const store = require('store'); // https://github.com/marcuswestin/store.js, for full localStorage support

const Footer = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const dispatch = useDispatch();
   const router = useRouter();

   const [st_isLoggedIn,sst_isLoggedIn] = useState(globalConfig.isLoggedIn);

   //console.log("globalConfig.isLoggedIn",globalConfig.isLoggedIn);

   useEffect(()=>{
      // console.log("Footer useEffect running, globalConfig.isLoggedIn:",globalConfig.isLoggedIn);

      let checkLogin = async () => {
         /* maybe this is a page reload and the user really is logged in.
         * check local storage
         */
         let loginResult = await isLoggedIn(globalConfig.apiEndpoint);
         // console.log("loginResult",loginResult);
         if ( loginResult ) {
            // console.log("isLoggedIn returned true");
            // ok, set global config
            dispatch(globalActions.setLogin(true));
            sst_isLoggedIn(true);
         }
      };

      sst_isLoggedIn(globalConfig.isLoggedIn);
      if ( !globalConfig.isLoggedIn ) {
         checkLogin();
      }
   },[
      globalConfig.isLoggedIn,
      globalConfig.apiEndpoint,
      dispatch
   ]);

   let handleLogout = event => {
      event.preventDefault();

      if ( logOut(globalConfig.apiEndpoint) ) {
         dispatch(globalActions.setLogin(false));
         sst_isLoggedIn(false);
         router.push({
            pathname: `/`,
            query: { loggedOut: 1 }
         });
      }
   };

   //console.log("globalConfig",globalConfig);

   return (
      <div className={styles.footer}>
         <p className={styles.horizontalLineA}></p>
         <p className={styles.horizontalLineB}></p>

         <Box
            display={["none","none","block"]}
         >
            <Center>
               <HStack
                  spacing="5"
                  padding="10"
               >
                  <Link href="/page/FF/CTGY/Specials">
                     <a>
                        <Image src="https://www.favorfavor.com/images/misc/responsive/clearance.png" width="305" height="98" alt="Discounted / Clearance" />
                     </a>
                  </Link>
                  <Link href="/page/FF/CTGY/PersonalizedWeddingFavors">
                     <a>
                        <Image src="https://www.favorfavor.com/images/misc/responsive/personalized.png" width="305" height="98" alt="Personalized Favors" />
                     </a>
                  </Link>
               </HStack>
            </Center>
         </Box>

         <Box style={{backgroundColor: "#ecf6e7",paddingBottom:"20px"}}>
            <Box className={styles.infoContainer}>
               <Flex style={{margin:"0px"}} className={styles.info}>
                  <Box
                     width={["90%","90%","65%", "70%"]}
                     className={styles.testimonials}
                  >
                     <h3>Testimonials</h3>
                     <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={6}
                        width="100%"
                        overflow="scroll"
                     >
                        <Box>“Thank you so very much for your help and I look forward to receiving the place card holders! We&apos;re going to use them for wallet-size pictures of our ceremony in Kauai, and I&apos;m sure they&apos;ll look equisi...”<br /><b>- Caroline</b></Box>
                        <Box>“Thank you!!! so much for my order. It was delievered so fast, the quality was better than I expected. The packaging is great and I&apos;m sooooo pleased with everything. I can&apos;t wait to give them as favors...”<br /><b>- Laurie-Ann</b></Box>
                        <Box>“I just placed and order for the Matte Silver-Photo Albums and was so excited when they arrived. They are great and I can&apos;t wait to give them out as favors.”<br /><b>- Doreen</b></Box>
                     </Grid>
                  </Box>
                  <Box
                     display={["none","none","block"]}
                     width={"35%","35%","35%","30%"}
                  >
                     <Center>
                        <a href="https://www.favorfavor.com/wedding-planning.html">
                           <Image src="https://www.favorfavor.com/images/misc/weddingResources.png" width="239" height="239" alt="Wedding Resources" />
                        </a>
                     </Center>
                  </Box>
               </Flex>
            </Box>

            <Box className={`darkBlue ${styles.nav}`}>
               <a href="/contact_us.php">Contact Us</a>
               <span>•</span><a href="/aboutus.html">About Us</a>
               <span>•</span><a href="/wedding-planning.html">Wedding Resources</a>
               <span>•</span><a href="/order-favor-samples.php">Samples</a>
               <span>•</span><a href="/terms_etc.php">Terms &amp; Conditions</a>

               {
                  st_isLoggedIn ? (
                     <Fragment>
                        <span>•</span>{" "}<span style={{cursor:"pointer"}} onClick={handleLogout}>Log Out</span>
                     </Fragment>
                  ) : (
                     <Fragment>
                        <span>•</span><Link href="/SavedBasket">Log in to View Your Saved Basket</Link>
                     </Fragment>
                  )
               }

               <b className="green" style={{marginLeft: "10px"}}>(516) 986-3285</b>
            </Box>
         </Box>
         <Box className={styles.logoBox} display={["none","none","block"]}>
            <SimpleGrid columns={2} spacing={10}>
               <Box style={{paddingLeft:"20px",paddingTop:"5px"}}>
                  <Image src="https://www.favorfavor.com/images/misc/welcomeToFavorFavor.png" width="248" height="85" alt="Welcome to Favor Favor" />
               </Box>
               <Box>
                  <Link className="fRight" href="/page/FF/CTGY/FashionCraft-Favors" style={{marginTop:"30px",marginRight:"5px"}}>
                     <a>
                        <Image src="https://www.favorfavor.com/images/buttons/fashioncraftPremier.png" width="110" height="32" alt="Favor Favor is a FashionCraft Wedding Favors Premier Dealer" />
                     </a>
                  </Link>
               </Box>
            </SimpleGrid>
         </Box>
         <Box className={styles.copyright} textAlign={["center","center","right"]}>
            &copy; 2005 - 2021 Favor Favor<br />
            Unique Wedding Favors at Cheap Prices
         </Box>
      </div>
   );
};

export default Footer;