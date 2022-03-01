import {Fragment,useState,useEffect,useCallback} from "react";
import { useDispatch } from "react-redux";
import {
   Box,
   Alert,
   AlertIcon,
   AlertTitle,
   AlertDescription,
   Drawer,
   DrawerBody,
   DrawerFooter,
   DrawerHeader,
   DrawerOverlay,
   DrawerContent,
   DrawerCloseButton,

   useDisclosure
} from "@chakra-ui/react";

import {messagesActions} from "../store/slices/messages";

//import styles from "../styles/messages.module.scss";

const Messages = props => {
   const drawerDisclosure = useDisclosure();

   //console.log("Messages rendering, props:",props);

   let {
      messages
   } = props;

   const dispatch = useDispatch();

   let openDrawer = useCallback(() => {
      drawerDisclosure.onOpen();
   },[drawerDisclosure]);

   useEffect(()=>{
      if ( messages.errorMessages.length || messages.informationMessages.length ) {
         openDrawer();
      }
   },[messages,openDrawer]);

   let handleClose = () => {
      dispatch(messagesActions.reset());
      drawerDisclosure.onClose();
   };

   return (
      <Drawer
         isOpen={drawerDisclosure.isOpen}
         placement='top'
         onClose={handleClose}
         preserveScrollBarGap={true}
      >
         <DrawerOverlay />
         <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader
               style={{borderBottom:"1px solid #ccc"}}
            >
               {messages.title}
            </DrawerHeader>

            <DrawerBody
               style={{paddingTop:"30px",paddingBottom:"20px"}}
            >
               {
                  messages.errorMessages.length ? (
                     <Box>
                        {
                           messages.errorMessages.map((message,index)=>{
                              return (
                                 <Alert
                                    status="error"
                                    key={`errorMessages|${index}`}
                                 >
                                    <AlertIcon />
                                    <AlertDescription>
                                       {
                                          typeof(message) === "string" ? (
                                             message
                                          ) : (
                                             <message />
                                          )
                                       }
                                    </AlertDescription>
                                 </Alert>
                              );
                           })
                        }
                     </Box>
                  ) : ""
               }

               {
                  messages.informationMessages.length ? (
                     <Box>
                        {
                           messages.informationMessages.map((message,index)=>{
                              return (
                                 <Alert
                                    status="info"
                                    key={`informationMessages|${index}`}
                                 >
                                    <AlertIcon />
                                    <AlertDescription>{message}</AlertDescription>
                                 </Alert>
                              );
                           })
                        }
                     </Box>
                  ) : ""
               }
            </DrawerBody>
         </DrawerContent>
      </Drawer>
   )
};

export default Messages;