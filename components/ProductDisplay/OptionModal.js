import {Fragment,useState,useEffect,useRef} from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import _ from "lodash";
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
   forwardRef,
   Heading,
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,

   useDisclosure
} from "@chakra-ui/react";

import OptionGrid from "./OptionGrid";

import tabStyles from "../../styles/tabs.module.scss";

const MotionModalContent = motion(ModalContent);

const OptionModal = props => {
   console.log("Modal props",props);
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

   let gridChildWidth;
   if ( props.modal.options.gridWidth ) {
      gridChildWidth = props.modal.options.gridWidth;
   } else if ( props.modal.options.imgWidth ) {
      gridChildWidth = parseInt(props.modal.options.imgWidth) + 30;
   } else if ( props.modal.options.optionWidth ) {
      gridChildWidth = props.modal.options.optionWidth;
   } else {
      // ok then, do the options have widths? If so, grab the widest one
      let widest = 0;

      console.log("typeof(props.modal.options.options)",typeof props.modal.options.options);
      console.log("props.modal.options.options",props.modal.options.options);
      if ( Array.isArray( props.modal.options.options ) ) {
         props.modal.options.options.forEach(option=>{
            if ( option.imgWidth && option.imgWidth > widest ) {
               widest = option.imgWidth;
            }
         });
      } else {
         // maybe it's a tabbed setup..
         _.forEach( props.modal.options.options, tabName=>{
            if ( Array.isArray( props.modal.options.options[tabName] ) ) {
               props.modal.options.options[tabName].forEach(option=>{
                  if ( option.imgWidth && option.imgWidth > widest ) {
                     widest = option.imgWidth;
                  }
               });
            }
         });
      }

      if ( widest ) {
         gridChildWidth = widest + 30;
      } else {
         // well shit
         gridChildWidth = "150";
      }
   }

   console.log("typeof([])",typeof([]));
   console.log("typeof(props.modal.options.options)",typeof(props.modal.options.options));
   console.log("props.modal.options.options",props.modal.options.options);

   let printTitle = title => {
      let regEx = new RegExp("click to ", "ig");
      return title.replace(regEx, "");
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
               {printTitle(props.modal.title)}
               <ModalCloseButton />
            </ModalHeader>
            <ModalBody style={{height:"100%",overflowY:"scroll"}}>
               <Fragment>
                  {
                     props.modal.options.diagram && (
                        <Fragment>
                           <Box>
                              <Heading className="subHeader yellow">Diagram</Heading>
                              <Center>
                                 <Image
                                    alt="diagram"
                                    src={`https://${props.globalConfig.domain}${props.modal.options.diagram.img}`}
                                    width={props.modal.options.diagram.width}
                                    height={props.modal.options.diagram.height}
                                    style={{margin:"0px auto 10px auto"}}
                                 />
                              </Center>
                              <Center>
                                 { props.modal.options.diagram.note && <p>{props.modal.options.diagram.note}</p> }
                              </Center>
                           </Box>
                           <Heading className="subHeader yellow">Options</Heading>
                        </Fragment>
                     )
                  }

                  {
                     Array.isArray( props.modal.options.options ) ? (
                        <OptionGrid
                           options={props.modal.options.options}
                           styles={props.styles}
                           gridChildWidth={gridChildWidth}
                           gridWidth={props.modal.options.imgWidth || props.modal.options.optionWidth}
                           handleClick={handleClick}
                           optionsImageHeight={props.modal.options.imgHeight}
                           optionsImageWidth={props.modal.options.imgWidth}
                           domain={props.globalConfig.domain}
                        />
                     ) : (
                        <Fragment>
                           <Tabs className={tabStyles.container} isFitted variant="enclosed">
                              <TabList mb="1em" className="blueHeader">
                                 {
                                    _.map( props.modal.options.options, (options,key)=>{
                                       return <Tab key={key}>{key}</Tab>;
                                    })
                                 }
                              </TabList>

                              <TabPanels>
                                 {
                                    _.map( props.modal.options.options, (options,key)=>{
                                       return (
                                          <TabPanel key={key}>
                                             <OptionGrid
                                                options={options}
                                                styles={props.styles}
                                                gridChildWidth={gridChildWidth}
                                                gridWidth={props.modal.options.imgWidth || props.modal.options.optionWidth}
                                                handleClick={handleClick}
                                                optionsImageHeight={props.modal.options.imgHeight}
                                                optionsImageWidth={props.modal.options.imgWidth}
                                                domain={props.globalConfig.domain}
                                             />
                                          </TabPanel>
                                       );
                                    })
                                 }
                              </TabPanels>
                           </Tabs>
                        </Fragment>
                     )
                  }
               </Fragment>
            </ModalBody>
         </MotionModalContent>
      </Modal>
   );
}; // OptionModal

export default OptionModal;