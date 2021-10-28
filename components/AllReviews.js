import {memo,useState,useEffect} from "react";
import { useSelector } from "react-redux";
import DataTable from "datatable";
import Image from 'next/image';
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

import ReviewStars from "./ProductDisplay/ReviewStars";
import Review from "./ProductDisplay/Review";

import styles from "../styles/allReviews.module.scss";

const TheDataTable = memo(props => {
   console.log("datatable rendering");
   let columns = [
      {
         name: 'Rating',
         selector: 'rating',
         width:"110px",
         sortable: true,
         sortBy: (columnName, value, row)=>{ return value !== "" ? parseInt(value) : 0; },
         cell: row=>{
            return <ReviewStars domain={props.domain} stars={row.rating} />;
         }
      },
      {
         name: 'Date',
         sortable: true,
         sortBy: (columnName, value, row)=>{
            value = value.split("/");
            let date = new Date(`${value[2]}-${value[0]}-${value[1]}T00:00:00.000Z`);
            let seconds = date.getTime() / 1000;
            return seconds;
         },
         selector: 'printableDate'
      },
      {
         name: 'Review',
         selector: 'review',
         cell: row=>{
            return (
               <Review
                  domain={props.domain}
                  review={{...row}}
                  displayStyle="viewAll"
                  code={props.code}
                  setImageData={props.setImageData}
               />
            );
         }
      }
   ];

   return (
      <DataTable
         totalRows={props.reviews.length}
         rows={props.reviews}
         columns={columns}
         selectableRows={false}
         utilities={["stats","paginate"]}
         fillWidth={true}
         defaultSort={[["date", "DESC"]]}
         paginationPerPage={props.paginateAt}
         stickyHead={true}
      />
   );
});

const AllReviews = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   //console.log("AllReviews props",props);

   const [state_focusedImageData,setState_focusedImageData] = useState( false );
   const imageModalDisclosure = useDisclosure();

   useEffect(()=>{
      console.log("state_focusedImageData",state_focusedImageData);
      if ( !state_focusedImageData ) {
         imageModalDisclosure.onClose();
      } else {
         imageModalDisclosure.onOpen();
      }
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
                        <Image
                           src={`https://${globalConfig.domain}${state_focusedImageData.url}`}
                           width={state_focusedImageData.width}
                           height={state_focusedImageData.height}
                        />
                     </Center>
                  </ModalBody>
               </Box>
            </ModalContent>
         </Modal>
      </div>
   );
};

export default AllReviews;