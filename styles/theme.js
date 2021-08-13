// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
let settings = {
   styles: {
      global: {
         body: {
            backgroundColor: "#bde6f8",
            backgroundImage: "url('https://www.favorfavor.com/images/misc/bodyBG.jpg')",
            backgroundRepeat: "no-repeat",
            margin: {
               xs: "0px",
               sm: "0px",
               md: "5px",
               lg: "5px 16px 5px 15px",
               xl: "5px 16px 5px 15px"
            }
         }
      }
   }
}

export const theme = extendTheme(settings);