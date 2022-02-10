import {Fragment,useState,useEffect} from "react";
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

//import styles from "../styles/messages.module.scss";

const Messages = props => {
   const drawerDisclosure = useDisclosure();

   console.log("Messages rendering, props:",props);

   let {
      messages
   } = props;

   useEffect(()=>{
      if ( messages.errorMessages.length || messages.informationMessages.length ) {
         drawerDisclosure.onOpen();
      }
   },[messages,drawerDisclosure]);

   return (
      <Drawer
         isOpen={drawerDisclosure.isOpen}
         placement='top'
         onClose={drawerDisclosure.onClose}
         preserveScrollBarGap={true}
      >
         <DrawerOverlay />
         <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader
               style={{borderBottom:"1px solid #ccc"}}
            >
               Errors &amp; Notifications
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
                                    <AlertDescription>{message}</AlertDescription>
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