import { Box,Center,Stack,Grid,List, ListItem, ListIcon, OrderedList, UnorderedList } from "@chakra-ui/react";

import styles from "../styles/leftnav.module.scss";

const LeftNav = (props) => {
   return (
      <Box className={styles.leftnav}>
         <h3 className={styles.pink}>WEDDING FAVORS</h3>
         <UnorderedList>
            <ListItem><a href="/page/FF/CTGY/Glassware">Printed Glasses</a></ListItem>
            <ListItem>
               <a href="/page/FF/CTGY/PersonalizedWeddingFavors">
                  <span class="lText">Personalized Favors</span>
                  <span class="lArrow"></span>
                  <br class="clear" />
               </a>
               <ul class="subcategories hideMe" id="subcat-PersonalizedWeddingFavors">
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
                  <div class="deptPreviewBC hideMe"></div>
                  <div class="deptPreview">
                     <ul class="fLeft">
                        <li><a href="/page/FF/CTGY/Glassware">Glasses: Shot, Wine, Flutes etc</a></li>
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
                     <div class="foFeaturedProducts fRight ui-corner-all posRel">
                        <p class="foBestOffer nomarg"></p>
                        <p class="foFeaturedProduct foFeaturedProduct1"> <a href="/page/FF/PROD/5863s"><span class="featuredProductImage"></span> Personalized Votive Candle Favors</a> <span class="darkPink">$0.89</span> <br>
                           <br>
                              <a class="foDetails" href="/page/FF/PROD/5863s">See Details</a> <br class="clear">
                              </p>
                              <p class="foFeaturedProduct"> <a href="/page/FF/PROD/3421s"><span style="background-position: -92px 0px;" class="featuredProductImage"></span> Personalized Stemless Wine Glass Favors</a> <span class="darkPink">$1.19</span> <br>
                                 <br>
                                    <a class="foDetails" href="/page/FF/PROD/3421s">See Details</a> <br class="clear">
                                    </p>
                                 </div>
                              </div>
            </ListItem>
            <ListItem>Integer molestie lorem at massa</ListItem>
            <ListItem>Facilisis in pretium nisl aliquet</ListItem>
         </UnorderedList>
      </Box>
   );
};

export default LeftNav;