import {Fragment,useState,useEffect} from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
   Box,
   Input,
   Button,
   Popover,
   PopoverTrigger,
   PopoverContent,
   PopoverHeader,
   PopoverBody,
   PopoverFooter,
   PopoverArrow,
   PopoverCloseButton,
   Stack,
   Skeleton,
   SkeletonCircle,
   SkeletonText,
   Table,
   Thead,
   Tbody,
   Tfoot,
   Tr,
   Th,
   Td,
   TableCaption
} from "@chakra-ui/react";

import {isZipUSorCA} from "../../utilities";

import styles from "../../styles/deliveryEstimate.module.scss";

const DeliveryEstimate = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [state_zip, setState_zip] = useState("");
   const [state_zipInvalid,setState_zipInvalid] = useState(false);
   const [state_zipPopoverOpen,setState_zipPopoverOpen] = useState(false);

   let validateZip = (val=false) => {
      if ( val.trim() ) {
         let isValid = isZipUSorCA(val.trim());
         setState_zipInvalid( !isValid );
         setState_zipPopoverOpen( !isValid );
         return isValid;
      } else {
         setState_zipInvalid( true );
         setState_zipPopoverOpen( true );
         return false;
      }
   };

   let handleZipChange = event => {
      setState_zip(event.target.value);
   };

   let handleZipBlur = event => {
      setState_zip(zip=>{
         if ( zip.length >= 5 ) {
            validateZip(zip);
         }
         return zip;
      });
   };

   let renderDeliveryDates = dates => {
      let disclaimer = (
         <p>Please note: the dates displayed here are estimates. If you must receive your order by a specific date, please let us know by filling in the &quot;comments&quot; field during checkout.</p>
      );

      if ( dates === "pending" ) {
         return (
            <Fragment>
               <Stack>
                  <Skeleton height="25px" />
                  <Skeleton height="25px" />
                  <Skeleton height="25px" />
                  <Skeleton height="25px" />
                  <Skeleton height="25px" />
               </Stack>
               {disclaimer}
            </Fragment>
         )
      } else {
         return (
            <Fragment>
               <Table
                  size="sm"
                  variant="simple"
                  colorScheme="twitter"
                  className={styles.results}
               >
                  <Thead>
                     <Tr>
                        <Th>Shipping Method</Th>
                        <Th>Estimated Arrival Date</Th>
                     </Tr>
                  </Thead>
                  <Tbody>
                     {
                        dates.map(date=>{
                           return (
                              <Tr key={date.name}>
                                 <Td>{date.name}</Td>
                                 <Td>{date.arrivalDate}</Td>
                              </Tr>
                           )
                        })
                     }
                  </Tbody>
               </Table>
               {disclaimer}
            </Fragment>
         )
      }
   }; // renderDeliveryDates

   let getDates = async () => {
      const headers = { 'Content-Type': 'multipart/form-data' };
      let bodyFormData = new FormData();
      bodyFormData.set( "code", props.prodCode );
      bodyFormData.set( "to", state_zip );
      bodyFormData.set( "deliveryDateIncludeTags", "" );

      //console.log("globalConfig",globalConfig);
      let response = await axios.post( `https://${globalConfig.apiDomain}/api/get/deliveryDate.php`, bodyFormData, {
         headers: headers,
         withCredentials: true
      });

      return response;
   }; // getDates

   let handleSubmit = async (event) => {
      event.preventDefault();
      if ( !state_zipInvalid ) {
         if ( validateZip(state_zip.trim()) ) {
            props.setMiscModal({
               title: "Estimated Delivery Date",
               content: renderDeliveryDates("pending"),
               size: "xl"
            });
            props.miscModalDisclosure.onOpen();

            let response = await getDates();

            //console.log("response",response);
            if ( response.status ) {
               //console.log("response.data",response.data);
               props.setMiscModal({
                  title: "Estimated Delivery Date",
                  content: renderDeliveryDates(response.data.methods),
                  size: "xl"
               });
            }
         } else {
            //console.log("not submitting B");
         }
      } else {
         //console.log("not submitting A");
      }
   }; // handleSubmit

   return (
      <div className={styles.form}>
         <Popover
            returnFocusOnClose={false}
            isOpen={state_zipPopoverOpen}
            onClose={()=>setState_zipPopoverOpen(false)}
            placement="right"
            closeOnBlur={false}
            id="prodDeliveryZipPopover"
            isLazy
         >
            <PopoverTrigger>
               <Input
                  name="zip"
                  variant="outline"
                  size="xs"
                  placeholder="Zip Code"
                  val={state_zip}
                  onChange={handleZipChange}
                  onBlur={handleZipBlur}
                  width="100px"
                  bgColor="#fff"
                  isInvalid={state_zipInvalid}
                  errorBorderColor="red.300"
               />
            </PopoverTrigger>
            <PopoverContent
               className={styles.popover}
            >
               <PopoverArrow />
               <PopoverCloseButton />
               <PopoverHeader>Error</PopoverHeader>
               <PopoverBody className={styles.body}>It looks like this is not a valid zip code</PopoverBody>
            </PopoverContent>
         </Popover>

         <Button
            colorScheme="twitter"
            size="xs"
            onClick={handleSubmit}
         >
            Get Improved Estimate
         </Button>
      </div>
   );
};

export default DeliveryEstimate;