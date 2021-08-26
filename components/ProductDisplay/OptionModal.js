import {Fragment,useState,useEffect,useRef} from "react";
import Image from 'next/image';
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   Button,
   Box,
   Wrap,
   WrapItem,
   Center,
   SimpleGrid,
   forwardRef,
   Heading,

   useDisclosure
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionModalContent = motion(ModalContent);

const OptionModal = props => {
   //console.log("Modal props",props);
   const modalDisclosure = useDisclosure();
   const [state_animate,setState_animate] = useState( {} );
   const [state_animationDuration,setState_animationDuration] = useState( 0.4 );
   const modalRef = useRef();

   useEffect(()=>{
      modalDisclosure.onOpen();
   },[modalDisclosure]);

   let closeModal = () => {
      /* the modal wants to be centered. If we just change the x value (left), it
      * moves to where we want. But when we decrease the width at the same time, it wants to shift
      * itself further to the right to compensate for the smaller width.
      * So we have to compensate for that compensation.
      */
      console.log("props.elRef",props.elRef);
      console.log("elRef height",props.elRef.current.clientHeight);
      let elRect = props.elRef.current.getBoundingClientRect();
      let modalRect = modalRef.current.getBoundingClientRect();
      console.log("modalRect",modalRect);
      console.log("elRect",elRect);
      let newX = elRect.x - modalRect.x;

      // ok great but since we're decreasing the width as well, we have to compensate for that shift
      let offsetDiff = (modalRect.width - elRect.width) / 2;
      newX -= offsetDiff;

      let animateTo = {
         height: elRect.height + "px",
         width: elRect.width + "px",
         margin: 0,
         x: newX,
         y: elRect.y,
         opacity: 0
      };
      console.log("animateTo",animateTo);
      setState_animate(animateTo);
      setTimeout(()=>{
         modalDisclosure.onClose();
         props.setModal( false );
      },state_animationDuration * 1000);

   }; // closeModal

   let handleClick = option => {
      // setValue
      console.log("clicked option",option);
      props.setValue(null,option.value);
      closeModal();
   };

   return (
      <Modal
         isOpen={modalDisclosure.isOpen}
         onClose={closeModal}
         size="4xl"
      >
         <ModalOverlay />
         <MotionModalContent
            className={props.styles.optionModal}

            animate={state_animate}
            transition={{ ease: "easeOut", duration: state_animationDuration }}
            ref={modalRef}
            style={{overflow:"hidden"}}
         >
            <ModalHeader className="blueHeader">
               {props.modal.title}
               <ModalCloseButton />
            </ModalHeader>
            <ModalBody style={{height:"100%",overflowY:"scroll"}}>
               <Fragment>
                  {
                     props.modal.options.diagram && <Fragment>
                        <Box>
                           <Heading className="subHeader yellow">Diagram</Heading>
                           <Image
                              alt="diagram"
                              src={`https://${props.globalConfig.domain}${props.modal.options.diagram.img}`}
                              width={props.modal.options.diagram.width}
                              height={props.modal.options.diagram.height}
                              style={{margin:"0px auto 10px auto"}}
                           />
                           { props.modal.options.diagram.note && <p>{props.modal.options.diagram.note}</p> }
                        </Box>
                        <Heading className="subHeader yellow">Options</Heading>
                     </Fragment>
                  }
                  <SimpleGrid className={props.styles.grid} minChildWidth={`${props.modal.options.gridWidth}px`} spacing={6}>
                     {
                        props.modal.options.options.map((option,index)=>{
                           let style = {};
                           if ( option.bgimg ) {
                              style = {
                                 backgroundImage: `url(${option.bgimg.url})`,
                                 backgroundPosition: `${option.bgimg.position}`,
                                 width: `${option.bgimg.width}`,
                                 height: `${option.bgimg.height}`,
                                 margin: '2px auto',
                                 border: 'none'
                              };
                           }
                           return (
                              <Box
                                 key={`options|${index}|${option.text}`}
                                 onClick={(event)=>handleClick(option)}
                              >
                                 {
                                    option.img && <Image alt={option.text} src={`https://${props.globalConfig.domain}${option.img}`} />
                                 }
                                 {
                                    option.bgimg && <Box style={style}></Box>
                                 }
                                 {option.text}
                              </Box>
                           );
                        })
                     }
                  </SimpleGrid>
               </Fragment>

            </ModalBody>

         </MotionModalContent>
      </Modal>

   );
}; // OptionModal

export default OptionModal;