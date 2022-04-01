import { useSelector } from "react-redux";
import Head from 'next/head';
import {
   Box,
   Heading
} from '@chakra-ui/react';

const AboutUs = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   return (
      <Box>
         <Head>
            <title>About Favor Favor Wedding Favors</title>
            <meta name="description" content="About FavorFavor.com and our Wedding Favors. We offer a large selection of popular wedding favors, including chocolates, bottle stoppers and wine glasses." />
            <meta name="keywords" content="favorfavor, wedding favors" />
            <meta name="robots" content="noodp, noydir" />
         </Head>

         <Heading as="h2" size="lg">
            About Us
         </Heading>

         <p style={{margin:"10px"}}>Wedding favors are the speciality at this wedding favor online store. Personalized and plain, a wide variety of wedding favors are available to buy online, all offered at the best prices at this online retail shopping location. Bridal shower party gifts and more, anything you need as mementos of participation in your special occasion. The gifts and items sold here accompany your journey with all the inherent traditions, from the first moment of planning until your drive off on your honeymoon. You can maintain established traditions, and create new ones, for your special day. As the United States, and now most of the industrialized world, is referred to as a &quot;melting pot&quot; of cultures, the philosophy of this retailer is that weddings and showers--two of life&apos;s most symbolic milestones--are rife with tradition. Many of the wedding, baby and shower items sold here have their roots in varying cultural traditions.</p>

         <Heading as="h3" size="md">&ldquo;Something old, Something new, Something borrowed, Something blue, And a sixpence in the shoe.&rdquo;</Heading>

         <p style={{margin:"10px"}}>According to Victorian tradition, the &quot;old&quot; in that familiar rhyme came from that which had belonged to a happily married woman. The wearing of such an item insures a lucky transfer of happiness to the new bride. Our pewter items, frames, placecard holders and whimsical items reflect a quaint and antique appearance.  The &quot;borrowed&quot; must be some object of gold to guarantee wealth and fortune in the future. With our many gold-toned selections, this tradition is easy to fulfill. Browse the selection of white items sold here. White is generally the accepted color for the formal affair. White is, of course, the symbol of purity and innocence--a symbol which goes back to the days of the Ancient Greeks. Throughout time and cultures, the heart has symbolized love. A selection of hearts items available to suit every bride and groom&apos;s taste, allowing them to share their love with their friends and families. Lamps and candles, in many cultures, represent light against the darkness, and cups symbolize bounty. Allow the lamp, cup and candle products offered on these pages underscore the traditions.</p>

         <p style={{margin:"10px"}}>Other products include: various designs of bells, bubbles, cameras, candle holders, place card holders,  Mikasa(R)  crystal, sports mug, personalized ribbons, ceramic mugs, champagne flute, votive holder, glass mug, glass vase, champagne flute with a straight stem, shot glass-votive holder, tall champagne flute, toasting flutes, trinket box, flask,  money clip/credit card holder, engraved key chain, personalized wine box, engraved lighter, personalized votive cup/candle, ring pillows, silver, chrome and pewter products, Having spent over 25 years in the party and favor business, the knowledge and experience garnered over that time is shared with you, through the vast array of lovely and traditional selections, and the user friendly, interactive online shopping experience. Please take your time and enjoy browsing the pages of this shopping website. If you have any questions or need further information on specific products and options, please feel free to e-mail (<a href={`mailto:${globalConfig.customerServiceEmail}`}>{globalConfig.customerServiceEmail}</a>) or call <a href={`tel:${globalConfig.phoneNumberRaw}`}>{globalConfig.phoneNumber}</a>.</p>

         <blockquote style={{margin:"5px 40px"}}>
            <b>FavorFavor.com</b><br />
            Phone: <a href={`tel:${globalConfig.phoneNumberRaw}`}>{globalConfig.phoneNumber}</a><br />
            <a href={`mailto:${globalConfig.customerServiceEmail}`}>{globalConfig.customerServiceEmail}</a>
         </blockquote>
         <p>Favor Favor is a New York based company.</p>
      </Box>
   );
};

export default AboutUs;