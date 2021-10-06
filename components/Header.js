// import { Fragment } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from 'next/image';
import { FaCaretRight,FaShoppingCart,FaThumbsUp,FaBars } from 'react-icons/fa';
import {
   Icon,
   HStack,
   Flex,
   Box,
   SimpleGrid,
   Input,
   Button,

   Menu,
   MenuButton,
   MenuList,
   MenuItem,
   MenuItemOption,
   MenuGroup,
   MenuOptionGroup,
   MenuIcon,
   MenuCommand,
   MenuDivider,

   useBreakpointValue
} from "@chakra-ui/react";

import Messages from "./Messages";

/* 2021-07-19: see https://github.com/chakra-ui/chakra-ui/issues/3020
* once that bug is really fixed, we can remove this and copy the return from
* HeaderSiteAssistanceMenu and paste it into the appropriate spot here. Until
* then, this gets around the issue by forcing this component to not
* use SSR, which is not an ideal solution
*/
import dynamic from 'next/dynamic';
const HeaderSiteAssistanceMenu = dynamic(import('./HeaderSiteAssistanceMenu'), {
  ssr: false
});

import headerStyles from "../styles/header.module.css";

const Header = (props) => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const breakPoint = useBreakpointValue({ base: "hidden", md: "visible" });

   const messages = useSelector(state=>{
      return state.messages;
   });

   console.log("Header rendering");

   let uniqueID = () => {
      var firstPart = (Math.random() * 46656) | 0;
      var secondPart = (Math.random() * 46656) | 0;
      firstPart = ("000" + firstPart.toString(36)).slice(-3);
      secondPart = ("000" + secondPart.toString(36)).slice(-3);
      return firstPart + secondPart;
   };

   return (
      <Box
         className={`${headerStyles.header}`}
         borderTopRadius={["0px","0px","7px"]}
      >
         <Box
            position="relative"
            style={{backgroundColor:"#fff"}}
            backgroundImage={[
               "none",
               "none",
               "url('https://www.favorfavor.com/images/misc/responsive/hearts.png')"
            ]}
            backgroundRepeat="no-repeat"
            backgroundPosition="50%"
            height={["125px","125px","80px"]}
            //border="1px solid #f00"
         >
            <Box
               className={`${headerStyles.logo}`}
               backgroundImage={[
                  "url('https://www.favorfavor.com/images/misc/responsive/Logo.svg')",
                  "url('https://www.favorfavor.com/images/misc/responsive/Logo.svg')",
                  "url('https://www.favorfavor.com/images/misc/miscSpriteMain.3.png')"
               ]}
               backgroundSize={["contain","contain","auto"]}
               backgroundPosition={["50%","50%","-347px -306px"]}
               //float={["none","none","left"]}
               display={["block","block","inline-block"]}
               height={["105px"]}
               margin={["0px auto","0px auto","0px"]}
            >
               <Link href="/"> </Link>{ /* 2021-06-25: trust me, don't remove the space */ }
            </Box>

            <Box
               className={headerStyles.headerCart}
               display={["block","block","none"]}
            >
               <a href="https://www.favorfavor.com/mm5/merchant.mvc?Screen=BASK">
                  <Icon boxSize={7} as={FaShoppingCart} color="#1874ab" />
               </a>
            </Box>

            <HStack
               spacing={4}
               style={{position:"absolute",top:"0px",right:"0px",margin:"0px"}}
            >
               {
                  globalConfig.phoneStatus === "up" &&
                  <Box
                     display={["none","none","block","block"]}
                     className={`${headerStyles.phoneNumber} darkBlue`}
                  >
                     <Image
                        src="https://www.favorfavor.com/images/misc/header/phone.png"
                        height="21"
                        width="10"
                        alt="phone number"
                        loading={breakPoint === "hidden" ? "lazy" : "eager"}
                     />
                     {globalConfig.phoneNumber}
                  </Box>
               }

               <Box
                  className={`${headerStyles.siteAssistance} nomarg`}
                  display={["none","none","block"]}
               >
                  <div>
                     <HStack className={headerStyles.siteAssistanceNav} spacing="10px">
                        <HeaderSiteAssistanceMenu />
                        <Box><a href="/o-status.htm"><Icon as={FaCaretRight} color="#F167A8" />Order Status</a></Box>
                        <Box
                           style={{padding:"0px"}}
                           display={["none","none","none","block"]}
                        >
                           <a href="/sb-login.htm">
                              <Icon as={FaCaretRight} color="#F167A8" />
                              <span className="darkPink">View</span>{" "}
                              Saved Cart
                           </a>
                        </Box>
                        <Box>
                           <Link href="/Basket">
                              <a>
                                 <Icon as={FaCaretRight} color="#F167A8" />
                                 <span className="darkBlue">
                                    Shopping Cart{" "}
                                    <Icon style={{position:"relative",top:"-2px"}} as={FaShoppingCart} color="#F167A8" />
                                 </span>
                              </a>
                           </Link>
                        </Box>

                     </HStack>
                  </div>
               </Box>
            </HStack>

            { false && <p className="fRight nomarg darkBlue" id="hPhone"><a href="/contact_us.php">Contact Us</a></p> }

            <Box display={["none","none","none","block"]} className={headerStyles.headerPromo}>
               <a href="/includes/ajax/freeShipping.php">
                  $9.99 shipping* on hundreds of items<br />
                  ends month day<sup>sth</sup> &nbsp;&nbsp;<span>*click for details</span>
               </a>
            </Box>

            <Box
               display={["block","block","none"]}
               className={headerStyles.menuIcon}
               onClick={props.toggleMobileNav}
            >
               <Icon boxSize={7} as={FaBars} color="#1874ab" />
            </Box>

            <Box
               className={headerStyles.search}
               width={["100%","100%","300px"]}
            >
               <form className="nomarg" action="/mm5/merchant.mvc?" method="get">
                  <input type="hidden" name="Screen" value="searchAZ" />
                  <input type="hidden" name="viewType" value="grid" />

                  { false && <p className="nomarg fLeft"><Image src="/images/misc/header/mag-glass.png" height="35" width="38" alt="magnifying glass" /></p> }

                  <Input
                     style={{backgroundColor:"#fff",zIndex:"1"}}
                     maxLength="45"
                     name="search"
                     size="sm"
                     placeholder="Search"
                     width={["70%","70%","200px"]}
                     marginRight={["30px","48px"]}
                  />
                  <Button
                     style={{zIndex:"5"}}
                     size="sm"
                     colorScheme="blue"
                     right={["2px","70px","2px"]}
                  >
                     Search
                  </Button>

                  { false && <p className="nomarg fLeft"><input className="search_submit miscSpriteMain search-button" type="submit" value="" /></p> }
               </form>
            </Box>
         </Box>

         <Flex
            display={["none","none","flex"]}
            className={headerStyles.horizontalNav}
            spacing="5px"
         >
            <Box display={["none","block","none"]} flex="1">
               <a>Categories</a>
            </Box>
            <Box flex="1">
               <Link shallow href="/page/FF/CTGY/Inexpensive">$0.99 &amp; Under Favors</Link>
            </Box>
            <Box flex="1">
               <Link shallow href="/page/FF/CTGY/popular-wedding-favors">Most Popular Favors</Link>
            </Box>
            <Box flex="1">
               <Link shallow href="/page/FF/CTGY/ThemeFavors">Theme Favors</Link>
            </Box>
            <Box flex="1">
               <Link shallow href="/page/FF/CTGY/Specials"><a><span className="darkPink">Specials / Clearance</span></a></Link>
            </Box>
            <Box flex="1">
               <div
                  className="fb-like"
                  data-href="https://www.favorfavor.com/"
                  data-send="false"
                  data-layout="button_count"
                  data-width="100"
                  data-show-faces="false"
               >
                  <Icon as={FaThumbsUp} color="#F167A8" />
               </div>
            </Box>
         </Flex>

         {
            (messages.errorMessages.length || messages.generalMessages.length) ?
               <Messages
                  messages={messages}
               />
            : ""
         }
      </Box>
   );
};

export default Header;