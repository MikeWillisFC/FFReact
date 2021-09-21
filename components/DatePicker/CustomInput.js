import React from "react";
import { InputGroup,Input,InputRightElement,Icon } from "@chakra-ui/react";
import { FaCalendarAlt } from 'react-icons/fa';

class CustomInput extends React.Component {
   render() {
      return (
         <InputGroup>
            <Input {...this.props} onKeyPress={event=>event.preventDefault()} />
            <InputRightElement
               pointerEvents="none"
            >
               <Icon
                  as={FaCalendarAlt}
                  color="#ccc"
               />
            </InputRightElement>
         </InputGroup>
      );
   }
};

// the functional version generates a warning about refs
// const CustomInput = (props) => {
//    console.log("propsB",props);
//    return (
//       <InputGroup>
//          <Input {...props} />
//          <InputRightElement children={<Icon as={FaCalendarAlt} color="#ccc" />} />
//       </InputGroup>
//    );
// };

export default CustomInput;