/* 2021-07-19: see https://github.com/chakra-ui/chakra-ui/issues/3020
* once that bug is really fixed, we can remove this and copy the return
* and paste it into the appropriate spot in Header.js. Until
* then, this gets around the issue by forcing this component to not
* use SSR, which is not an ideal solution
*/
import { FaCaretRight } from 'react-icons/fa';
import {
   Icon,
   Menu,
   MenuButton,
   MenuList,
   MenuItem
} from "@chakra-ui/react";
import headerStyles from "../styles/header.module.css";
const HeaderSiteAssistanceMenu = (props) => {
   return (
      <Menu>
         <MenuButton><Icon as={FaCaretRight} color="#F167A8" />Site Assistance</MenuButton>
         <MenuList className={headerStyles.siteAssistanceNavDropdown}>
            <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/aboutus.html">About Us</a></MenuItem>
            <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/contact_us.php">Contact Us</a></MenuItem>
            <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/order-favor-samples.php">Samples</a></MenuItem>
            <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/terms_etc.php">Terms & Conditions</a></MenuItem>
            <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/terms_etc.php#shipping">Shipping</a></MenuItem>
            <MenuItem><Icon as={FaCaretRight} color="#F167A8" /><a href="/terms_etc.php#PrivacyPolicy">Privacy</a></MenuItem>
         </MenuList>
      </Menu>
   );
};

export default HeaderSiteAssistanceMenu;