import {Fragment} from "react";
import Image from 'next/image';
import {
   Box,
   SimpleGrid,
   Grid,
   GridItem
} from "@chakra-ui/react";

const OptionGrid = props => {
   // console.log("OptionGrid props:",props);
   return (
      <SimpleGrid className={props.styles.grid} minChildWidth={`${props.gridChildWidth}px`} spacing={6}>
         {
            props.options.map((option,index)=>{
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
                     onClick={(event)=>props.handleClick(option)}
                     width={props.gridWidth}
                  >
                     {
                        option.title && (
                           <Box className={props.styles.title}>
                              <b>{option.title}</b><br />
                           </Box>
                        )
                     }

                     {
                        option.img ? (
                           props.optionsImageHeight && props.optionsImageWidth ? (
                              <Image
                                 width={props.optionsImageWidth}
                                 height={props.optionsImageHeight}
                                 alt={option.text}
                                 src={`https://${props.domain}${option.img}`}
                              />
                           ) : (
                              option.imgWidth && option.imgHeight ? (
                                 <Image
                                    width={option.imgWidth}
                                    height={option.imgHeight}
                                    alt={option.text}
                                    src={`https://${props.domain}${option.img}`}
                                 />
                              ) : ""
                           )
                        ) : ""
                     }

                     {
                        option.bgimg && <Box style={style}></Box>
                     }

                     {
                        option.swatchColor && <p className={props.styles.optionSwatch} style={{backgroundColor:`#${option.swatchColor.replace("#","")}`}}></p>
                     }

                     {
                        option.text && (
                           <Fragment>
                              <br />{option.text}
                           </Fragment>
                        )
                     }

                     {
                        option.boldText && (
                           <b>
                              <br />{option.boldText}
                           </b>
                        )
                     }

                     {
                        option.subImages && (
                           <Grid style={{border:"none"}} templateColumns={`repeat(${option.subImages.length}, 1fr)`} gap={3}>
                              {
                                 option.subImages.map((image,subImageIndex)=>{
                                    return (
                                       <GridItem
                                          key={`options|${index}|subImage|${subImageIndex}`}
                                          onClick={(event)=>{
                                             /* I know, stopPropagation is frowned upon, but we don't want the click to bubble up and
                                             * get handled again but the parent div. Yea I can probably put a click handled flag or
                                             * something, but that's a lot of work for an extremely uncommon scenario like this, I think
                                             * we have about 3 items that utilize this
                                             */
                                             event.stopPropagation();
                                             props.handleClick(image);
                                          }}
                                       >
                                          {
                                             image.imgWidth && image.imgHeight ? (
                                                <Image
                                                   width={image.imgWidth}
                                                   height={image.imgHeight}
                                                   alt={image.text}
                                                   src={`https://${props.domain}${image.img}`}
                                                />
                                             ) : ""
                                          }
                                          {
                                             image.text && (
                                                <Fragment>
                                                   <br />{image.text}
                                                </Fragment>
                                             )
                                          }
                                       </GridItem>
                                    );
                                 })
                              }
                           </Grid>
                        )
                     }
                  </Box>
               );
            })
         }
      </SimpleGrid>
   );
}; // OptionGrid

export default OptionGrid;