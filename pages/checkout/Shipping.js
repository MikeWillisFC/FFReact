import {Fragment,useState,useEffect,useCallback} from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import {
   Box,
   Center,
   Button,
   Checkbox,
   Spinner,
   Flex,
   Radio,
   RadioGroup,
   Stack,
   Grid,
   GridItem,
   Modal,
   ModalOverlay,
   ModalContent,

   useDisclosure
} from "@chakra-ui/react";

const store = require('store'); // https://github.com/marcuswestin/store.js, for full localStorage support

import AddressForm from "../../components/Checkout/AddressForm";
import Field from "../../components/Checkout/Field";
import ShippingInformation from "../../components/Checkout/ShippingInformation";
import {messagesActions} from "../../store/slices/messages";
import {formatPrice,parseMessages} from "../../utilities";

import styles from "../../styles/checkout.module.scss";

const Shipping = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   const dispatch = useDispatch();

   const [state_billingAddress,setState_billingAddress] = useState({});
   const [state_shippingAddress,setState_shippingAddress] = useState({});
   const [state_states,setState_states] = useState({});
   const [state_countries,setState_countries] = useState({});
   const [state_showShipping,setState_showShipping] = useState(false);
   const [state_getRatesAddressType,setState_getRatesAddressType] = useState(false);
   const [state_billingAddressValid,setState_billingAddressValid] = useState(false);
   const [state_shippingAddressValid,setState_shippingAddressValid] = useState(false);
   const [state_rateAddress,setState_rateAddress] = useState(false);
   const [state_shippingMethods,setState_shippingMethods] = useState([]);
   const [state_paymentMethods,setState_paymentMethods] = useState([]);
   const [state_paymentMethod,setState_paymentMethod] = useState("");
   const [state_shippingMethod,setState_shippingMethod] = useState("");
   const [state_mainFormValid,setState_mainFormValid] = useState(false);
   const [state_expeditedShippingInfo,setState_expeditedShippingInfo] = useState(false);
   const [state_additionalInfo,setState_additionalInfo] = useState({
      paymentMethod:"",
      residentialAddress: "",
      confirmationSignature: "",
      comments: ""
   });

   const router = useRouter();

   const shippingAddressControls = useAnimation();
   const shippingProceedControls = useAnimation();
   const shippingLoadingControls = useAnimation();

   const expeditedShippingModal = useDisclosure();

   let getAddresses = useCallback(async () => {
      // console.log("getAddresses called");
      dispatch(messagesActions.clearMessages());
      let response = await axios.get(`${globalConfig.apiEndpoint}&cAction=getAddresses`,
         {
            withCredentials: true
         }
      );
      // console.log("getAddresses response",response);
      if ( response ) {
         parseMessages(response.data,dispatch,messagesActions);
         if ( response.status ) {
            setState_billingAddress( response.data.addresses.billing );
            setState_shippingAddress( response.data.addresses.shipping );
         }
      }
   },[globalConfig.apiEndpoint,dispatch]); // getAddresses

   let getStates = useCallback(async () => {
      dispatch(messagesActions.clearMessages());
      let response = await axios.get(`${globalConfig.apiEndpoint}&cAction=getStates`,
         {
            withCredentials: true
         }
      );
      //console.log("response",response);
      if ( response ) {
         parseMessages(response.data,dispatch,messagesActions);
         //console.log("response.data",response.data);
         if ( response.status ) {
            setState_states( response.data.states );
            setState_countries( response.data.countries );
         }
      }
   },[globalConfig.apiEndpoint,dispatch]); // getAddresses

   let {setNavVisibility} = props;
   useEffect(()=>{
      getAddresses();
      getStates();
      setNavVisibility(false);
   },[getAddresses,getStates,setNavVisibility]);

   useEffect(()=>{
      // console.log("shippingAddressControls",shippingAddressControls);
      if ( state_showShipping ) {
         shippingAddressControls.start("open");
      } else {
         shippingAddressControls.start("collapsed");
      }
   },[state_showShipping,shippingAddressControls]);

   useEffect(()=>{
      let waitASec = setTimeout(()=>{
         console.log("ADDRESS VALIDITY CHANGE");
         // console.log("- state_billingAddressValid",state_billingAddressValid);
         // console.log("- state_shippingAddressValid",state_shippingAddressValid);
         // console.log("- state_billingAddress",state_billingAddress);
         // console.log("- state_shippingAddress",state_shippingAddress);
         setState_shippingMethod("");
         if ( state_showShipping && state_shippingAddressValid ) {
            // console.log("- using shipping address",state_shippingAddress);
            setState_rateAddress("shipping");
         } else if ( state_billingAddressValid ) {
            // console.log("- using billing address",state_billingAddress);
            setState_rateAddress("billing");
         } else {
            // console.log("- no valid address available");
            setState_rateAddress(false);
            setState_shippingMethods([]);
         }
      },200);

      return ()=>{clearTimeout(waitASec);};
   },[
      state_billingAddressValid,
      state_shippingAddressValid,
      state_billingAddress,
      state_shippingAddress,
      state_showShipping
   ]);

   useEffect(()=>{
      // console.log("MAIN FORM VALIDITY CHANGED");
      // console.log("state_billingAddressValid",state_billingAddressValid);
      // console.log("state_showShipping",state_showShipping);
      // console.log("state_shippingAddressValid",state_shippingAddressValid);
      // console.log("state_shippingMethod",state_shippingMethod);
      // console.log("state_additionalInfo.residentialAddress",state_additionalInfo.residentialAddress);
      // console.log("state_additionalInfo.confirmationSignature",state_additionalInfo.confirmationSignature);
      let valid = true;
      if (
         !state_billingAddressValid ||
         ( state_showShipping && !state_shippingAddressValid ) ||
         !state_shippingMethod ||
         !state_additionalInfo.residentialAddress ||
         !state_additionalInfo.confirmationSignature
      ) {
         valid = false;
      }
      setState_mainFormValid( valid );
      //console.log("valid:",valid);
   },[
      state_billingAddressValid,
      state_shippingAddressValid,
      state_showShipping,
      state_shippingMethod,
      state_additionalInfo.residentialAddress,
      state_additionalInfo.confirmationSignature
   ]);

   useEffect(()=>{
      let ignoredMethods = [ "economy", "smart post", "smartpost", "flat rate", "flat rate shipping", "ground", "glassware", "sample", "free" ];
      //console.log("state_shippingMethod changed to: ",state_shippingMethod);
      let shippingLabel = state_shippingMethod.split("|")[0].toLowerCase();
		if ( state_shippingMethod && !ignoredMethods.includes( shippingLabel ) ) {
         expeditedShippingModal.onOpen();
      }
   },[state_shippingMethod,expeditedShippingModal]);

	// using axios
   // useEffect(()=>{
	// 	console.log("getRates useEffect triggered")
   //    if ( state_rateAddress ) {
   //       const cancelToken = axios.CancelToken;
   //       const source = cancelToken.source();
	// 		console.log("address is available, proceeding with source:",source);

   //       let getRates = async () => {
	// 			console.log("getRates running");
   //          const headers = { 'Content-Type': 'multipart/form-data' };
   //          let bodyFormData = new FormData();
   //          bodyFormData.set( "Action", "ORDR" );
   //          bodyFormData.set( "Store_Code", "FF" );
   //          bodyFormData.set( "responseType", "json" );

   //          let rateAddress;
   //          let fieldNamePrefix;
   //          if ( state_rateAddress === "billing" ) {
   //             rateAddress = state_billingAddress;
   //             fieldNamePrefix = "Bill";
   //          } else {
   //             rateAddress = state_shippingAddress;
   //             fieldNamePrefix = "Ship";

	// 				// we still need to send the billing address or miva will complain
	// 				bodyFormData.set( `BillFirstName`, state_billingAddress.firstName );
	// 				bodyFormData.set( `BillLastName`, state_billingAddress.lastName );
	// 				bodyFormData.set( `BillAddress1`, state_billingAddress.address1 );
	// 				bodyFormData.set( `BillAddress2`, state_billingAddress.address2 );
	// 				bodyFormData.set( `BillZip`, state_billingAddress.zip );
	// 				bodyFormData.set( `BillStateSelect`, state_billingAddress.state );
	// 				bodyFormData.set( `BillCity`, state_billingAddress.city );
	// 				bodyFormData.set( `BillCountry`, state_billingAddress.country );
	// 				bodyFormData.set( `BillPhone`, state_billingAddress.phone );
	// 				bodyFormData.set( `BillEmail`, state_billingAddress.email );
	// 				bodyFormData.set( `BillCompany`, state_billingAddress.company );
   //          }

   //          bodyFormData.set( `${fieldNamePrefix}FirstName`, rateAddress.firstName );
   //          bodyFormData.set( `${fieldNamePrefix}LastName`, rateAddress.lastName );
   //          bodyFormData.set( `${fieldNamePrefix}Address1`, rateAddress.address1 );
   //          bodyFormData.set( `${fieldNamePrefix}Address2`, rateAddress.address2 );
   //          bodyFormData.set( `${fieldNamePrefix}Zip`, rateAddress.zip );
   //          bodyFormData.set( `${fieldNamePrefix}StateSelect`, rateAddress.state );
   //          bodyFormData.set( `${fieldNamePrefix}City`, rateAddress.city );
   //          bodyFormData.set( `${fieldNamePrefix}Country`, rateAddress.country );
   //          bodyFormData.set( `${fieldNamePrefix}Phone`, rateAddress.phone );
   //          bodyFormData.set( `${fieldNamePrefix}Email`, rateAddress.email );
   //          bodyFormData.set( `${fieldNamePrefix}Company`, rateAddress.company );
   //          bodyFormData.set( "AllItems_AllowUSPSFlatRate", "false" );

   //          //bodyFormData.set( `${fieldNamePrefix}asdf`, rateAddress.asdf );
   //          // AllItems_AllowUSPSFlatRate: false
   //          // blockSampleShipping: undefined
   //          // showSampleShipping: undefined

   //          //console.log("globalConfig",globalConfig);
   //          //`${globalConfig.apiEndpoint}&cAction=getBasePrices`
   //          dispatch(messagesActions.clearMessages());
   //          const response = await axios.post( `https://${globalConfig.domain}/mm5/merchant.mvc?Screen=OSEL_AJAX`, bodyFormData, {
   //             headers: headers,
   //             withCredentials: true
   //          });
   //          if ( response ) {
   //             parseMessages(response.data,dispatch,messagesActions);
   //             if ( response.status ) {
   //                console.log("response.data",response.data);
   //                if ( response.data.shippingMethods ) {
   //                   setState_shippingMethods(response.data.shippingMethods);
   //                }
   //                if ( response.data.paymentMethods ) {
   //                   setState_paymentMethods(
   //                      response.data.paymentMethods.map(method=>{
   //                         return {...method,code:`${method.module}:${method.code}`}
   //                      })
   //                   );
   //                }
   //                shippingLoadingControls.start("collapsed");
   //             }
   //          }
   //       }; // getRates

   //       shippingLoadingControls.start("open");
   //       shippingProceedControls.start("collapsed");
   //       setState_shippingMethods([]);

	// 		console.log("calling getRates");
   //       getRates();

   //       return ()=>{
	// 			console.log("getRates useEffect cancelling source:",source);
   //          source.cancel();
   //       };
   //    } else {
   //       shippingLoadingControls.start("collapsed");
   //       shippingProceedControls.start("open");
   //    }
   // },[
   //    globalConfig.domain,
   //    state_rateAddress,
   //    shippingLoadingControls,
   //    shippingProceedControls,
   //    state_billingAddress,
   //    state_shippingAddress,
   //    dispatch
   // ]);

	// using fetch
	useEffect(()=>{
		// console.log("getRates useEffect triggered");
      if ( state_rateAddress ) {
         const controller = new AbortController();
			const signal = controller.signal;
			// console.log("address is available, proceeding with signal:",signal);

         let getRates = async () => {
				// console.log("getRates running");

            const headers = { 'Content-Type': 'multipart/form-data' };

				const formData = new URLSearchParams();
            formData.append( "Action", "ORDR" );
            formData.append( "Store_Code", "FF" );
            formData.append( "responseType", "json" );

            let rateAddress;
            let fieldNamePrefix;
            if ( state_rateAddress === "billing" ) {
               rateAddress = state_billingAddress;
               fieldNamePrefix = "Bill";
            } else {
               rateAddress = state_shippingAddress;
               fieldNamePrefix = "Ship";

					// we still need to send the billing address or miva will complain
					formData.append( `BillFirstName`, state_billingAddress.firstName );
					formData.append( `BillLastName`, state_billingAddress.lastName );
					formData.append( `BillAddress1`, state_billingAddress.address1 );
					formData.append( `BillAddress2`, state_billingAddress.address2 );
					formData.append( `BillZip`, state_billingAddress.zip );
					formData.append( `BillStateSelect`, state_billingAddress.state );
					formData.append( `BillCity`, state_billingAddress.city );
					formData.append( `BillCountry`, state_billingAddress.country );
					formData.append( `BillPhone`, state_billingAddress.phone );
					formData.append( `BillEmail`, state_billingAddress.email );
					formData.append( `BillCompany`, state_billingAddress.company );
            }

            formData.append( `${fieldNamePrefix}FirstName`, rateAddress.firstName );
            formData.append( `${fieldNamePrefix}LastName`, rateAddress.lastName );
            formData.append( `${fieldNamePrefix}Address1`, rateAddress.address1 );
            formData.append( `${fieldNamePrefix}Address2`, rateAddress.address2 );
            formData.append( `${fieldNamePrefix}Zip`, rateAddress.zip );
            formData.append( `${fieldNamePrefix}StateSelect`, rateAddress.state );
            formData.append( `${fieldNamePrefix}City`, rateAddress.city );
            formData.append( `${fieldNamePrefix}Country`, rateAddress.country );
            formData.append( `${fieldNamePrefix}Phone`, rateAddress.phone );
            formData.append( `${fieldNamePrefix}Email`, rateAddress.email );
            formData.append( `${fieldNamePrefix}Company`, rateAddress.company );
            formData.append( "AllItems_AllowUSPSFlatRate", "false" );

            //formData.append( `${fieldNamePrefix}asdf`, rateAddress.asdf );
            // AllItems_AllowUSPSFlatRate: false
            // blockSampleShipping: undefined
            // showSampleShipping: undefined

            //console.log("globalConfig",globalConfig);
            //`${globalConfig.apiEndpoint}&cAction=getBasePrices`
            dispatch(messagesActions.clearMessages());

				const response = await fetch( `https://${globalConfig.domain}/mm5/merchant.mvc?Screen=OSEL_AJAX`, {
					method: 'post',
					body: formData,
					credentials: 'include',
					signal: signal,
				});
				// console.log("fetch response:",response);
            if ( response.ok ) {
					const json = await response.json();
					// console.log("json",json);
               parseMessages(json,dispatch,messagesActions);
               if ( true ) {
                  if ( json.shippingMethods ) {
                     setState_shippingMethods(json.shippingMethods.filter(method=>method.module!=='asdf'));
                  }
                  if ( json.paymentMethods ) {
                     setState_paymentMethods(
                        json.paymentMethods.map(method=>{
                           return {...method,code:`${method.module}:${method.code}`}
                        })
                     );
                  }
                  shippingLoadingControls.start("collapsed");
               }
            }
         }; // getRates

         shippingLoadingControls.start("open");
         shippingProceedControls.start("collapsed");
         setState_shippingMethods([]);

			// console.log("calling getRates");
         getRates();

         return ()=>{
				// console.log("getRates useEffect cancelling signal:",signal);
            controller.abort();
         };
      } else {
         shippingLoadingControls.start("collapsed");
         shippingProceedControls.start("open");
      }
   },[
      globalConfig.domain,
      state_rateAddress,
      shippingLoadingControls,
      shippingProceedControls,
      state_billingAddress,
      state_shippingAddress,
      dispatch
   ]);

   useEffect(()=>{
      if ( state_getRatesAddressType ) {
         const CancelToken = axios.CancelToken;
         const source = CancelToken.source();

         let getRates = async () => {
            console.log("--------------------");
            console.log("getRates called for addressType '" + state_getRatesAddressType + "'");
            console.log("--------------------");
         };
         getRates();

         return ()=>{
            source.cancel();
         };
      }
   },[state_getRatesAddressType]);

   let handleAddressFieldChange = useCallback((field, value, addressType) => {
      // console.log("handleAddressFieldChange called");
      // console.log("--field",field);
      // console.log("--value",value);
      // console.log("--addressType",addressType);

      if ( addressType === "billing" ) {
         setState_billingAddress( prevState=>{
            prevState[field] = value;
            //console.log("prevState",prevState);
            return {...prevState};
         });
      } else if ( addressType === "shipping" ) {
         setState_shippingAddress( prevState=>{
            prevState[field] = value;
            return {...prevState};
         });
      }
   },[]); // handleAddressFieldChange

   let handleAdditionalInfoChange = useCallback((field,value) => {
      setState_additionalInfo( prevState=>{
         prevState[field] = value;
         return {...prevState};
      });
   },[]);

   let handleValidityChange = (form,status) => {
      if ( form === "billing" ) {
         setState_billingAddressValid( status );
      } else if ( form === "shipping" ) {
         setState_shippingAddressValid( status );
      }
   }; // handleValidityChange

   let toggleShippingAddress = () => {
      setState_showShipping(prevState=>!prevState);
   };

   let proceedToShipping = () => {

   }; // proceedToShipping

   let proceedToPayment = async () => {
      // console.log("proceedToPayment clicked");
      if ( !state_mainFormValid ) {
         alert("form not valid");
      } else {
         // console.log("posting");

         const headers = { 'Content-Type': 'multipart/form-data' };
         let bodyFormData = new FormData();
         bodyFormData.set( "maxquestions", "5" );
         bodyFormData.set( "AddendumSave", "4" );
         //bodyFormData.set( "Screen", "OPAY_v2" );
         bodyFormData.set( "Action", "SHIP,PSHP,CTAX" );
         bodyFormData.set( "Store_Code", "FF" );
         bodyFormData.set( "AdvShipping", "0" );
         bodyFormData.set( "ShippingMethod", state_shippingMethod.split("|")[1] );

         bodyFormData.set( "question1", (state_expeditedShippingInfo ? state_expeditedShippingInfo.needsBy : "") );
         bodyFormData.set( "question5", state_additionalInfo.residentialAddress );
         bodyFormData.set( "question4", state_additionalInfo.confirmationSignature === "Yes" ? "1" : "" );
         bodyFormData.set( "question2", state_additionalInfo.comments );

         if ( state_additionalInfo.paymentMethod ) {
            // 2022-04-04: this can only happen if it's me, maybe I'm doing a test order
            // console.log("state_additionalInfo.paymentMethod",state_additionalInfo.paymentMethod);
            bodyFormData.set( "PaymentMethod", state_additionalInfo.paymentMethod );
         } else {
            bodyFormData.set( "PaymentMethod", "authnet:MasterCard" );
         }

         if ( state_paymentMethods.length ) {
            state_paymentMethods.forEach((method,index)=>{
               let count = index + 1;
               bodyFormData.set( `AuthNetCardTypes[${count}]`, `${method.name}|${method.module}:${method.code}` );
            });
         }

         dispatch(messagesActions.clearMessages());
         const response = await axios.post( `https://${globalConfig.domain}/mm5/merchant.mvc?Screen=api_opay`, bodyFormData, {
            headers: headers,
            withCredentials: true
         });
         if ( response ) {
            parseMessages(response.data,dispatch,messagesActions);
            if ( response.status ) {
               // console.log("response.data",response.data);
               if ( !response.data.errorMessages ) {
                  store.set( 'opay', response.data );
                  // console.log("state_billingAddress",state_billingAddress);
                  store.set( "email", state_billingAddress.email );
                  store.set( "zip", state_billingAddress.zip );
                  router.push(`/checkout/Payment`);
               } else {
                  alert("error detected, cannot proceed");
               }
            }
         }
      }
   }; // proceedToPayment

   let checkStyle = {
      backgroundColor:"#fff",
      marginRight:"10px",
      position: "relative",
      top: "1px"
   };

   let residentialAddressValues = [
      {name:"Yes",code:"Yes",value:"Yes"},
      {name:"No",code:"No",value:"No"}
   ];
   let confirmationSignatureValues = [
      {name:"Yes ($3.89)",code:"Yes",value:"Yes"},
      {name:"No",code:"No",value:"No"}
   ];

   // console.log("state_paymentMethods",state_paymentMethods);
   return (
      <Box
         width={["95%","90%","80%"]}
         marginLeft="auto"
         marginRight="auto"
         marginTop="10px"
      >
         <AddressForm
            states={state_states}
            countries={state_countries}
            addressType="billing"
            title="Billing Address"
            address={state_billingAddress}
            onFieldChange={handleAddressFieldChange}
            onValidityChange={handleValidityChange}
            isVisible={true}
         />

         <Center style={{margin: "0px 0px 10px 0px"}}>
            <Button
               width="90%"
               className="veryLightBlueButton"
               style={{justifyContent: "left"}}
               onClick={toggleShippingAddress}
               size="lg"
            >
               <Checkbox size="lg" borderColor="#ccc" style={checkStyle} isChecked={state_showShipping}></Checkbox>
               {" "} I need to ship to a different address
            </Button>
         </Center>

         <motion.div
            variants={{
               open: { opacity: 1, height: "auto" },
               collapsed: { opacity: 0, height: 0, overflow:"hidden" }
            }}
            transition={{ duration: .8, ease: [0.04, 0.62, 0.23, 0.98] }}
            initial="collapsed"
            exit="collapsed"
            animate={shippingAddressControls}
         >
            <AddressForm
               states={state_states}
               countries={state_countries}
               addressType="shipping"
               title="Shipping Address"
               address={state_shippingAddress}
               onFieldChange={handleAddressFieldChange}
               onValidityChange={handleValidityChange}
               isVisible={state_showShipping}
            />
         </motion.div>

         <motion.div
            variants={{
               open: { opacity: 1, height: "auto" },
               collapsed: { opacity: 0, height: 0, overflow:"hidden" }
            }}
            transition={{ duration: .8, ease: [0.04, 0.62, 0.23, 0.98] }}
            initial="open"
            exit="collapsed"
            animate={shippingProceedControls}
         >
            <Button
               width="100%"
               size="lg"
               colorScheme="blue"
               onClick={proceedToShipping}
            >
               Proceed to Shipping & Payment Method
            </Button>
         </motion.div>

         <motion.div
            variants={{
               open: { opacity: 1, height: "auto" },
               collapsed: { opacity: 0, height: 0, padding: 0, overflow:"hidden" }
            }}
            transition={{ duration: .8, ease: [0.04, 0.62, 0.23, 0.98] }}
            initial="collapsed"
            exit="collapsed"
            animate={shippingLoadingControls}
            style={{textAlign:"center",border:"1px solid #ccc",padding:"10px",borderRadius:"7px",backgroundColor:"#EBEBEB"}}
         >
            <Center>
               <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="md"
               />
               {" "}Loading Shipping Options{" "}
               <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="md"
               />
            </Center>
         </motion.div>

         {
            state_shippingMethods.length ? (
               <Fragment>
                  <fieldset className={styles.fieldset}>
                     <legend>Shipping Method</legend>
                     <RadioGroup onChange={setState_shippingMethod} value={state_shippingMethod}>
                        <Stack>
                           {
                              state_shippingMethods.map(method=>{
                                 let value = `${method.name}|${method.module}:${method.code}`;
                                 let className = state_shippingMethod === value ? `${styles.radioSelected} ${styles.radioContainer}` : styles.radioContainer;
                                 // console.log("className",className);
                                 return (
                                    <Box
                                       key={`${method.module}:${method.code}`}
                                       className={className}
                                    >
                                       <Radio
                                          value={value}
                                       >
                                          {`${method.name} (${formatPrice(method.price)})`}
                                       </Radio>
                                    </Box>
                                 );
                              })
                           }
                        </Stack>
                     </RadioGroup>
                  </fieldset>

                  <fieldset className={styles.fieldset}>
                     <legend>Additional Information</legend>
                     <p className={styles.requiredIndicator}>* Indicates required field</p>
                     <Grid
                        templateRows="repeat(2, 1fr)"
                        //templateColumns="repeat(5, 1fr)"
                        gap={2}
                        className={styles.additionalInfo}
                     >
                        {
                           state_paymentMethods.filter(method=>{
                              return method.name.toLowerCase().indexOf("test") !== -1
                           }).length ? (
                              <GridItem colSpan={2}>
                                 <Field
                                    type="select"
                                    onFieldChange={handleAdditionalInfoChange}
                                    title="Payment Method"
                                    required={true}
                                    field="paymentMethod"
                                    values={state_paymentMethods.map(method=>{ return {...method,name: `${method.module}: ${method.name}`} })}
                                    value={state_additionalInfo.paymentMethod}
                                 />
                              </GridItem>
                           ) : ""
                        }

                        <GridItem colSpan={[2,2,1]}><Field type="select" onFieldChange={handleAdditionalInfoChange} title="Is this a residential address?" required={true} field="residentialAddress" values={residentialAddressValues} value={state_additionalInfo.residentialAddress} /></GridItem>
                        <GridItem colSpan={[2,2,1]}><Field type="select" onFieldChange={handleAdditionalInfoChange} title="Delivery confirmation signature?" required={true} field="confirmationSignature" values={confirmationSignatureValues} value={state_additionalInfo.confirmationSignature} /></GridItem>
                        <GridItem colSpan={2}><Field type="textarea" onFieldChange={handleAdditionalInfoChange} title="Order comments / notes" required={false} field="comments" value={state_additionalInfo.comments} /></GridItem>
                     </Grid>
                  </fieldset>

                  <Modal
                     isOpen={expeditedShippingModal.isOpen}
                     onClose={expeditedShippingModal.onClose}
                     size="lg"
                     closeOnEsc={false}
                     closeOnOverlayClick={false}
                     isCentered={true}
                  >
                     <ModalOverlay />
                     <ModalContent>
                        <ShippingInformation
                           setShippingInfo={setState_expeditedShippingInfo}
                           onClose={expeditedShippingModal.onClose}
                        />
                     </ModalContent>
                  </Modal>
               </Fragment>

            ) : ""
         }

         <Button
            width="100%"
            size="lg"
            colorScheme="blue"
            onClick={proceedToPayment}
            marginTop="15px"
            className={(state_mainFormValid ? '' : styles.disabledButton)}
         >
            Proceed to Payment
         </Button>
      </Box>
   );
};

export default Shipping;