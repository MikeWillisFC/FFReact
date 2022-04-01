import {useState,useEffect,useCallback} from "react";
import { useSelector } from "react-redux";
import Head from 'next/head';
import {useRouter} from 'next/router';
import {
   Box,
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,

   useDisclosure
} from "@chakra-ui/react";

import styles from "../../styles/terms.module.scss";
import tabStyles from "../../styles/tabs.module.scss";

const Terms = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });

   const [st_tabIndex,sst_tabIndex] = useState(0);

   const router = useRouter();

   let onHashChangeStart = useCallback(url => {
      if ( url.indexOf("#PrivacyPolicy") !== -1 ) {
         sst_tabIndex(6);
      } else {
         // url.indexOf("#shipping") !== -1
         sst_tabIndex(0);
      }
   },[]);

   useEffect(() => {
        router.events.on("hashChangeStart", onHashChangeStart);
        return () => {
            router.events.off("hashChangeStart", onHashChangeStart);
        };
    }, [router.events,onHashChangeStart] );

    useEffect(()=>{
      onHashChangeStart(router.asPath);
   },[router.asPath,onHashChangeStart]);

   return (
      <Box>
         <Head>
            <title>Favor Favor Shipping and Terms and Conditions</title>
            <meta name="keywords" content="favor favor terms" />
            <meta name="description" content="Terms and Conditions for Favor Favor orders." />
            <meta name="robots" content="noodp, noydir" />
         </Head>

         <Tabs
            onChange={(index) => sst_tabIndex(index)}
            index={st_tabIndex}
            variant="enclosed"
            className={`${tabStyles.container}`}
         >
            <TabList mb="1em" className="blueHeader">
               <Tab>Shipping</Tab>
               <Tab>Samples</Tab>
               <Tab>Disclaimer</Tab>
               <Tab>Payments</Tab>
               <Tab>Damages</Tab>
               <Tab>Return Policy</Tab>
               <Tab>Privacy Policy</Tab>
            </TabList>

            <TabPanels>
               <TabPanel>
                  <p>
                     All shipments will be made via Ground, unless another shipment method is chosen at checkout.
                  </p>
               </TabPanel>

               <TabPanel>
                  <p>You can order samples of any favor item in our store. We will only ship complete sets of items that come in sets.  Sorry, but the maximum number of samples we will send is 3, and each item must be a separate item from the others. </p>
                  <p>To order samples, simply browse to the items you&apos;re interested in and order a quantity of 1 for each item.</p>
                  <p>
                     <strong>
                        **Please note, samples may not be returned or exchanged.
                     </strong>
                  </p>
               </TabPanel>

               <TabPanel>
                  <p>All content included on this site, such as text, graphics, logos, button icons, images and software, is the property of FavorFavor.com or its content suppliers and protected by United States and international copyright laws. The compilation of all content on this site is the exclusive property of FavorFavor.com and protected by U.S. and international copyright laws. All software used on this site is the property of FavorFavor.com or its software suppliers and protected by United States and international copyright laws. </p>
               </TabPanel>

               <TabPanel>
                  <p>We accept payment by credit card only.  We do not accept personal checks.</p>
               </TabPanel>

               <TabPanel>
                  <p>
                     We will replace any damaged or defective items that you receive as long as FavorFavor.com has the items available. If the goods are not currently available, we will issue you a refund for the damaged items.
                  </p>
                  <ul>
                     <li>
                        Please note, <span style={{color:"#f00", fontWeight: "bold"}}>damages for personalized glassware cannot be  replaced due to the set-up costs involved.</span> We can only offer a credit for the  damaged pieces.
                     </li>
                     <li>
                        <strong>
                           *Please note, that all orders must be inspected, and all claims for damages or shortages must be made within 48 hours after the receipt of the shipment.
                        </strong>
                     </li>
                     <li>We require pictures of damages, so we can show them to our supplier and replace them, or credit you for them.</li>
                  </ul>
               </TabPanel>

               <TabPanel>
                  <p>
                     If you are not satisfied with your favor order (sorry, no refunds on sample
                     orders) you may return the merchandise for an exchange or refund within 14 days of receipt of the goods. Please call us at <a href={`tel:${globalConfig.phoneNumberRaw}`}>{globalConfig.phoneNumber}</a> for a Return Merchandise Authorization (RMA) number.
                  </p>
                  <ul>
                     <li>All returns must be packaged in the original shipping cartons, including all packing materials.</li>
                     <li>Please mark the RMA number on the outside of all cartons being returned.</li>
                     <li>Call for instructions on returning the items.</li>
                     <li>Please note we do not accept partial returns. </li>
                     <li>We do not credit back shipping costs.</li>
                  </ul>
                  <blockquote style={{margin:"5px 40px"}}>
                     <b>FavorFavor.com</b><br />
                     Phone: <a href={`tel:${globalConfig.phoneNumberRaw}`}>{globalConfig.phoneNumber}</a><br />
                     <a href={`mailto:${globalConfig.customerServiceEmail}`}>{globalConfig.customerServiceEmail}</a>
                  </blockquote>
                  <ul>
                     <li>All returns and/or exchanges are subject to a restocking fee of 15%.</li>
                     <li>No refunds or exchanges on any personalized merchandise or food items.</li>
                  </ul>
               </TabPanel>

               <TabPanel>
                  <p className={styles.ppHeader}>www.favorfavor.com Privacy Policy</p>
                  <div className={styles.ppBody}>
                     <div className={styles.ppConsistencies}>
                        <div>
                           <p>Information Collection</p>
                        </div>
                        <div>
                           <p>Information Usage</p>
                        </div>
                        <div>
                           <p>Information Protection</p>
                        </div>
                        <div>
                           <p>Cookie Usage</p>
                        </div>
                        <div>
                           <p>3rd Party Disclosure</p>
                        </div>
                        <div>
                           <p>3rd Party Links</p>
                        </div>
                        <p></p>
                     </div>
                     <p style={{clear:"both",height:"10px"}}></p>
                     <div className={styles.ppConsistencies}>
                        <div>
                           <p>Google AdSense</p>
                        </div>
                        <div>
                           <div>
                              Fair Information Practices
                              <p style={{fontSize:"12px",position:"relative",left:"20px"}}>
                                 Fair information
                                 <br />
                                 Practices
                              </p>
                           </div>
                        </div>
                        <div>
                           <p> COPPA </p>
                        </div>
                        <div>
                           <p> CalOPPA </p>
                        </div>
                        <div>
                           <p>Our Contact Information<br /></p>
                        </div>
                     </div>

                     <p style={{clear:"both",height:"10px"}}></p>
                     <p >
                        This privacy policy has been compiled to better serve those who are concerned with how their &apos;Personally Identifiable Information&apos; (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an inpidual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.
                     </p>

                     <p>
                        <b>Information Collected from Visitors</b>
                        <br />
                        If you are a Visitor, we collect information on your use of our Site, such as pages visited, links clicked, non-sensitive text entered, and mouse movements, as well as information more commonly collected such as the referring URL, browser, operating system, cookie information, and Internet Service Provider (&quot;Usage Data&quot;). Our purpose in collecting Usage Information is to better understand how our Visitors use the Site. We do not use the Usage Information to identify our Visitors and we do not disclose the Usage Information other than under the circumstances described in this Privacy Policy.
                        <br /><br />

                        As a Visitor, we collect potentially personally identifying information like Internet Protocol (or &quot;IP&quot;) addresses (&quot;Potential PII&quot;). Also, you may choose to interact with the Site that results in your providing Personal Information to us, such as giving us your name, email address, user name and password when creating an account or placing an order, etc. You should be aware that any information you provide may be read, collected, and used by others who access them.
                     </p>

                     <span></span><br />
                     <p ><strong>What personal information do we collect from the people that visit our blog, website or app?</strong></p><br />
                     <p >When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, credit card information or other details to help you with your experience.</p><br />
                     <p ><strong>When do we collect information?</strong></p><br />
                     <p >We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form, Use Live Chat, Open a Support Ticket, Provide us with feedback on our products or services or enter information on our site.</p><br />
                     <p ><strong>How do we use your information? </strong></p><br />
                     <p > We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:<br /><br /></p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> To improve our website in order to better serve you.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> To allow us to better service you in responding to your customer service requests.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> To administer a contest, promotion, survey or other site feature.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> To quickly process your transactions.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> To ask for ratings and reviews of services or products</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> To follow up with them after correspondence (live chat, email or phone inquiries)</p><br />
                     <p ><strong>How do we protect your information?</strong></p><br />
                     <p >Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.<br /><br /></p>
                     <p >We use regular Malware Scanning.<br /><br /></p>
                     <p >Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology. </p><br />
                     <p >We implement a variety of security measures when a user places an order enters, submits, or accesses their information to maintain the safety of your personal information.</p><br />
                     <p >All transactions are processed through a gateway provider and are not stored or processed on our servers.</p><br />
                     <p ><strong>Do we use &apos;cookies&apos;?</strong></p><br />
                     <p >Yes. Cookies are small files that a site or its service provider transfers to your computer&apos;s hard drive through your Web browser (if you allow) that enables the site&apos;s or service provider&apos;s systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
                     <p ><br /><strong>We use cookies to:</strong></p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Help remember and process the items in the shopping cart.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Understand and save user&apos;s preferences for future visits.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Keep track of advertisements.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future. We may also use trusted third-party services that track this information on our behalf.</p>
                     <p ><br />You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser&apos;s Help Menu to learn the correct way to modify your cookies.<br /></p>
                     <p ><br /><strong>If users disable cookies in their browser:</strong></p><br />
                     <p >If you turn cookies off it will turn off some of the features of the site.</p><br />
                     <p ><strong>Third-party disclosure</strong></p><br />
                     <p >We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it&apos;s release is appropriate to comply with the law, enforce our site policies, or protect ours or others&apos; rights, property or safety. <br /><br /> However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses. </p><br />
                     <p ><strong>Third-party links</strong></p><br />
                     <p >We do not include or offer third-party products or services on our website.</p><br />
                     <p ><strong>Google</strong></p><br />
                     <p >Google&apos;s advertising requirements can be summed up by Google&apos;s Advertising Principles. They are put in place to provide a positive experience for users. https://support.google.com/adwordspolicy/answer/1316548?hl=en <br /><br /></p>
                     <p >We use Google AdSense Advertising on our website.</p>
                     <p ><br />Google, as a third-party vendor, uses cookies to serve ads on our site. Google&apos;s use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.<br /></p>
                     <p ><br /><strong>We have implemented the following:</strong></p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Remarketing with Google AdSense</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Demographics and Interests Reporting</p><br />
                     <p >We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website. </p>
                     <p ><br /><strong>Opting out:</strong><br />Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising Initiative Opt Out page or by using the Google Analytics Opt Out Browser add on.</p><br />
                     <p ><strong>California Online Privacy Protection Act</strong></p><br />
                     <p >CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law&apos;s reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those inpiduals or companies with whom it is being shared. - See more at: http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf<br /></p>
                     <p ><br /><strong>According to CalOPPA, we agree to the following:</strong><br /></p>
                     <p >Users can visit our site anonymously.</p>
                     <p >Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.<br /></p>
                     <p >Our Privacy Policy link includes the word &apos;Privacy&apos; and can easily be found on the page specified above.</p>
                     <p ><br />You will be notified of any Privacy Policy changes:</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> On our Privacy Policy Page<br /></p>
                     <p >Can change your personal information:</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> By emailing us</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> By logging in to your account</p>
                     <p ><br /><strong>How does our site handle Do Not Track signals?</strong><br /></p>
                     <p >We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place. </p>
                     <p ><br /><strong>Does our site allow third-party behavioral tracking?</strong><br /></p>
                     <p >It&apos;s also important to note that we do not allow third-party behavioral tracking</p><br />
                     <p ><strong>COPPA (Children Online Privacy Protection Act)</strong></p><br />
                     <p >When it comes to the collection of personal information from children under the age of 13 years old, the Children&apos;s Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States&apos; consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children&apos;s privacy and safety online.<br /><br /></p>
                     <p >We do not specifically market to children under the age of 13 years old.</p><br />
                     <p ><strong>Fair Information Practices</strong></p><br />
                     <p >The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.<br /><br /></p>
                     <p ><strong>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</strong></p>
                     <p >We will notify you via email</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Within 7 business days</p>
                     <p ><br />We also agree to the Inpidual Redress Principle which requires that inpiduals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that inpiduals have enforceable rights against data users, but also that inpiduals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.</p><br />
                     <p ><strong>CAN SPAM Act</strong></p><br />
                     <p >The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.<br /><br /></p>
                     <p ><strong>We collect your email address in order to:</strong></p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Send information, respond to inquiries, and/or other requests or questions</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Process orders and to send information and updates pertaining to orders.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Send you additional information related to your product and/or service</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Market to our mailing list or continue to send emails to our clients after the original transaction has occurred.</p>
                     <p ><br /><strong>To be in accordance with CANSPAM, we agree to the following:</strong></p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Not use false or misleading subjects or email addresses.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Identify the message as an advertisement in some reasonable way.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Include the physical address of our business or site headquarters.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Monitor third-party email marketing services for compliance, if one is used.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Honor opt-out/unsubscribe requests quickly.</p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Allow users to unsubscribe by using the link at the bottom of each email.</p>
                     <p ><strong><br />If at any time you would like to unsubscribe from receiving future emails, you can email us at</strong></p>
                     <p >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&bull;</strong> Follow the instructions at the bottom of each email and we will promptly remove you from <strong>ALL</strong> correspondence.</p><br />
                     <p ><strong>Contacting Us</strong></p><br />
                     <p >If there are any questions regarding this privacy policy, you may contact us using the information below.<br /><br /></p>
                     <p >www.favorfavor.com</p>
                     <p >414 S Service Road #318, Patchogue, NY 11772</p>
                     <p >United States</p>
                     <p >customer_service@favorfavor.com</p>
                     <p ><br />Last Edited on 2018-05-24</p>
                  </div>
               </TabPanel>
            </TabPanels>
         </Tabs>
      </Box>
   );
};

export default Terms;