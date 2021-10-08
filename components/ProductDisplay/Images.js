import {Fragment,useState} from "react";
import axios from "axios";
import Image from 'next/image';
import {
   Box,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalCloseButton,
   Stack,
   Badge,
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,
   Center,

   useDisclosure
} from "@chakra-ui/react";

const Images = props => {
   const [state_imageModalContent,setState_imageModalContent] = useState( false );
   const [state_imageZoomedIn,setState_imageZoomedIn] = useState("false"); // this is a string on purpose

   const modalDisclosure = useDisclosure();

   let getLargeImageLink = () => {
      let image = props.hasLargeImage === "1" ? props.prodCode : props.hasLargeImage;
      return `https://${props.domain}/includes/largeImage/?image=${image}`;
   };

   let handleImageClick = async (event, imageURL) => {
      event.preventDefault();
      setState_imageModalContent( false );
      props.modalDisclosure.onOpen();

      let response = await axios.get(imageURL);
      if ( response.status ) {
         //console.log("img 2",response.data);
         setState_imageModalContent( response.data );
      }
   }; // handleImageClick

   let handleImageZoom = event => {
      if ( event.target.dataset && event.target.dataset.enlargedimage && event.target.dataset.enlargedimage === "true" ) {
         // this is a string on purpose
         setState_imageZoomedIn( prevState=>{
            return prevState === "true" ? "false" : "true"
         });
      }
   }; // handleImageZoom

   let fixImageSrc = path => {
      return `https://${props.domain}${path}`;
   }; // fixImageSrc

   let renderImage = (path, width, height, alt, blur=false, eager=false) => {
      // because I don't like repeating code
      if ( eager ) {
         return <Image loading="eager" src={fixImageSrc(path)} width={width} height={height} alt={alt} />
      } else {
         if ( blur ) {
            return <Image src={fixImageSrc(path)} width={width} height={height} alt={alt} placeholder="blur" blurDataURL={blur} />
         } else {
            return <Image src={fixImageSrc(path)} width={width} height={height} alt={alt} />
         }
      }

   }; // renderImage

   let handleModalImageListClick = event => {
      event.preventDefault();
      setState_imageZoomedIn( "false" );
      let target = document.querySelectorAll("img[data-enlargedimage='true']")[0];
      target.src = event.currentTarget.getAttribute("href");
      target.srcset = event.currentTarget.getAttribute("href");
      target.style.height = "";
      target.style.minHeight = "";
      target.style.maxHeight = "";
      target.style.width = "";
      target.style.minWidth = "";
      target.style.maxWidth = "";
   }; // handleModalImageListClick

   let handleAdditionalImageListClick = options => {
      options.event.preventDefault();
      setState_imageZoomedIn( "false" );
      props.modalDisclosure.onOpen();
      // console.log("href",fixImageSrc(event.currentTarget.getAttribute("href")));
      // console.log("rendered image",renderImage(event.currentTarget.getAttribute("href"), "", "", ""));
      let img = null;
      if ( options.blur ) {
         img = <Image src={fixImageSrc(options.path)} width={options.width} height={options.height} alt="" placeholder="blur" blurDataURL={options.blur} data-enlargedimage='true' />;
      } else {
         img = <Image src={fixImageSrc(options.path)} width={options.width} height={options.height} alt="" data-enlargedimage='true' />;
      }
      //console.log("img",img);
      setState_imageModalContent( img );
   }; // handleAdditionalImageListClick

   return (
      <Fragment>
         {
            props.hasLargeImage ?
               <a
                  href={getLargeImageLink()}
                  onClick={event=>{handleImageClick(event,getLargeImageLink())}}
               >
                  {renderImage(props.images.main.path, props.images.main.width, props.images.main.height, props.strippedName, props.images.main.blur, true)}
                  <span>
                     Enlarge <Image src={`https://${props.domain}/images/misc/enlarge2.png`} width="27" height="15" alt="enlarge" />
                  </span>
               </a>
            : renderImage(props.images.main.path, props.images.main.width, props.images.main.height, props.strippedName, props.images.main.blur, true)
         }

         {
            (props.images.additionalImages && props.images.additionalImages.length) ||
            (props.images.reviewImages && props.images.reviewImages.length) ?
               <Tabs variant="enclosed">
                  <TabList mb="1em" className="blueHeader">
                     {
                        props.images.reviewImages && props.images.reviewImages.length ?
                           <Tab>Customer Images</Tab>
                        : ""
                     }
                     {
                        props.images.additionalImages && props.images.additionalImages.length ?
                           <Tab>Alternate Images</Tab>
                        : ""
                     }
                  </TabList>
                  <TabPanels>
                     {
                        props.images.reviewImages && props.images.reviewImages.length ?
                           <TabPanel className={props.styles.additionalImages}>
                              {
                                 props.images.reviewImages.map((image,index)=>{
                                    let eager = index < 3;
                                    return (
                                       <a
                                          key={image.thumb.path}
                                          onClick={(event)=>{
                                             handleAdditionalImageListClick({
                                                event: event,
                                                path: image.main.path,
                                                width: image.main.width,
                                                height: image.main.height,
                                                blur: image.main.blur
                                             })
                                          }}
                                          href={image.main.path}
                                       >
                                          {renderImage(image.thumb.path, image.thumb.width, image.thumb.height, "", image.thumb.blur, eager)}
                                       </a>
                                    );
                                 })
                              }
                           </TabPanel>
                        : ""
                     }
                     {
                        props.images.additionalImages && props.images.additionalImages.length ?
                           <TabPanel className={props.styles.additionalImages}>
                              {
                                 props.images.additionalImages.map((image,index)=>{
                                    let eager = !props.images.reviewImages && index < 3;
                                    return (
                                       <a
                                          key={image.thumb.path}
                                          onClick={(event)=>{
                                             handleAdditionalImageListClick({
                                                event: event,
                                                path: image.main.path,
                                                width: image.main.width,
                                                height: image.main.height,
                                                blur: image.main.blur
                                             })
                                          }}
                                          href={image.main.path}
                                       >
                                          {renderImage(image.thumb.path, image.thumb.width, image.thumb.height, "", image.thumb.blur, eager)}
                                       </a>
                                    );
                                 })
                              }
                           </TabPanel>
                        : ""
                     }
                  </TabPanels>
               </Tabs>
            : ""
         }

         <Modal
            isOpen={props.modalDisclosure.isOpen}
            onClose={props.modalDisclosure.onClose}
            size="full"
         >
            <ModalOverlay />
            <ModalContent
               className={props.styles.imageModal}
            >
               <ModalHeader className="blueHeader">
                  Product Images
                  <ModalCloseButton />
               </ModalHeader>
               <Box className={props.styles.realModalContent}>
                  <ModalBody>
                     <Stack direction="row" spacing="5px">
                        <Box
                           className={props.styles.modalImageList}
                        >
                           {
                              props.images.large !== "" ?
                                 <Fragment>
                                    <Badge colorScheme="blue">Main Image</Badge>
                                    <a
                                       key={props.images.thumb.path}
                                       onClick={handleModalImageListClick}
                                       href={fixImageSrc(props.images.large.path)}
                                    >
                                       {renderImage(props.images.thumb.path, props.images.thumb.width, props.images.thumb.height, props.strippedName, props.images.thumb.blur)}
                                    </a>
                                 </Fragment>
                              : ""
                           }

                           {
                              props.images.additionalImages && props.images.additionalImages.length ?
                                 <Fragment>
                                    <Badge colorScheme="blue">Alternate Images</Badge>
                                    {
                                       props.images.additionalImages.map( image=>{
                                          return (
                                             <a
                                                key={image.thumb.path}
                                                onClick={handleModalImageListClick}
                                                href={fixImageSrc(image.main.path)}
                                             >
                                                {renderImage(image.thumb.path, image.thumb.width, image.thumb.height, image.descr || image.name || "", image.thumb.blur)}
                                             </a>
                                          );
                                       })
                                    }
                                 </Fragment>
                              : ""
                           }

                           {
                              props.images.reviewImages && props.images.reviewImages.length ?
                                 <Fragment>
                                    <Badge colorScheme="blue">Customer Images</Badge>
                                    {
                                       props.images.reviewImages.map( image=>{
                                          return (
                                             <a
                                                key={image.thumb.path}
                                                onClick={handleModalImageListClick}
                                                href={fixImageSrc(image.main.path)}
                                             >
                                                {renderImage(image.thumb.path, image.thumb.width, image.thumb.height, "", image.thumb.blur)}
                                             </a>
                                          );
                                       })
                                    }
                                 </Fragment>
                              : ""
                           }
                        </Box>

                        <Box
                           flex="1"
                           className={props.styles.focusedImage}
                           data-imagezoomedin={state_imageZoomedIn}
                           onClick={handleImageZoom}
                        >
                           {
                              !state_imageModalContent ?
                                 props.renderSpinner()
                              :
                              typeof( state_imageModalContent ) === "string" ?
                                 <Center dangerouslySetInnerHTML={{__html: state_imageModalContent}}></Center>
                              : <Center>{state_imageModalContent}</Center>
                           }
                        </Box>
                     </Stack>

                  </ModalBody>
               </Box>
            </ModalContent>
         </Modal>
      </Fragment>
   );
};

export default Images;