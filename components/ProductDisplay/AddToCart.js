import {Fragment,useState,useEffect,useCallback} from "react";
import { FaCartPlus,FaBoxOpen,FaPaintBrush } from 'react-icons/fa';
import {
   Box,
   Stack,
   Button,
   Icon
} from "@chakra-ui/react";

//import QuantityInput from "./QuantityInput";
import {default as QuantityInput} from "../QuantityEdit/Input";
import QuantityDropdown from "../QuantityEdit/QuantityDropdown";
import ChooseSeparateOptions from "./ChooseSeparateOptions";
import { openMiscModal } from "../../utilities";

import styles from "../../styles/product.module.scss";

const AddToCart = props => {
   const [state_quantity,setState_quantity] = useState(props.quantity);
   const [state_disabled,setState_disabled] = useState(props.disabled);
   const [state_inputType,setState_inputType] = useState("input");

   //console.log("AddToCart rendering, props:",props);
   let {
      quantity,
      minimum
   } = props;

   useEffect(()=>{
      setState_quantity(quantity);
   },[quantity]);

   useEffect(()=>{
      if ( minimum.quantityIncrement ) {
         setState_inputType("dropdown");
      } else {
         setState_inputType("input");
      }
   },[minimum]);

   let handleQuantityChange = eventOrVal => {
      //console.log("handleQuantityChange, eventOrVal:", eventOrVal);
      if ( eventOrVal ) {
         let quantity = eventOrVal.target ? eventOrVal.target.value : eventOrVal;
         props.quantityRef.current = quantity;
         setState_quantity(quantity);
      }
   }; // handleQuantityChange

   let handleQuantityValidityChange = useCallback(isValid => {
      // console.log("handleQuantityValidityChange isvalid:",isValid);
      setState_disabled(!isValid);
   },[]);

   let handlePersonalizeClick = event => {
      event.preventDefault();
      openMiscModal({
         setModal: props.setMiscModal,
         disclosure: props.miscModalDisclosure,
         title: "word",
         size: "4xl",
         content: (
            <ChooseSeparateOptions
               quantity={state_quantity}
               renderAttributes={props.renderAttributes}
               handleSubmit={props.handleSubmit}
               renderSpinner={props.renderSpinner}
            />
         )
      });
   }; // handlePersonalizeClick

   let renderQuantity = () => {
      if ( state_inputType === "input" ) {
         return (
            <QuantityInput
               quantity={state_quantity}
               onChange={handleQuantityChange}
               minimum={props.minimum.prodMin}
               enforceMinimum={props.enforceMinimum}
               samplesPermitted={props.samplesPermitted}
               onValidityChange={handleQuantityValidityChange}
               showLabel={true}
            />
         );
      } else {
         return (
            <QuantityDropdown
               quantity={state_quantity}
               onChange={handleQuantityChange}
               minimum={props.minimum}
               enforceMinimum={props.enforceMinimum}
               samplesPermitted={props.samplesPermitted}
               isValid={props.isValid}
               placeholder="Quantity"
            />
         );
      }
   }; // renderQuantity
   let renderAddToCart = () => {
      return (
         <Button
            type="submit"
            leftIcon={<Icon as={FaCartPlus} color="black" />}
            className="mediumBlueButton_Horizontal"
            width="100%"
            form={props.formID}
            disabled={state_disabled}
         >
            Add To Cart
         </Button>
      );
   }; // renderAddToCart
   let renderOrderSample = () => {
      return (
         <Button
            type="submit"
            leftIcon={<Icon as={FaBoxOpen} color="black" />}
            width="100%"
            form={props.formID}
            disabled={state_disabled}
         >
            Order 1 Sample
         </Button>
      );
   }; // renderOrderSample
   let renderPersonalizeSeparately = () => {
      return (
         <Button
            leftIcon={<Icon as={FaPaintBrush} color="black" />}
            className="mediumBlueButton_Horizontal"
            width="100%"
            disabled={state_disabled}
            onClick={handlePersonalizeClick}
         >
            Personalize It
         </Button>
      );
   };

   let mainStyle = {padding:"4px"};
   if ( !props.offerSeparateOptions ) {
      mainStyle.borderTop = "1px solid #C5DBEC";
   }

   return (
      props.samplesPermitted ? (
         <Box
            style={mainStyle}
         >
            <Box
               width={"90%"}
               className={styles.bigQuantity}
            >
               {renderQuantity()}
            </Box>
            <Stack
               direction={["column", "column", "row"]}
               spacing="5px"
            >
               <Box w={["100%","100%","50%"]} className="darkBlue">
                  {renderOrderSample()}
               </Box>
               <Box
                  width={["100%","100%","50%"]}
               >
                  { props.offerSeparateOptions ? renderPersonalizeSeparately() : renderAddToCart() }
               </Box>
            </Stack>
         </Box>
      ) : (
         <Stack
            direction={["column", "column", "row"]}
            spacing="5px"
            style={{borderTop: "1px solid #C5DBEC", padding:"4px"}}
         >
            <Box w={["100%","100%","50%"]} className="darkBlue">
               {renderQuantity()}
            </Box>
            <Box
               width={["100%","100%","50%"]}
            >
               { props.offerSeparateOptions ? renderPersonalizeSeparately() : renderAddToCart() }
            </Box>
         </Stack>
      )
   );
};

export default AddToCart;