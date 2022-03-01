import {useState,Fragment} from "react";
import { FaShippingFast,FaCalculator } from 'react-icons/fa';
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import {
   Box,
   Input,
   InputGroup,
   InputLeftAddon,
   Button,
   Stack,
   Tooltip,
   Skeleton,
   SkeletonCircle,
   SkeletonText,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td
} from '@chakra-ui/react';

import {messagesActions} from "../../store/slices/messages";
import {formatPrice,openMiscModal,isZipUSorCA,getStateByZip,getProvinceCode,parseMessages} from "../../utilities";

import tooltipStyles from "../../styles/chakra/tooltip.module.scss";
import styles from "../../styles/estimateShipping.module.scss";

const EstimateShipping = props => {
   const [st_isValid,sst_isValid] = useState(null);
   const [st_zip,sst_zip] = useState("");
   const [st_loading,sst_loading] = useState(false);
   const [st_rates,sst_rates] = useState(false);

   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const dispatch = useDispatch();

   let validateZip = () => {
      if ( isZipUSorCA( st_zip ) ) {
         // yay
         sst_isValid( true );
         return true;
      } else {
         sst_isValid( false );
         return false;
      }
   };

   let handleKeyUp = event => {
      if ( event.key === 'Enter' || event.keyCode === 13 ) {
         event.preventDefault();
         calcShipping();
      } else if ( st_isValid === false ) {
         validateZip();
      }
   }; // handleKeyUp

   let calcShipping = async (event=false) => {
      if ( event ) { event.preventDefault(); }
      if ( validateZip() ) {
         console.log("calculating shipping");
         let zip = st_zip.replace( /\s/g, "" ).trim();
         let shipState = getStateByZip( zip );
         let shipCountry;

         if ( shipState !== "CANADA" ) {
            if ( shipState !== "PR" ) {
               shipCountry = "US";
            } else {
               shipCountry = "PR";
            }
         } else {
            shipState = getProvinceCode( zip );
            shipCountry = "CA";
            zip = zip.substr( 0, 3 ) + " " + zip.substr( 3, 3 );
         }

         console.log("zip",zip);
         console.log("shipState",shipState);
         console.log("shipCountry",shipCountry);
         console.log("props.singleSupplier",props.singleSupplier);

         const headers = { 'Content-Type': 'multipart/form-data' };
         let bodyFormData = new FormData();

         bodyFormData.set( "cAction", "estimateShipping" );
         //bodyFormData.set( "Screen", "CALCSHIPPING" );
         bodyFormData.set( "Store_Code", "FF" );
         bodyFormData.set( "calcship", "1" );

         bodyFormData.set( "ShipZip", zip );
         bodyFormData.set( "shipstate", shipState );
         bodyFormData.set( "shipcountry", shipCountry );
         //bodyFormData.set( "Session_ID", st_zip );
         bodyFormData.set( "singleSupplier", props.singleSupplier );

         sst_loading( true );
         dispatch(messagesActions.clearMessages());
         const response = await axios.post( globalConfig.apiEndpoint, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         sst_loading( false );
         if ( response.status ) {
            if ( response.status === 200 ) {
               parseMessages(response.data,dispatch,messagesActions);
               sst_loading( false );
               console.log("response",response);
               sst_rates(response.data.rates);
            }
         }

      }
   }; // calcShipping

   let chooseRate = rate => {
      props.miscModalDisclosure.onClose();
      props.setShipping( rate );
   }; // chooseRate

   let style = st_isValid === false ? {borderColor:"#f00"} : {};

   return (
      <Box>
         <Stack
            direction={['column','column','row']}
            spacing='5px'
            style={{marginBottom:"20px"}}
         >
            <Box>
               <Tooltip
                  hasArrow
                  label="Please enter a valid US or Canada zip code"
                  className={tooltipStyles.tooltip}
                  isOpen={st_isValid === false}
                  data-status="error"
               >
                  <InputGroup width="100%" style={style}>
                     <InputLeftAddon>Zip/Postal Code:</InputLeftAddon>
                     <Input
                        value={st_zip}
                        onKeyUp={handleKeyUp}
                        onChange={event=>{sst_zip(event.target.value)}}
                     />
                  </InputGroup>
               </Tooltip>
            </Box>
            <Box>
               <Button
                  leftIcon={<FaCalculator />}
                  size="md"
                  colorScheme="blue"
                  onClick={calcShipping}
               >
                  Calculate Shipping
               </Button>
            </Box>
         </Stack>

         {
            st_loading && (
               <Stack>
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
                  <Skeleton height='20px' />
               </Stack>
            )
         }

         {
            st_rates && !st_loading && (
               <Table
                  className={styles.grid}
                  width={["100%","100%","80%"]}
                  marginLeft={["0px","0px","auto"]}
                  marginRight={["0px","0px","auto"]}
               >
                  {
                     st_rates.filter(rate=>rate.name!=="a").map((rate,index)=>{
                        return (
                           <Tr key={`${rate}|${index}`}>
                              <Td className="darkBlue">{rate.name}</Td>
                              <Td>{formatPrice(rate.price)}</Td>
                              <Td>
                                 <Button
                                    leftIcon={<FaShippingFast />}
                                    size="md"
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={event=>chooseRate(rate.price)}
                                 >
                                    Select
                                 </Button>
                              </Td>
                           </Tr>
                        )
                     })
                  }
               </Table>
            )
         }

      </Box>
   )
};

export default EstimateShipping;