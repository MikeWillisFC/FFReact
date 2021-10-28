import {
   Box,
   Heading
} from "@chakra-ui/react";

import HorizontalProductList from "../HorizontalProductList";

import styles from "../../styles/alsoShopped.module.scss";

const AlsoShopped = props => {
   return (
      <Box className={styles.alsoShopped}>
         <Heading
            as="h4"
            size="md"
            className="lightBlue"
         >
            Customers also shopped for these favors...
         </Heading>

         {
            true && (
               <HorizontalProductList
                  rowNumber={1}
                  items={props.items}
                  resetWidth={true}
               />
            )
         }
      </Box>
   );
};

export default AlsoShopped;