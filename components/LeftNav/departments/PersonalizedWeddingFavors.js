import {Fragment,useState,useEffect} from "react";
import { List,ListItem,ListIcon,UnorderedList } from "@chakra-ui/react";
import { FaCaretRight } from 'react-icons/fa';

import styles from "../../../styles/leftnav.module.scss";

const PersonalizedWeddingFavors = (props) => {
   console.log("PersonalizedWeddingFavors running, props",props);
   const [state_flyoutStyle,setState_flyoutStyle] = useState( {} );

   useEffect(()=>{
      console.log("props.flyoutOpen changed, props.flyoutOpen:",props.flyoutOpen);
      let style = props.flyoutOpen ? {
         visibility: "visible",
         opacity: "1"
      } : {
      };

      setState_flyoutStyle( style );
   },[props.flyoutOpen]);

   return (
      <Fragment>
         <ul style={{display:"none"}}>
            <li><a href="/page/FF/CTGY/Glassware">- Glasses: Shot, Wine, Flutes etc</a></li>
            <li><a href="/page/FF/CTGY/Pers_Candles">- Candles</a></li>
            <li><a href="/page/FF/CTGY/PersonalizedRibbons">- Ribbons</a></li>
            <li><a href="/page/FF/CTGY/Napkins">- Napkins &amp; Matches</a></li>
            <li><a href="/page/FF/CTGY/Hersheys-mini-chocolates">- Hershey's Mini Chocolates</a></li>
            <li><a href="/page/FF/CTGY/Personalized-Express">- Express Personalized Favors</a></li>
            <li><a href="/page/FF/CTGY/allMintTins">- Mint Tins</a></li>
            <li><a href="/page/FF/CTGY/WeddingPens">- Pens</a></li>
            <li><a href="/page/FF/CTGY/CoffeeTea">- Coffee &amp; Tea</a></li>
            <li><a href="/page/FF/CTGY/HersheysKissesFavors">- Hershey's Kisses</a></li>
            <li><a href="/page/FF/CTGY/Honey">- Honey</a></li>
            <li><a href="/page/FF/CTGY/Lip-Balm">- Lip Balm</a></li>
            <li><a href="/page/FF/CTGY/PersonalizedMugs">- Mugs</a></li>
         </ul>
         <div className="deptPreviewBC hideMe"></div>
         <div className={styles.deptPreview} style={state_flyoutStyle}>
            <p className={styles.borderBlock}></p>
            <UnorderedList style={{marginLeft:"3px"}}>
               <ListItem>
                  <a href="/page/FF/CTGY/Glassware">
                     <ListIcon as={FaCaretRight} color="#EB8DA8" />
                     Glasses: Shot, Wine, Flutes etc
                  </a>
               </ListItem>
               <ListItem>Consectetur adipiscing elit</ListItem>
               <ListItem>Integer molestie lorem at massa</ListItem>
               <ListItem>Facilisis in pretium nisl aliquet</ListItem>
            </UnorderedList>
            <ul className="fLeft">
               <li></li>
               <li><a href="/page/FF/CTGY/Pers_Candles">Candles</a></li>
               <li><a href="/page/FF/CTGY/PersonalizedRibbons">Ribbons</a></li>
               <li><a href="/page/FF/CTGY/Napkins">Napkins &amp; Matches</a></li>
               <li><a href="/page/FF/CTGY/Hersheys-mini-chocolates">Hershey's Mini Chocolates</a></li>
               <li><a href="/page/FF/CTGY/Personalized-Express">Express Personalized Favors</a></li>
               <li><a href="/page/FF/CTGY/allMintTins">Mint Tins</a></li>
               <li><a href="/page/FF/CTGY/WeddingPens">Pens</a></li>
               <li><a href="/page/FF/CTGY/CoffeeTea">Coffee &amp; Tea</a></li>
               <li><a href="/page/FF/CTGY/HersheysKissesFavors">Hershey's Kisses</a></li>
               <li><a href="/page/FF/CTGY/Honey">Honey</a></li>
               <li><a href="/page/FF/CTGY/Lip-Balm">Lip Balm</a></li>
               <li><a href="/page/FF/CTGY/PersonalizedMugs">Mugs</a></li>
            </ul>
            <div className="foFeaturedProducts fRight ui-corner-all posRel">
               <p className="foBestOffer nomarg"></p>
               <p className="foFeaturedProduct foFeaturedProduct1"> <a href="/page/FF/PROD/5863s"><span className="featuredProductImage"></span> Personalized Votive Candle Favors</a> <span className="darkPink">$0.89</span> <br />
                  <br />
                  <a className="foDetails" href="/page/FF/PROD/5863s">See Details</a> <br className="clear" />
               </p>
               <p className="foFeaturedProduct"> <a href="/page/FF/PROD/3421s"><span style={{backgroundPosition: "-92px 0px"}} className="featuredProductImage"></span> Personalized Stemless Wine Glass Favors</a> <span className="darkPink">$1.19</span> <br />
                  <br />
                  <a className="foDetails" href="/page/FF/PROD/3421s">See Details</a> <br className="clear" />
               </p>
            </div>
         </div>
      </Fragment>
   )
};

export default PersonalizedWeddingFavors;