import Head from 'next/head';
import {
   Box,
   Heading,
   List,
   ListItem,
   ListIcon,
   OrderedList,
   UnorderedList,
   AlertIcon,
   Alert
} from '@chakra-ui/react';

const Samples = props => {
   return (
      <Box>
         <Head>
            <title>Sample Wedding Favors</title>
            <meta name="keywords" content="wedding favor samples" />
            <meta name="description" content="How to order wedding favor samples from FavorFavor.com" />
            <meta name="robots" content="noodp, noydir" />
         </Head>

         <Heading as="h2" size="lg">
            Wedding Favor Samples
         </Heading>

         <p>You can order samples of any favor item in  our store. We will only ship complete sets of items that come in sets. Sorry, but the maximum number of samples we will send is 3, and each item must be a separate item from the others.</p>

         <UnorderedList style={{fontStyle:"italic",paddingLeft:"30px",marginTop:"10px",marginBottom:"10px"}}>
            <ListItem>Please note, samples may not be returned or exchanged.</ListItem>
            <ListItem>Order Confirmations will be sent within 48 hours.</ListItem>
            <ListItem>
               <Alert status='warning' style={{padding:"2px"}}>
                  <AlertIcon />
                  We cannot personalize or honor specific color or imprint selections for personalized items for samples. If you order a personalized item you will receive a random design and color.
               </Alert>
            </ListItem>
            <ListItem>Should you have any further questions or concerns, please feel free to <a href="http://www.favorfavor.com/contact_us.php">contact us</a> at any time!</ListItem>
            <ListItem><a href="/faq.html#canada">Canada shipping info</a></ListItem>
         </UnorderedList>

         <p>To order samples, simply browse to the items you&apos;re interested in and order a quantity of 1 for each item.</p>
      </Box>
   );
};

export default Samples;