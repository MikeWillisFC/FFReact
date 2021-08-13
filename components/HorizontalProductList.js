import {Fragment} from "react";
import Link from "next/link";

import ProductThumb from "./ProductThumb";

import styles from "../styles/horizontalProductList.module.scss";

const HorizontalProductList = (props) => {
   return (
      <div className={styles.list}>
         <h2 className="darkBlue">
            <Link href={props.target}>{props.text}</Link>
         </h2>
         <div className={styles.itemsContainer}>
            <div className={styles.items}>
               {
                  props.items.map(item=>{
                     return <ProductThumb key={item.code} size="medium" {...item} />
                  })
               }
            </div>
         </div>
      </div>
   );
};

export default HorizontalProductList;