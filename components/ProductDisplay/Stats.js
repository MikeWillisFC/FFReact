import {Fragment} from "react";
import axios from "axios";
import Image from 'next/image';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Icon,
  Center
} from "@chakra-ui/react"

import ReviewStars from "./ReviewStars";
import ShippingProduction from "./ShippingProduction";
import DeliveryEstimate from "./DeliveryEstimate";

import { openMiscModal,scrollTo } from "../../utilities";

const Stats = props => {

   let handleFRShipping = async (event) => {
      event.preventDefault();
      openMiscModal({
         setModal: props.setMiscModal,
         disclosure: props.miscModalDisclosure,
         title: "Promotion Details",
         href: event.currentTarget.getAttribute("href"),
         size: "2xl"
      });
   };

   let showShippingInfo = () => {
      props.setMiscModal({
         title: "Estimated Transit Map",
         content: <ShippingProduction styles={props.styles} globalConfig={props.globalConfig} manufacturer={props.product.customFields.MANUFACTURER} availability={props.product.customFields.AVAILABILITY} />,
         size: "2xl"
      });
      props.miscModalDisclosure.onOpen();
   }; // showShippingInfo

   let renderEstimatedDelivery = () => {
      let shipsOnOrAboutDisclaimer = "This refers to the date the item will leave our warehouse. For a transit time estimate, click on the 'more shipping info' link.";

      let handleShipsOnOrAboutClick = () => {
         props.setMiscModal({
            title: "Shipping Notes",
            content: shipsOnOrAboutDisclaimer,
            size: "2xl"
         });
         props.miscModalDisclosure.onOpen();
      }; // handleShipsOnOrAboutClick

      if ( !props.globalConfig.estDelivery || !props.product.customFields.estimatedDeliveryDate ) {
         return (
            <Fragment>
               <Tr>
                  <Td>Availability</Td>
                  <Td>
                     {
                        !props.product.customFields.shipsOnOrAbout ||
                        !props.product.customFields.isGlassware ||
                        props.product.customFields.personalizationType !== 'Fashioncraft - Glassware' ?
                           <Fragment>{props.product.customFields.AVAILABILITY}</Fragment>
                        : <Fragment>
                           <span className="prodAvailability">Ships<a style={{cursor:"pointer"}} onClick={handleShipsOnOrAboutClick} title={shipsOnOrAboutDisclaimer}>*</a> on or about {props.product.customFields.shipsOnOrAbout}</span>
                        </Fragment>
                     }
                     <a style={{fontSize:".7em"}} onClick={showShippingInfo}>more shipping info</a>
                  </Td>
               </Tr>
               <Tr>
                  <Td>Transit Time</Td>
                  <Td>
                     <a onClick={showShippingInfo}>Transit Map</a>
                  </Td>
               </Tr>
            </Fragment>
         );
      } else {
         return (
            <Tr>
               <Td>Estimated Delivery</Td>
               <Td>
                  <b>{props.product.customFields.estimatedDeliveryDate}</b>
                  <DeliveryEstimate
                     miscModalDisclosure={props.miscModalDisclosure}
                     setMiscModal={props.setMiscModal}
                     prodCode={props.product.code}
                  />
               </Td>
            </Tr>
         );
      }
   }; // renderEstimatedDelivery

   return (
      <Box className={props.styles.stats}>
         <Table variant="simple">
            <Tbody>
               <Tr>
                  {
                     props.product.volPrices && props.product.volPrices !== "none" && props.product.volPrices.length ?
                        <Td colSpan="2">
                           <Table className={props.styles.priceTable} variant="simple">
                              <Tbody>
                                 <Tr>
                                    <Td>QTY</Td>
                                    {
                                       props.product.volPrices.map((price,index)=>{
                                          return (
                                             <Td
                                                key={`qIndex${index}|${price.low}-${price.high}`}
                                             >
                                                {
                                                   price.low === price.high ? price.low : `${price.low} - ${price.high}`
                                                }
                                             </Td>
                                          )
                                       })
                                    }
                                 </Tr>
                                 <Tr>
                                    <Td><b>Price</b></Td>
                                    {
                                       props.product.volPrices.map((price,index)=>{
                                          return (
                                             <Td
                                                key={`pIndex${index}|${price.amount}`}
                                             >
                                                ${price.amount}
                                             </Td>
                                          );
                                       })
                                    }
                                 </Tr>
                              </Tbody>
                           </Table>
                        </Td>
                     : <Fragment>
                        <Td>Price</Td>
                        <Td><b>${props.product.price}</b></Td>
                     </Fragment>
                  }
               </Tr>
               <Tr>
                  <Td>Item Number</Td>
                  <Td><b>{props.product.code}</b></Td>
               </Tr>
               {
                  props.product.customFields.reviewAverage !== "" &&
                  <Tr>
                     <Td>Customer Rating</Td>
                     <Td className={props.styles.rating}>
                        <div
                           style={{cursor:"pointer"}}
                           onClick={event=>{
                              event.preventDefault(); // actually there is no default but whatever
                              scrollTo(props.descriptionRef);
                              props.setTabIndex(2);
                           }}
                        >
                           <ReviewStars domain={props.globalConfig.domain} stars={props.product.reviews.average} />
                           {" "}read {props.product.customFields.reviewTotal}
                        </div>
                     </Td>
                  </Tr>
               }
               <Tr>
                  <Td>Weight</Td>
                  <Td><b>{props.product.weight} lbs</b></Td>
               </Tr>
               {renderEstimatedDelivery()}
               <Tr>
                  <Td>Flat Rate Shipping</Td>
                  <Td>
                     {
                        props.product.customFields.freeShipping ?
                           <Fragment>
                              yes
                           </Fragment>
                        : <a
                           href={`https://${props.globalConfig.domain}/includes/ajax/freeShipping.php?unvbl=1`}
                           onClick={handleFRShipping}
                           style={{display:"inline-block",width:"100%"}}
                          >
                           <Image src={`https://${props.globalConfig.domain}/images/misc/redX.png`} width="14" height="11" alt="X" />
                           {" "} unavailable
                        </a>
                     }
                  </Td>
               </Tr>
            </Tbody>
         </Table>
      </Box>
   );
};

export default Stats;