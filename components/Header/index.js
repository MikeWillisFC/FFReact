import { Fragment,useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from 'next/image';
import { format,lastDayOfMonth } from 'date-fns';
import axios from "axios";
import { FaCaretRight,FaShoppingCart,FaThumbsUp,FaBars } from 'react-icons/fa';
import {
   Icon,
   HStack,
   Flex,
   Box,
   Button,
   Menu,
   MenuButton,
   MenuList,
   MenuItem,

   useBreakpointValue
} from "@chakra-ui/react";

import Messages from "../Messages";
import SearchForm from "./SearchForm";

import { openMiscModal } from "../../utilities";

import headerStyles from "../../styles/header.module.scss";

const Header = props => {
   console.log("Header rendering");
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const breakPoint = useBreakpointValue({ base: "mobile", md: "notMobile" });

   const messages = useSelector(state=>{
      return state.messages;
   });

   console.log("messages",messages);


   useEffect(()=>{
      if ( messages.errorMessages.length || messages.informationMessages.length ) {
         window.scrollTo({ top: 0, behavior: 'smooth'});
      }
   },[messages]);

   //console.log("Header rendering");

   let uniqueID = () => {
      var firstPart = (Math.random() * 46656) | 0;
      var secondPart = (Math.random() * 46656) | 0;
      firstPart = ("000" + firstPart.toString(36)).slice(-3);
      secondPart = ("000" + secondPart.toString(36)).slice(-3);
      return firstPart + secondPart;
   };

   let renderEndDate = () => {
      let today = new Date();
      let month = format(today, 'LLLL');
      let day = lastDayOfMonth(today);
      let dayStart = format(day,"d");
      let dayEnd = format(day,"do").replace(/\d/g,"");
      return (
         <Fragment>
            {month} {dayStart}<sup>{dayEnd}</sup>
         </Fragment>
      );
   };

   let handleCheapShipping = event => {
      event.preventDefault();
      openMiscModal({
         setModal: props.setMiscModal,
         disclosure: props.miscModalDisclosure,
         title: "Promotion Details",
         href: event.currentTarget.getAttribute("href"),
         size: "xl"
      });
   }; // handleCheapShipping

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
                        loading={breakPoint === "mobile" ? "lazy" : "eager"}
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


                        {
                           /* 2021-10-27: we're putting an id and isLazy here to stop chakraUI / popover from complaining about IDs not matching.
                           * other than that it serves no purpose, and never will.
                           * see https://github.com/chakra-ui/chakra-ui/issues/3020
                           */
                        }
                        <Box>
                           <Menu id="hsaMenu" isLazy>
                              <MenuButton><Icon as={FaCaretRight} color="#F167A8" />Site Assistance</MenuButton>
                              <MenuList className={headerStyles.siteAssistanceNavDropdown}>
                                 <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/aboutus.html">About Us</a></MenuItem>
                                 <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/contact_us.php">Contact Us</a></MenuItem>
                                 <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/order-favor-samples.php">Samples</a></MenuItem>
                                 <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/terms_etc.php">Terms & Conditions</a></MenuItem>
                                 <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/terms_etc.php#shipping">Shipping</a></MenuItem>
                                 <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/terms_etc.php#PrivacyPolicy">Privacy</a></MenuItem>
                              </MenuList>
                           </Menu>
                        </Box>

                        <Box><a href="/o-status.htm"><Icon as={FaCaretRight} color="#F167A8" />Order Status</a></Box>
                        <Box
                           style={{padding:"0px"}}
                           display={["none","none","none","block"]}
                        >
                           <a href="/SavedBasket">
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
            <a
               href={`https://${globalConfig.apiDomain}/includes/ajax/freeShipping.php`}
               onClick={handleCheapShipping}
               className={headerStyles.headerPromo}
            >
               <Box display={["none","none","none","block"]}>
                  $9.99 shipping* on hundreds of items<br />
                  ends {renderEndDate()} &nbsp;<span>*click for details</span>
               </Box>
            </a>

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
               <SearchForm
               />
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
               <Link href="/page/FF/CTGY/Inexpensive">$0.99 &amp; Under Favors</Link>
            </Box>
            <Box flex="1">
               <Link href="/page/FF/CTGY/popular-wedding-favors">Most Popular Favors</Link>
            </Box>
            <Box flex="1">
               <Link href="/page/FF/CTGY/ThemeFavors">Theme Favors</Link>
            </Box>
            <Box flex="1">
               <Link href="/page/FF/CTGY/Specials"><a><span className="darkPink">Specials / Clearance</span></a></Link>
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

         <Messages
            messages={messages}
         />
      </Box>
   );
};

export default Header;