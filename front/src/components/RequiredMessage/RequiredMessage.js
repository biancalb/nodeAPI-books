import React from 'react'
import { Form } from 'react-bootstrap';

export const RequiredMessage = (props) => {
  return (
    <Form.Control.Feedback type="invalid">{props.message}</Form.Control.Feedback>                    
    )
}
