import {Fragment,useState,useEffect} from "react";
import {
   ModalHeader,
   ModalFooter,
   ModalBody,
   Button,
   Box,
   Checkbox
} from "@chakra-ui/react";

import DatePicker from "../DatePicker";

import styles from "../../styles/checkout.module.scss";

const ShippingInformation = props => {
   const [state_understand,setState_understand] = useState(false);
   const [state_date,setState_date] = useState(false);
   const [state_understandClassName,setState_understandClassName] = useState("");
   const [state_dateClassName,setState_dateClassName] = useState("");

   useEffect(()=>{
      if ( state_understand ) {
         setState_understandClassName( "" );
      } else {
         setState_understandClassName( styles.invalid );
      }
      if ( state_date ) {
         setState_dateClassName( "" );
      } else {
         setState_dateClassName( styles.invalid );
      }
   },[state_understand,state_date]);

   let handleClose = () => {
      if ( state_understand && state_date ) {
         props.setShippingInfo({
            understand: state_understand,
            needsBy: state_date
         });
         props.onClose();
      } else {
         if ( !state_understand ) {
            setState_understandClassName( styles.invalid );
         }
         if ( !state_date ) {
            setState_dateClassName( styles.invalid );
         }
      }
   };

   return (
      <Box className={styles.shippingInformation}>
         <ModalHeader>Shipping Information</ModalHeader>
         <ModalBody className={styles.message}>
            <p>Expedited Shipping refers ONLY to the UPS Transit Time once the goods leave the warehouse. It does NOT include the production or processing time.</p>

            <p>Normal processing time is 1-2 business days. Orders that include any form of personalization take longer. Please refer to the item page for details.</p>

            <Checkbox
               checked={state_understand}
               onChange={event=>setState_understand(event.target.checked)}
               width="100%"
               className={state_understandClassName}
            >
               I Understand
            </Checkbox>

            <DatePicker
               className={state_dateClassName}
               placeholderText="When do you need this order?"
               selected={state_date}
               onChange={(date) =>setState_date(date)}
               dateFormat="M/d/yyyy"
            />
         </ModalBody>

         <ModalFooter>
            <Button
               colorScheme="blue"
               mr={3}
               onClick={handleClose}
               size="lg"
               className={(state_understand && state_date ? "" : styles.disabledButton)}
            >
               OK
            </Button>
         </ModalFooter>
      </Box>
   );
};

export default ShippingInformation;