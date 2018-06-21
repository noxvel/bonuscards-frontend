import React from 'react';
import {
  Alert
} from 'reactstrap';

function setColor(code) {
  if (code < 2000)
      return 'light';
  else if (code < 3000) 
      return 'success';
  else if (code < 4000)
      return 'warning';
  else if (code < 5000)
      return 'danger';
  else
      return 'light';
} 

function Message(props) {
  return ( 
    <Alert color = {
      setColor(props.statusCode.code) 
    }
    isOpen = {
      props.statusCode.code !== 1001 
    } > {
      props.statusCode.msg
    } 
    </Alert>

  )
};

export default Message;