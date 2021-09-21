import { Tabs,TabList,TabPanels,Tab,TabPanel,UnorderedList,ListItem } from "@chakra-ui/react";

import baskStyles from "../../styles/basket.module.scss";

const Policies = props => {
   return (
      <Tabs orientation={["vertical","vertical","vertical"]}>
         <TabList className={baskStyles.tabList}>
            <Tab>Shipping Policy</Tab>
            <Tab>Shipping Rates</Tab>
            <Tab>Shopping Cart Support</Tab>
         </TabList>

         <TabPanels className={baskStyles.tabPanel}>
            <TabPanel>
               <UnorderedList>
                  <ListItem><b>Expedited shipments</b>: charged at the carrier&apos;s published rates (those rates are shown in the checkout screen).</ListItem>
                  <ListItem><b>Personalized Glass Shipments</b>: Rates are higher due to extra packing. The correct rates are available at checkout.</ListItem>
                  <ListItem>Shipments to <b>Alaska, Hawaii and Puerto Rico</b> will be sent via 2nd Day Air.</ListItem>
                  <ListItem>Orders for non-personalized, <b>in stock merchandise</b>, require a minimum of 1-3 business days before shipping – this does not include the transit time.</ListItem>
                  <ListItem><b>Personalized items</b> (including stock items ordered with personalized tags):  the production time is shown on the individual product detail pages. <i>Please remember the production/processing time listed does not include the transit time.</i></ListItem>
                  <ListItem>Please note <b>transit times</b> are shown in business days which are Monday thru Friday only (Saturday, Sunday and holidays do not count as business days).</ListItem>
                  <ListItem><b>Deadline</b>: If an order is placed after 3:30 PM Eastern Time, it will be considered placed the next business day. For example, if you place an order on Monday at 8:15 PM - it is considered an order from Tuesday. All orders placed after 3:30 PM Friday or on the weekend will be considered to have been placed on the following Monday.</ListItem>
                  <ListItem>Delivery confirmation signatures are available, just fill in the &quot;Delivery Confirmation Signature Required&quot; checkbox when you check out.</ListItem>
               </UnorderedList>
            </TabPanel>
            <TabPanel>
               <p>All shipments will be made via Ground, unless another shipment method is chosen at checkout. All Ground shipments will be charged based on current rates.</p>
            </TabPanel>
            <TabPanel>
               <p>Having trouble checking out? Call us toll-free at <b>(516) 986-3285</b>, we&apos;ll be glad to help</p>
            </TabPanel>
         </TabPanels>
      </Tabs>
   );
};

export default Policies;