import {Fragment} from "react";
import {
   Box,
   Alert,
   AlertIcon,
   AlertTitle,
   AlertDescription,
} from "@chakra-ui/react";

import styles from "../styles/messages.module.scss";

const Messages = props => {
   return (
      <Box>
         {
            props.messages.errorMessages.length &&

            <Box className={styles.errorBox}>
               <Alert status="error">
                  <AlertTitle
                     mr={2}
                     className={styles.errorHeadline}
                  >
                     We&apos;re sorry, but the following errors were encountered
                  </AlertTitle>
               </Alert>
               {
                  props.messages.errorMessages.map((message,index)=>{
                     return (
                        <Alert
                           status="error"
                           key={`errorMessages|${index}`}
                           className={styles.errorMessage}
                        >
                           <AlertIcon />
                           <AlertDescription>{message}</AlertDescription>
                        </Alert>
                     );
                  })
               }

            </Box>
         }
      </Box>
   )
};

export default Messages;