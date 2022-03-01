import {useState,useEffect,useCallback} from "react";
import { motion,AnimatePresence,useAnimation } from "framer-motion";
import {
   Box,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   Button,

   useDisclosure
} from '@chakra-ui/react';

import Login from "../Login";
import CreateAccount from "./CreateAccount";
import TextInput from "../FormFields/TextInput";
import {messagesActions} from "../../store/slices/messages";
import {parseMessages} from "../../utilities";
//import {globalActions} from "../../store/slices/global";

import styles from "../../styles/loginOrCreate.module.scss";

let variants = {
   open: { opacity: 1, height: "auto", margin: 0, padding: 0 },
   collapsed: { opacity: 0, height: 0, margin: 0, padding: 0, overflow:"hidden" }
};
let transition = { duration: .5, ease: "easeInOut" };

const LoginOrCreate = props => {
   const [st_showing,sst_showing] = useState("create");

   const modalDisclosure = useDisclosure();
   const animationControls_create = useAnimation();
   const animationControls_login = useAnimation();

   useEffect(()=>{
      modalDisclosure.onOpen();
   },[modalDisclosure]);

   let handleClose = () => {
      modalDisclosure.onClose();
      if ( props.onClose ) {
         props.onClose();
      }
   }

   let handleLogin = () => {
      console.log("you is logged in homie");
      props.onComplete();
   };

   useEffect(()=>{
      console.log("toggleShowing, st_showing:",st_showing);
      if ( st_showing === "create" ) {
         animationControls_create.start("open");
         animationControls_login.start("collapsed");
      } else {
         animationControls_create.start("collapsed");
         animationControls_login.start("open");
      }
   },[
      st_showing,
      animationControls_create,
      animationControls_login
   ]);

   let toggleShowing = () => {
      sst_showing(prevState=>{
         return prevState === "create" ? "login" : "create";
      });
   };

   return (
      <Modal
         isOpen={modalDisclosure.isOpen}
         onClose={handleClose}
         size="5xl"
         isCentered
      >
         <ModalOverlay />
         <ModalContent>
            <ModalHeader className="blueHeader">
               Create an Account to Save Your Basket
               <ModalCloseButton />
            </ModalHeader>

            <ModalBody>
               <Box>

                  <motion.div
                     variants={variants}
                     transition={transition}
                     initial="open"
                     exit="collapsed"
                     animate={animationControls_create}
                  >
                     <CreateAccount
                        miscModalDisclosure={props.miscModalDisclosure}
                        setMiscModal={props.setMiscModal}
                        onComplete={props.onComplete}
                     />

                     <p style={{
                        borderTop:"1px solid #ccc",
                        textAlign: "center",position:"relative",
                        margin: "20px"
                     }}>
                        <span
                           style={{
                              border: "1px solid #ccc",
                              display: "inline-block",
                              padding: "5px",
                              fontWeight:"bold",
                              color: "#999",
                              textTransform: "uppercase",
                              position: "absolute",
                              top:"-18px",
                              backgroundColor:"#fff"
                           }}
                        >
                           or
                        </span>
                     </p>
                     <br style={{clear:"both"}} />
                     <p style={{textAlign: "center"}}>
                        Already have an account?
                        <Button
                           size="sm"
                           colorScheme='teal'
                           variant='ghost'
                           onClick={toggleShowing}
                        >
                           Log In
                        </Button>
                     </p>
                  </motion.div>

                  <motion.div
                     variants={variants}
                     transition={transition}
                     initial="collapsed"
                     exit="collapsed"
                     animate={animationControls_login}
                  >
                     <Login
                        returnPath={false}
                        onLogin={handleLogin}
                     />

                     <p style={{
                        borderTop:"1px solid #ccc",
                        textAlign: "center",position:"relative",
                        margin: "20px"
                     }}>
                        <span
                           style={{
                              border: "1px solid #ccc",
                              display: "inline-block",
                              padding: "5px",
                              fontWeight:"bold",
                              color: "#999",
                              textTransform: "uppercase",
                              position: "absolute",
                              top:"-18px",
                              backgroundColor:"#fff"
                           }}
                        >
                           or
                        </span>
                     </p>
                     <br style={{clear:"both"}} />
                     <p style={{textAlign: "center"}}>
                        Need to create an account?
                        <Button
                           size="sm"
                           colorScheme='teal'
                           variant='ghost'
                           onClick={toggleShowing}
                        >
                           Create
                        </Button>
                     </p>
                  </motion.div>
               </Box>
            </ModalBody>

            <ModalFooter
               style={{borderTop:"1px solid #ccc"}}
            >
               <Button colorScheme='blue' mr={3} onClick={handleClose}>
                  Cancel
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}; // LoginOrCreate

export default LoginOrCreate;