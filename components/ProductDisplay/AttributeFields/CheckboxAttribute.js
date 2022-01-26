import {Fragment,useState,useCallback} from "react";
import { Checkbox,Tag } from "@chakra-ui/react";

const CheckboxAttribute = props => {
   const [st_checked,sst_checked] = useState(false);

   console.log("CheckboxAttribute, props:",props);
   let {onChange} = props;
   let handleChange = useCallback(event=>{
      if ( event.defaultPrevented ) {
         // do nothing, we handled this shit already
      } else {
         event.preventDefault();
         // console.log("----------");
         // console.log("----------");
         // console.log("handleChange called, event:",event);
         // console.log("event.target:",event.target);
         // console.log("event.currentTarget:",event.currentTarget);
         // console.log("target class:",event.target.getAttribute("class"));
         // console.log("handling");
         sst_checked(prevState=>{
            //console.log("prevState",prevState);
            let checked = !prevState;
            //console.log("checked",checked);
            onChange(null,(checked ? "Yes" : ""));
            return checked;
         });
      }
   },[onChange]);

   return (
      <Fragment>
         { props.attribute.prePrompt || "" }
         <Tag
            colorScheme="blue"
            className={props.styles.checkAttribute}
            onClick={handleChange}
         >
            <Checkbox
               isChecked={st_checked}
            >
               {props.attribute.prompt}
            </Checkbox>
         </Tag>
      </Fragment>

   );
}; // CheckboxAttribute

export default CheckboxAttribute;