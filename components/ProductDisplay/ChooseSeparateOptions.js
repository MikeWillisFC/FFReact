import {Fragment,useState,useEffect,useCallback} from "react";
import { FaFileExport } from 'react-icons/fa';
import {
   Box,
   Radio,
   RadioGroup,
   Stack,
   Button,
   Icon,
   Flex,
   Spacer
} from "@chakra-ui/react";

import Attributes from "../../components/ProductDisplay/Attributes";

import styles from "../../styles/product.module.scss";

const ChooseSeparateOptions = props => {
   const [st_optionMethod,sst_optionMethod] = useState("");
   const [st_workingOn,sst_workingOn] = useState(1);
   const [st_lastOne,sst_lastOne] = useState(false);
   const [st_posting,sst_posting] = useState(false);
   const [st_quantity,sst_quantity] = useState(props.quantity);

   console.log("ChooseSeparateOptions props:",props);

   let {
      handleSubmit
   } = props;

   useEffect(()=>{
      if ( st_workingOn === parseInt(st_quantity) ) {
         sst_lastOne(true);
      } else {
         sst_lastOne(false);
      }
   },[st_workingOn,st_quantity]);

   let handleUseOptions = useCallback(async (event) => {
      let goToBasket = st_lastOne || st_optionMethod === "same";
      let quantityOverride = st_optionMethod === "separate" ? 1 : false;
      let returnResult = !st_lastOne;
      sst_posting(true);
      let addResult = await handleSubmit(event,goToBasket,quantityOverride,returnResult);
      console.log("addResult",addResult);
      if ( addResult ) {
         sst_posting(false);
         sst_workingOn(prevState=>{
            console.log("setting st_workingOn from '" + prevState + "' to '" + ( prevState + 1 ) + "'");
            return prevState + 1;
         });
      }
   },[
      st_lastOne,
      st_optionMethod,
      handleSubmit
   ]);

   let formStyle = {};
   if ( !st_optionMethod ) {
      formStyle.pointerEvents = "none";
      formStyle.opacity = 0.2;
   }

   return (
      <Box className={styles.separateOptions}>
         <RadioGroup
            onChange={sst_optionMethod}
            value={st_optionMethod}
            className={styles.radio}
         >
            <Stack direction='column'>
               <Radio value="separate">Choose options for item <b>{st_workingOn}</b> of <b>{st_quantity}</b></Radio>
               <Radio value="same">Use the same options for <b>{st_quantity}</b> item(s)</Radio>
            </Stack>
         </RadioGroup>

         <Box className={styles.form} style={formStyle}>
            <Box>
               {props.renderAttributes()}
            </Box>

            <Flex>
               <Spacer />
               <Box
                  width={["100%","100%","50%"]}
                  textAlign={["center","center","right"]}
                  className={styles.nowPersonalizing}
               >
                  {
                     st_optionMethod === "same" ? (
                        <Fragment>Now personalizing all items</Fragment>
                     ) : (
                        <Fragment>Now personalizing item <b>{st_workingOn}</b> of <b>{st_quantity}</b></Fragment>
                     )
                  }

                  <br />
                  {
                     !st_posting ? (
                        <Button
                           leftIcon={<Icon as={FaFileExport} color="black" />}
                           className="mediumBlueButton_Horizontal"
                           width="100%"
                           onClick={handleUseOptions}
                        >
                           {
                              st_optionMethod === "same" ? (
                                 <Fragment>Use these options for all items and continue</Fragment>
                              ) : (
                                 !st_lastOne ? (
                                    <Fragment>Use these options for item {st_workingOn}</Fragment>
                                 ) : (
                                    <Fragment>Use these options for the final item and continue</Fragment>
                                 )
                              )
                           }
                        </Button>
                     ) : (
                        props.renderSpinner("md","0px 0px")
                     )
                  }
               </Box>
            </Flex>
         </Box>
      </Box>
   )
};

export default ChooseSeparateOptions;