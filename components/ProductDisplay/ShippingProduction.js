import {Fragment} from "react";
import Image from 'next/image';
import {
   Table,
   Tr,
   Td,
   Box
} from "@chakra-ui/react"

const ShippingProduction = props => {

   let getMap = manufacturer => {
      let result = {};

      let cathysConcepts = { location: "Indiana", mapPath: "/images/misc/upsMaps/ups-46216-in.gif" };
      let veronicasTreats = { location: "Massachusetts", mapPath: "/images/misc/upsMaps/02346-massachusetts-veronicasTreats.gif" };

      switch( manufacturer ) {
         case "Fashioncraft":
         case "Natural Star":
         case "Rhode Island Novelty":
         result = { location: "New York", mapPath: "/images/misc/upsMaps/UPS_NY.gif" };
         break;
         case "Chandler Candle": result = { location: "California", mapPath: "/images/misc/upsMaps/ups-ca-95623.gif" }; break;
         case "Designing Ducks": result = { location: "Pennsylvania", mapPath: "/images/misc/upsMaps/spa.gif" }; break;
         case "Event Blossom": case "EventBlossom": result = { location: "California", mapPath: "/images/misc/upsMaps/california-92780-EB.gif" }; break;
         case "Impressions by Brianna": result = { location: "New York", mapPath: "/images/misc/upsMaps/ups-ny-13760-impressionsbb.gif" }; break;
         case "JDS": case "JBS": result = { location: "Minnesota", mapPath: "/images/misc/upsMaps/smn.gif" }; break;
         case "Kate Aspen": result = { location: "Georgia", mapPath: "/images/misc/upsMaps/UPS_GA.gif" }; break;
         case "Levie": result = { location: "New Jersey", mapPath: "/images/misc/upsMaps/snj.gif" }; break;
         case "Pixior": result = { location: "California", mapPath: "/images/misc/upsMaps/california-92780-EB.gif" }; break;
         case "The Mint Box": result = { location: "Maryland", mapPath: "/images/misc/upsMaps/ups-21784-mb.gif" }; break;
         case "The Wedding Pen Company": result = { location: "Tennessee", mapPath: "/images/misc/upsMaps/ups-37064-wpen.gif" }; break;
         case "Wedding Ship": result = { location: "California", mapPath: "/images/misc/upsMaps/california-92780-EB.gif" }; break;
         case "Elsies Daughter": result = { location: "Vermont", mapPath: "/images/misc/upsMaps/ups-05462-elsiesd.gif" }; break;
         case "Lillian Rose": result = { location: "Wisconsin", mapPath: "/images/misc/upsMaps/ups-53149-wisconsin-lillianrose.gif" }; break;
         case "Cathys Concepts": result = cathysConcepts; break;
         case "Wedding Olala": result = { location: "Nevada", mapPath: "/images/misc/upsMaps/ups-89103-vegas-weddingolala.gif" }; break;
         case "Wedding Belle": result = { location: "Oregon", mapPath: "/images/misc/upsMaps/ups-97013-oregon-weddingbelle.gif" }; break;
         case "Lorenzo": result = { location: "Connecticut", mapPath: "/images/misc/upsMaps/06704-lorenzo.gif" }; break;
         case "Lady Fortunes": result = { location: "California", mapPath: "/images/misc/upsMaps/91304-lady-fortunes.gif" }; break;
         case "Go To Baby": result = { location: "Connecticut", mapPath: "/images/misc/upsMaps/06082-go-to-baby.gif" }; break;
         case "Wholesale Kid": result = { location: "Kansas", mapPath: "/images/misc/upsMaps/66951-wholesale-kid.jpg" }; break;
         case "Baby Laundry": result = { location: "Utah", mapPath: "/images/misc/upsMaps/84043-babyLaundry.gif" }; break;
         case "Cassiani": result = { location: "New York", mapPath: "/images/misc/upsMaps/ups-11105-ny-cassiani.gif" }; break;
         case "Wedding Star": case "WeddingStar": result = { location: "Montana", mapPath: "/images/misc/upsMaps/fedex-59484-mt-weddingStar.png" }; break;
         case "Hortense B Hewitt": case "Hortense B. Hewitt": result = { location: "Montana", mapPath: "/images/misc/upsMaps/ups-56003-MT-HBH.gif" }; break;
         case "Ivy Lane": result = { location: "60064", mapPath: "/images/misc/upsMaps/fedex-60064-chicago.jpg" }; break;
         case "DLusso Designs": result = { location: "10989", mapPath: "/images/misc/upsMaps/10989-dlusso.gif" }; break;
         case "Chocolate By Design": result = { location: "New York", mapPath: "/images/misc/upsMaps/11779-chocolatesByDesign.gif" }; break;
         case "Veronicas Treats": result = veronicasTreats; break;
         case "asdf": result = { location: "asdf", mapPath: "asdf" }; break;
         default:
         if ( manufacturer.substring( 0, 5 ) === "Cathy" ) {
            result = cathysConcepts;
         } else if ( manufacturer.substring( 0, 8 ) === "Veronica" ) {
            result = veronicasTreats;
         }
         break;

      }
      return result;
   }; // getMap

   let mfrMap = getMap( props.manufacturer );

   return (
      <Box className={props.styles.stats}>
         <Table className="darkBlue">
            <Tr>
               <Td>Availability</Td>
               <Td>
                  <b>{props.availability}</b>
               </Td>
            </Tr>
         </Table>

         <p className="nomarg">
            This product will be shipped from {mfrMap.location || ""}. See below for transit time (in business days) for Ground Service.
            <span style={{color: "#f00"}}>Transit times do not include order processing time.</span> See <a href="/terms_etc.php#shipping">shipping info</a> for details.
            <Image src={`https://${props.globalConfig.domain}${mfrMap.mapPath}`} alt="Ground Transit Times" height="353" width="546" />
         </p>
      </Box>
   );

}; // ShippingProduction

   export default ShippingProduction;