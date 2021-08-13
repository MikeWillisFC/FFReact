import {Box,HStack,Center,Flex,Grid,SimpleGrid} from "@chakra-ui/react";
import Link from "next/link";

import styles from "../styles/footer.module.scss";

const Footer = (props) => {
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
                  <Link shallow href="/page/FF/CTGY/Specials">
                     <img src="https://www.favorfavor.com/images/misc/responsive/clearance.png" width="305" height="98" alt="Discounted / Clearance" />
                  </Link>
                  <Link shallow href="/page/FF/CTGY/PersonalizedWeddingFavors">
                     <img src="https://www.favorfavor.com/images/misc/responsive/personalized.png" width="305" height="98" alt="Personalized Favors" />
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
                        <Box>“Thank you so very much for your help and I look forward to receiving the place card holders! We're going to use them for wallet-size pictures of our ceremony in Kauai, and I'm sure they'll look equisi...”<br /><b>- Caroline</b></Box>
                        <Box>“Thank you!!! so much for my order. It was delievered so fast, the quality was better than I expected. The packaging is great and I'm sooooo pleased with everything. I can't wait to give them as favors...”<br /><b>- Laurie-Ann</b></Box>
                        <Box>“I just placed and order for the Matte Silver-Photo Albums and was so excited when they arrived. They are great and I can't wait to give them out as favors.”<br /><b>- Doreen</b></Box>
                     </Grid>
                  </Box>
                  <Box
                     display={["none","none","block"]}
                     width={"35%","35%","35%","30%"}
                  >
                     <Center>
                        <a href="https://www.favorfavor.com/wedding-planning.html">
                           <img src="https://www.favorfavor.com/images/misc/weddingResources.png" width="239" height="239" alt="Wedding Resources" />
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
               <span>•</span><a href="/sb-login.htm">Log in to View Your Saved Basket</a>
               <b className="green" style={{marginLeft: "10px"}}>(516) 986-3285</b>
            </Box>
         </Box>
         <Box className={styles.logoBox} display={["none","none","block"]}>
            <SimpleGrid columns={2} spacing={10}>
               <Box style={{paddingLeft:"20px",paddingTop:"5px"}}>
                  <img src="https://www.favorfavor.com/images/misc/welcomeToFavorFavor.png" width="248" height="85" alt="Welcome to Favor Favor" />
               </Box>
               <Box>
                  <Link shallow className="fRight" href="/page/FF/CTGY/FashionCraft-Favors" style={{marginTop:"30px",marginRight:"5px"}}>
                     <img src="https://www.favorfavor.com/images/buttons/fashioncraftPremier.png" width="110" height="32" alt="Favor Favor is a FashionCraft Wedding Favors Premier Dealer" />
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