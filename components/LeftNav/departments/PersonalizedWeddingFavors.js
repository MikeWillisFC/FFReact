import {Fragment,useState,useEffect} from "react";
import Link from "next/link";
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
            {
               // <Link shallow href="/page/FF/CTGY/Inexpensive">$0.99 &amp; Under Favors</Link>
            }

            <li><Link shallow href="/page/FF/CTGY/Glassware">- Glasses: Shot, Wine, Flutes etc</Link></li>
            <li><Link shallow href="/page/FF/CTGY/Pers_Candles">- Candles</Link></li>
            <li><Link shallow href="/page/FF/CTGY/PersonalizedRibbons">- Ribbons</Link></li>
            <li><Link shallow href="/page/FF/CTGY/Napkins">- Napkins &amp; Matches</Link></li>
            <li><Link shallow href="/page/FF/CTGY/Hersheys-mini-chocolates">- Hershey&apos;s Mini Chocolates</Link></li>
            <li><Link shallow href="/page/FF/CTGY/Personalized-Express">- Express Personalized Favors</Link></li>
            <li><Link shallow href="/page/FF/CTGY/allMintTins">- Mint Tins</Link></li>
            <li><Link shallow href="/page/FF/CTGY/WeddingPens">- Pens</Link></li>
            <li><Link shallow href="/page/FF/CTGY/CoffeeTea">- Coffee &amp; Tea</Link></li>
            <li><Link shallow href="/page/FF/CTGY/HersheysKissesFavors">- Hershey&apos;s Kisses</Link></li>
            <li><Link shallow href="/page/FF/CTGY/Honey">- Honey</Link></li>
            <li><Link shallow href="/page/FF/CTGY/Lip-Balm">- Lip Balm</Link></li>
            <li><Link shallow href="/page/FF/CTGY/PersonalizedMugs">- Mugs</Link></li>
         </ul>
         <div className="deptPreviewBC hideMe"></div>
         <div className={styles.deptPreview} style={state_flyoutStyle}>
            <p className={styles.borderBlock}></p>
            <UnorderedList style={{marginLeft:"3px"}}>
               <ListItem>
                  <Link shallow href="/page/FF/CTGY/Glassware">
                     <a>
                        <ListIcon as={FaCaretRight} color="#EB8DA8" />
                        Glasses: Shot, Wine, Flutes etc
                     </a>
                  </Link>
               </ListItem>
               <ListItem>Consectetur adipiscing elit</ListItem>
               <ListItem>Integer molestie lorem at massa</ListItem>
               <ListItem>Facilisis in pretium nisl aliquet</ListItem>
            </UnorderedList>
            <ul className="fLeft">
               <li></li>
               <li><Link shallow href="/page/FF/CTGY/Pers_Candles">Candles</Link></li>
               <li><Link shallow href="/page/FF/CTGY/PersonalizedRibbons">Ribbons</Link></li>
               <li><Link shallow href="/page/FF/CTGY/Napkins">Napkins &amp; Matches</Link></li>
               <li><Link shallow href="/page/FF/CTGY/Hersheys-mini-chocolates">Hershey&apos;s Mini Chocolates</Link></li>
               <li><Link shallow href="/page/FF/CTGY/Personalized-Express">Express Personalized Favors</Link></li>
               <li><Link shallow href="/page/FF/CTGY/allMintTins">Mint Tins</Link></li>
               <li><Link shallow href="/page/FF/CTGY/WeddingPens">Pens</Link></li>
               <li><Link shallow href="/page/FF/CTGY/CoffeeTea">Coffee &amp; Tea</Link></li>
               <li><Link shallow href="/page/FF/CTGY/HersheysKissesFavors">Hershey&apos;s Kisses</Link></li>
               <li><Link shallow href="/page/FF/CTGY/Honey">Honey</Link></li>
               <li><Link shallow href="/page/FF/CTGY/Lip-Balm">Lip Balm</Link></li>
               <li><Link shallow href="/page/FF/CTGY/PersonalizedMugs">Mugs</Link></li>
            </ul>
            <div className="foFeaturedProducts fRight ui-corner-all posRel">
               <p className="foBestOffer nomarg"></p>
               <p className="foFeaturedProduct foFeaturedProduct1">
                  <Link shallow href="/page/FF/PROD/5863s">
                     <a>
                        <span className="featuredProductImage"></span>
                        Personalized Votive Candle Favors
                     </a>
                  </Link>
                  <span className="darkPink">$0.89</span>
                  <br />
                  <br />
                  <Link shallow className="foDetails" href="/page/FF/PROD/5863s">See Details</Link> <br className="clear" />
               </p>
               <p className="foFeaturedProduct">
                  <Link shallow href="/page/FF/PROD/3421s">
                     <a>
                        <span style={{backgroundPosition: "-92px 0px"}} className="featuredProductImage"></span>
                        Personalized Stemless Wine Glass Favors
                     </a>
                  </Link>
                  <span className="darkPink">$1.19</span> <br />
                  <br />
                  <Link shallow className="foDetails" href="/page/FF/PROD/3421s">See Details</Link> <br className="clear" />
               </p>
            </div>
         </div>
      </Fragment>
   )
};

export default PersonalizedWeddingFavors;