/* 2021-07-08: because I don't want to have to separately import
* the styles in every component I use this in. How annoying.
*/
import ReactDatePicker from "react-datepicker";

import CustomInput from "./CustomInput";

import "react-datepicker/dist/react-datepicker.css";
//import "../../styles/react-datepicker-overrides.css"; // this is MY file! If you update react-datepicker, you MUST re-create this file!
//import "react-datepicker/dist/overrides.css"; // this is MY file! If you update react-datepicker, you MUST re-create this file!

const DatePicker = (props) => {
   return (
      <form autoComplete="off">
         <ReactDatePicker
            autoComplete="off"
            customInput={<CustomInput />}
            {...props}
         />
      </form>
   );
};

export default DatePicker;