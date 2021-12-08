import {useState,useEffect} from "react";
import { useSelector } from "react-redux";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
   Box,
   Center,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,

   useDisclosure
} from "@chakra-ui/react";

import styles from "../../styles/allReviews.module.scss";

const TheDataTable = dynamic(import('./TheDataTable'), {
  ssr: false
});
const AllReviews = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   //console.log("AllReviews props",props);

   const [state_focusedImageData,setState_focusedImageData] = useState( false );
   const imageModalDisclosure = useDisclosure();

   /* 2021-10-28: react/nextJS will complain here about not passing in
   * imageModalDisclosure in the dependency array. But if you pass it in,
   * the modal can never be closed.
   * turning off the warning for now
   */
   useEffect(()=>{
      if ( !state_focusedImageData ) {
         imageModalDisclosure.onClose();
      } else {
         imageModalDisclosure.onOpen();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   },[state_focusedImageData]);

   return (
      <div className={`${styles.allReviews} ${(props.modal ? styles.allReviewsModal : styles.allReviewsFull)}`}>

         <TheDataTable
            domain={props.domain}
            paginateAt={props.paginateAt ? props.paginateAt : 200}
            reviews={props.reviews.reviews}
            code={props.code}
            setImageData={setState_focusedImageData}
         />

         <Modal
            isOpen={imageModalDisclosure.isOpen}
            onClose={imageModalDisclosure.onClose}
            size="6xl"
            isCentered
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader className="blueHeader">
                  Customer Image
                  <ModalCloseButton />
               </ModalHeader>
               <Box>
                  <ModalBody>
                     <Center>
                        {
                           state_focusedImageData && (
                              <Image
                                 src={`https://${globalConfig.domain}${state_focusedImageData.url}`}
                                 width={state_focusedImageData.width}
                                 height={state_focusedImageData.height}
                                 alt="customer supplied image"
                              />
                           )
                        }

                     </Center>
                  </ModalBody>
               </Box>
            </ModalContent>
         </Modal>
      </div>
   );
};

export default AllReviews;