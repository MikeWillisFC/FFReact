import {Fragment,useEffect,useState,forwardRef} from "react";
import Image from 'next/image';
import Link from "next/link";
import _ from "lodash";
import axios from "axios";
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import { FaRegClone } from 'react-icons/fa';
import {
   Box,
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,
   Center,
   Table,
   Thead,
   Tbody,
   Tfoot,
   Tr,
   Th,
   Td,
   TableCaption,
   Button,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,

   useDisclosure
} from "@chakra-ui/react";

import AllReviews from "../AllReviews";
import ReviewStars from "./ReviewStars";
import Review from "./Review";

import {semiRandomString} from "../../utilities";

import styles from "../../styles/product.module.scss";
import tabStyles from "../../styles/tabs.module.scss";

const Description = forwardRef((props,ref) => {
   // console.log("Description rendering");
   // console.log("Description props",props);

   const [state_allReviews,setState_allReviews] = useState({});
   const [state_tabIndex,setState_tabIndex] = useState(0);

   const buttonControls = useAnimation();
   const reviewBoxControls = useAnimation();

   const reviewsModalControls = useDisclosure();

   let {tabIndex,setTabIndex} = props;
   useEffect(()=>{
      // console.log("tabIndex useEffect running");
      if ( tabIndex !== false ) {
         // console.log("setting state to '" + tabIndex + "'");
         setState_tabIndex( tabIndex );
         setTabIndex(false);
      }
   },[tabIndex,setTabIndex]);

   let showMoreReviews = () => {
      buttonControls.start("collapsed");
      reviewBoxControls.start("open");
   }; // showMoreReviews

   const _fetchReviews = _.memoize(async (code,endpoint) => {
      return await axios.get(`${endpoint}&sft=reviews&code=${code}`);
   });

   let showReviews = async () => {
      let reviews = await _fetchReviews(props.product.code,props.apiEndpoint_static);
      //console.log("reviews",reviews);
      if ( reviews.status ) {
         setState_allReviews(reviews.data.reviews);
         reviewsModalControls.onOpen();
      }
   };

   /* 2021-10-27: we're putting an id here to stop chakraUI / popover from complaining about IDs not matching.
   * other than that it serves no purpose, and never will.
   * see https://github.com/chakra-ui/chakra-ui/issues/3020
   */
   return (
      <Tabs
         onChange={(index) => setState_tabIndex(index)}
         index={state_tabIndex}
         ref={ref}
         id="productDescriptionTabs"
         variant="enclosed"
         className={`${tabStyles.container} ${styles.descriptionTabs}`}
      >
         <TabList mb="1em" className="blueHeader">
            <Tab>Description</Tab>
            <Tab>Shipping/Production</Tab>
            <Tab>Reviews</Tab>
         </TabList>

         <TabPanels>
            <TabPanel className={styles.description}>
               <div dangerouslySetInnerHTML={{__html: props.product.descrip}}></div>
            </TabPanel>
            <TabPanel className={styles.shippingProduction}>
               <p className={`darkBlue ${styles.availability}`}>{props.product.customFields.AVAILABILITY || ""}</p>
               <p>
                  This product will be shipped from {props.product.transitState || ""}. See below for transit time (in business days) for Ground Service.
                  {" "}<span className={styles.transitTime}>Transit times do not include order processing time.</span>
                  {" "}See shipping info for details.
               </p>
               {
                  props.product.upsMap && (
                     <Center>
                        <Image src={`https://${props.domain}${props.product.upsMap}`} width="546" height="353" alt="Ground Transit Times" />
                     </Center>
                  )
               }
            </TabPanel>
            <TabPanel className={styles.reviews}>
               {
                  props.product.reviews && (
                     <Fragment>
                        <Table variant="simple" size="sm">
                           <Tbody>
                              <Tr>
                                 <Td className="darkerBlue">Total Reviews:</Td>
                                 <Td className="darkerBlue">{props.product.reviews.total}</Td>
                                 <Td rowSpan={2}>
                                    <Link href="/">Write a review</Link>
                                    {" "}and share your thoughts with other customers.
                                 </Td>
                              </Tr>
                              <Tr>
                                 <Td className="darkerBlue">Average Rating:</Td>
                                 <Td>
                                    <ReviewStars domain={props.domain} stars={props.product.reviews.average} />
                                 </Td>
                              </Tr>
                           </Tbody>
                        </Table>

                        {
                           [0,1,2,3,4].map(i=>{
                              // console.log("i",i);
                              // console.log(`props.product.reviews.reviews[${i}]`,props.product.reviews.reviews[i]);
                              if ( props.product.reviews.reviews[i] ) {
                                 return (
                                    <Review
                                       key={i}
                                       code={props.product.code}
                                       domain={props.domain}
                                       review={props.product.reviews.reviews[i]}
                                       setImageData={props.setImageData}
                                    />
                                 );
                              } else {
                                 return "";
                              }
                           })
                        }

                        {
                           props.product.reviews.total > 5 && (
                              <Fragment>
                                 <motion.button
                                    onClick={showMoreReviews}
                                    variants={{
                                       open: { opacity: 1, height: "auto" },
                                       collapsed: { opacity: 0, height: 0, overflow:"hidden", margin: 0, padding: 0, width: 0 }
                                    }}
                                    transition={{ duration: .8, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    initial="open"
                                    exit="open"
                                    animate={buttonControls}
                                    style={{fontWeight: "bold"}}
                                 >
                                    (show more)
                                 </motion.button>

                                 <motion.div
                                    variants={{
                                       open: { opacity: 1, height: "auto", margin: 0, padding: 0 },
                                       collapsed: { opacity: 0, height: 0, overflow:"hidden" }
                                    }}
                                    transition={{ duration: .8, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    initial="collapsed"
                                    exit="collapsed"
                                    animate={reviewBoxControls}
                                 >
                                    {
                                       [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(i=>{
                                          if ( props.product.reviews.reviews[i] ) {
                                             return <Review key={i} code={props.product.code} domain={props.domain} review={props.product.reviews.reviews[i]} />;
                                          } else {
                                             return "";
                                          }
                                       })
                                    }
                                 </motion.div>
                              </Fragment>
                           )
                        }

                        {
                           props.product.reviews.total > 20 &&
                           <Fragment>
                              <Button
                                 colorScheme="blue"
                                 rightIcon={<FaRegClone />}
                                 style={{marginTop:"20px"}}
                                 onClick={showReviews}
                              >
                                 View all {props.product.reviews.total} reviews
                                 <p className="chakraUI_buttonIconSeparator_right"></p>
                              </Button>

                              <Modal
                                 isOpen={reviewsModalControls.isOpen}
                                 onClose={reviewsModalControls.onClose}
                                 scrollBehavior="inside"
                                 size="6xl"
                              >
                                 <ModalOverlay />
                                 <ModalContent>
                                    <ModalHeader>All Reviews</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                       <p>
                                          All Reviews for
                                          <Link href={`/page/FF/PROD/${props.product.code}`}>
                                             <a className={styles.prodLink}>
                                                {props.product.strippedName}
                                             </a>
                                          </Link>
                                       </p>
                                       {
                                          state_allReviews && (
                                             <AllReviews
                                                domain={props.domain}
                                                reviews={state_allReviews}
                                                code={props.product.code}
                                                paginateAt={50}
                                                modal={true}
                                             />
                                          )
                                       }

                                    </ModalBody>

                                    <ModalFooter>
                                       <Button colorScheme="blue" mr={3} onClick={reviewsModalControls.onClose}>
                                          Close
                                       </Button>
                                    </ModalFooter>
                                 </ModalContent>
                              </Modal>
                           </Fragment>
                        }
                     </Fragment>
                  )
               }
            </TabPanel>
         </TabPanels>
      </Tabs>
   );
});

export default Description;