import { Fragment,useState,useEffect } from "react";
import Link from "next/link";
import { Stack, HStack, VStack, Box, Wrap, WrapItem } from "@chakra-ui/react";

import styles from "../styles/subDepartmentList.module.scss";

const SubDepartmentList = (props) => {
   //console.log("SubDepartmentList props",props);

   const [state_columns,setState_columns] = useState( 1 );
   const [state_rows,setState_rows] = useState( 1 );
   const [state_tiles,setState_tiles] = useState( [] );
   const [state_slideTotals,setState_slideTotals] = useState({ tilesPerSlide: 1, slidesRequired: 1 });
   const [state_itemStart, setState_itemStart] = useState( 1 );
   const [state_itemEnd, setState_itemEnd] = useState( null );
   const [state_itemTotal, setState_itemTotal] = useState( null );
   const [state_slideViewing, setState_slideViewing] = useState( 1 );
   const [state_slideTransform, setState_slideTransform] = useState( "translate3d( 0%, 0px, 0px)" );
   const [state_backActive, setState_backActive] = useState( true );
   const [state_forwardActive, setState_forwardActive] = useState( true );

   useEffect(()=>{
      setState_columns( props.subcats.columns );
   },[props.subcats.columns]);
   useEffect(()=>{
      setState_rows( props.subcats.rows );
   },[props.subcats.rows]);
   useEffect(()=>{
      setState_tiles( props.subcats.tiles );
   },[props.subcats.tiles]);
   useEffect(()=>{
      let tilesPerSlide = state_columns * state_rows;
      let slidesRequired = Math.ceil(state_tiles.length / tilesPerSlide);
      setState_slideViewing( 1 );
      setState_itemEnd( tilesPerSlide );
      setState_slideTotals({ tilesPerSlide: tilesPerSlide, slidesRequired: slidesRequired });
   },[state_columns,state_rows,state_tiles]);
   useEffect(()=>{
      // console.log("state_slideViewing",state_slideViewing);
      // console.log("state_slideTotals.slidesRequired",state_slideTotals.slidesRequired);
      if ( state_slideViewing >= state_slideTotals.slidesRequired ) {
         setState_backActive( true );
      } else {
         setState_backActive( false );
      }
      if ( state_slideViewing < state_slideTotals.slidesRequired ) {
         setState_forwardActive( true );
      } else {
         setState_forwardActive( false );
      }
      let offset = (state_slideViewing - 1) * 100 * -1;
      setState_slideTransform( `translate3d( ${offset}%, 0px, 0px)` );

      let start = state_slideViewing === 1 ? 1 : (state_slideTotals.tilesPerSlide * ( state_slideViewing - 1 )) + 1;
      let end = start - 1 + state_slideTotals.tilesPerSlide;
      if ( end > state_tiles.length ) {
         end = state_tiles.length;
      }
      setState_itemStart( start );
      setState_itemEnd( end );
   },[state_slideViewing,state_slideTotals.slidesRequired]);

   let goBack = (event) => {
      setState_slideViewing( prevState=>{
         return prevState > 1 ? prevState - 1 : prevState;
      });
   }; // goBack
   let goForward = (event) => {
      setState_slideViewing( prevState=>{
         return prevState < state_slideTotals.slidesRequired ? prevState + 1 : prevState;
      });
   }; // goForward

   let renderSlide = slideIndex => {
      //console.log("state_tiles.length",state_tiles.length);
      // first let's pull all the tiles that are part of this slide
      state_slideTotals.tilesPerSlide

      let start = slideIndex === 1 ? 0 : state_slideTotals.tilesPerSlide * ( slideIndex - 1 );
      let end = start + state_slideTotals.tilesPerSlide;
      if ( end > state_tiles.length ) {
         end = state_tiles.length - 1;
      }

      //console.log("start",start);
      //console.log("end",end);

      let tiles = state_tiles.slice( start, end );
      //console.log("tiles.length",tiles.length);

      let showTiles = [];

      if ( state_rows === 1 ) {
         showTiles =  tiles;
      } else {
         // get the evens
         for( let i = 0; i < tiles.length; i += 2 ) {
            showTiles.push( tiles[i] );
         }
         // get the odds
         for( let i = 1; i < tiles.length; i += 2 ) {
            showTiles.push( tiles[i] );
         }
      }

      return showTiles.map( (tile,index) => {
         //console.log("tile",tile);
         let key = "";
         let link = "";
         let shallow = false;
         if ( tile.ctgy ) {
            key = tile.ctgy;
            link = `/page/FF/CTGY/${tile.ctgy}`;
            shallow =  true;
         } else {
            key = tile.search.text;
            link = `/search/${tile.search.text}`;
         }
         //console.log("link",link);
         return (
            <WrapItem
               className={styles.subCat}
               key={key}
            >
               <Link shallow={shallow} href={link}>
                  <a>
                     <img src={`https://www.favorfavor.com${tile.image}`} />
                     <span>{tile.text}</span>
                  </a>
               </Link>
            </WrapItem>
         );
      });
   };

   let backArrow = {
      disabled: "https://www.favorfavor.com/images/misc/categories/subCatTh/altLeftDisabled.png",
      enabled: "https://www.favorfavor.com/images/misc/categories/subCatTh/altLeftOff.png"
   };
   let forwardArrow = {
      disabled: "https://www.favorfavor.com/images/misc/categories/subCatTh/altRightDisabled.png",
      enabled: "https://www.favorfavor.com/images/misc/categories/subCatTh/altRightOff.png"
   };

   let slideIndex = 0;
   return (
      <Fragment>
         <div className={styles.slideControls}>
            {
               state_backActive || state_forwardActive ?
                  <div className={styles.pagination}>
                     <img
                        className={state_backActive ? styles.active : ""}
                        src={state_backActive ? backArrow.enabled : backArrow.disabled}
                        alt="Back Arrow"
                        width="43"
                        height="30"
                        onClick={goBack}
                     />
                     <img
                        className={state_forwardActive ? styles.active : ""}
                        src={state_forwardActive ? forwardArrow.enabled : forwardArrow.disabled}
                        alt="Forward Arrow"
                        width="43"
                        height="30"
                        onClick={goForward}
                     />
                  </div>
               : ""
            }

            <div className={styles.tallies}>{state_itemStart} - {state_itemEnd} of {state_tiles.length}</div>
         </div>

         <fieldset className={styles.slideContainer}>
            <legend>Shop By Category</legend>
            <ul className={styles.slider} style={{transform: state_slideTransform}}>
               {
                  Array.from( {length: state_slideTotals.slidesRequired}, () => {
                     slideIndex++;
                     return (
                        <li
                           key={slideIndex}
                           className={styles.slide}
                           data-size={`${state_rows}|${state_columns}`}
                        >
                           <Wrap justify="center">
                              {renderSlide(slideIndex)}
                           </Wrap>
                        </li>
                     )
                  })
               }
            </ul>
         </fieldset>
      </Fragment>
   );
};

export default SubDepartmentList;