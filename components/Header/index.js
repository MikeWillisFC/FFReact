import { Fragment,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import Link from "next/link";
import Image from 'next/image';
import { format,lastDayOfMonth } from 'date-fns';
import axios from "axios";
import { FaCaretRight,FaShoppingCart,FaThumbsUp,FaBars } from 'react-icons/fa';
import { load as loadGoogleRecaptcha } from 'recaptcha-v3';
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

import {globalActions} from "../../store/slices/global";
import { openMiscModal } from "../../utilities";

import styles from "../../styles/header.module.scss";

const Header = props => {
   //console.log("Header rendering");
   const dispatch = useDispatch();

   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   let googleRecaptchaToken = useSelector((state)=>{
      return state.googleRecaptchaToken;
   });

   useEffect(()=>{
      if ( !window.googleRecaptcha ) {
         loadGoogleRecaptcha('6LeXUcIUAAAAAFgyKzmgoMfJNNHgAlXbpwwZ0-h5').then((recaptcha) => {
            window.googleRecaptcha = recaptcha;
         });
      }
   },[]);

   const breakPoint = useBreakpointValue({ base: "mobile", md: "notMobile" });

   const messages = useSelector(state=>{
      return state.messages;
   });

   //console.log("messages",messages);


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
         className={`${styles.header}`}
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
               className={`${styles.logo}`}
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
               className={styles.headerCart}
               display={["block","block","none"]}
            >
               <Link href="/Basket">
                  <a>
                     <Icon boxSize={7} as={FaShoppingCart} color="#1874ab" />
                  </a>
               </Link>
            </Box>

            <HStack
               spacing={4}
               style={{position:"absolute",top:"-2px",right:"0px",margin:"0px"}}
            >
               {
                  globalConfig.phoneStatus === "up" && (
                     <Box
                        display={["none","none","block","block"]}
                        className={`${styles.phoneNumber} darkBlue`}
                     >
                        <a href={`tel:${globalConfig.phoneNumberRaw}`}>
                           <Box
                              style={{display:"inline",position:"relative",top:"3px",marginRight:"3px"}}
                           >
                              <Image
                                 src="https://www.favorfavor.com/images/misc/header/phone.png"
                                 height="21"
                                 width="10"
                                 alt="phone number"
                                 loading={breakPoint === "mobile" ? "lazy" : "eager"}
                              />
                           </Box>
                           {globalConfig.phoneNumber}
                        </a>
                     </Box>
                  )
               }

               <Box
                  className={`${styles.siteAssistance} nomarg`}
                  display={["none","none","block"]}
               >
                  <div>
                     <HStack className={styles.siteAssistanceNav} spacing="10px">
                        {
                           /* 2021-10-27: we're putting an id and isLazy here to stop chakraUI / popover from complaining about IDs not matching.
                           * other than that it serves no purpose, and never will.
                           * see https://github.com/chakra-ui/chakra-ui/issues/3020
                           */
                        }
                        <Box>
                           <Menu id="hsaMenu" isLazy>
                              <MenuButton><Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />Site Assistance</MenuButton>
                              <MenuList className={styles.siteAssistanceNavDropdown}>
                                 <MenuItem>
                                    <Link href="/aboutus.html">
                                       <a>
                                          <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                          About Us
                                       </a>
                                    </Link>
                                 </MenuItem>
                                 <MenuItem>
                                    <Link href="/contact_us.php">
                                       <a>
                                          <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                          Contact Us
                                       </a>
                                    </Link>
                                 </MenuItem>
                                 <MenuItem>
                                    <Link href="/order-favor-samples.php">
                                       <a>
                                          <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                          Samples
                                       </a>
                                    </Link>
                                 </MenuItem>
                                 <MenuItem>
                                    <Link href="/terms_etc.php">
                                       <a>
                                          <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                          Terms &amp; Conditions
                                       </a>
                                    </Link>
                                 </MenuItem>
                                 <MenuItem>
                                    <Link href="/terms_etc.php#shipping">
                                       <a>
                                          <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                          Shipping
                                       </a>
                                    </Link>
                                 </MenuItem>
                                 <MenuItem>
                                    <Link href="/terms_etc.php#PrivacyPolicy">
                                       <a>
                                          <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                          Privacy
                                       </a>
                                    </Link>
                                 </MenuItem>
                              </MenuList>
                           </Menu>
                        </Box>

                        <Box>
                           <Link href="/o-status.htm">
                              <a>
                                 <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                 Order Status
                              </a>
                           </Link>
                        </Box>
                        <Box
                           style={{padding:"0px"}}
                           display={["none","none","none","block"]}
                        >
                           <Link href="/SavedBasket">
                              <a>
                                 <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                 <span className="darkPink">View</span>{" "}
                                 Saved Cart
                              </a>
                           </Link>
                        </Box>
                        <Box>
                           <Link href="/Basket">
                              <a>
                                 <Icon className={styles.linkIcon} as={FaCaretRight} color="#F167A8" />
                                 <span className="darkBlue">
                                    Shopping Cart{" "}
                                    <Icon className={styles.linkIcon} as={FaShoppingCart} color="#F167A8" />
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
               className={styles.headerPromo}
            >
               <Box display={["none","none","none","block"]}>
                  $9.99 shipping* on hundreds of items<br />
                  ends {renderEndDate()} &nbsp;<span>*click for details</span>
               </Box>
            </a>

            <Box
               display={["block","block","none"]}
               className={styles.menuIcon}
               onClick={props.toggleMobileNav}
            >
               <Icon boxSize={7} as={FaBars} color="#1874ab" />
            </Box>

            <Box
               className={styles.search}
               width={["100%","100%","300px"]}
            >
               <SearchForm
               />
            </Box>
         </Box>

         <Flex
            display={["none","none","flex"]}
            className={styles.horizontalNav}
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