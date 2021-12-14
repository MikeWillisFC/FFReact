import {Fragment} from "react";
import _ from "lodash";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";

import AllReviews from "../../components/AllReviews";

import styles from "../../styles/allReviews.module.scss";

const _fetchReviews = _.memoize(async (code,endpoint) => {
   return await axios.get(`${endpoint}&sft=reviews&code=${code}`);
});

const Reviews = props => {
   let globalConfig = useSelector((state)=>{
      return state.global;
   });
   //console.log("Reviews props",props);
   console.log("Reviews rendering");
   return (
      <Fragment>
         {
            props.reviews ? (
               <Fragment>
                  word yo
               </Fragment>
            ) : (
               <Fragment>boo</Fragment>
            )
         }
      </Fragment>
   );
   // return (
   //    <Fragment>
   //       {
   //          props.reviews ? (
   //             <Fragment>
   //                <p>
   //                   All Reviews for <Link href={`/page/FF/PROD/${props.code}`}><a className={styles.prodLink}>{props.reviews.pName}</a></Link>
   //                </p>
   //                <AllReviews domain={globalConfig.domain} reviews={props.reviews} code={props.code} />
   //             </Fragment>
   //          ) : (
   //             <Fragment>
   //                <p>
   //                   No Reviews yet for <Link href={`/page/FF/PROD/${props.code}`}><a className={styles.prodLink}>this item</a></Link>
   //                </p>
   //             </Fragment>
   //          )
   //       }
   //    </Fragment>
   // );
};

// server-side render and pre-render
export async function getStaticPaths() {
   let config = await import("../../config/config");
   let response = await axios.get(`https://${config.default.domain}/api/get/ti.php`);
   console.log("getStaticPaths response.data",response.data);
   return {
      //paths: [{ params: { code: '3421' } }, { params: { code: '3421s' } }],
      paths: response.data.items.map(item=>({ params: { code: item } })),
      fallback: true
   };
};
export async function getStaticProps(context) {
   //console.log("getStaticProps context",context);

   let config = await import("../../config/config");
   //console.log("config",config);

   //let response = await _fetchReviews(context.params.code,config.default.apiEndpoint_static);
   let response = await axios.get(`${config.default.apiEndpoint_static}&sft=reviews&code=${context.params.code}`);

   if ( response.status === 200 ) {
      console.log("response received");
      //console.log("reviews response:",response);
      let result = {props:{code:"3421s",reviews:response.data.reviews}};
      // console.log("result",result);
      // console.log("result.props.reviews.reviews",result.props.reviews.reviews);
      //return {props:{code:"3421s"}};
      //return result;
      return {
         props: {...response.data,code:context.params.code},
         revalidate: config.default.cacheKeepAlive.rvws
      }
   } else {
      console.log("response not received, returning something else");
      return {
         props: {code:context.params.code}
      }
   }
};

export default Reviews;