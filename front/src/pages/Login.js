import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import axios from '../config/axios'
import { Form, Button } from 'react-bootstrap';
import { RequiredMessage } from '../components/RequiredMessage/RequiredMessage'
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { entities } from './entities'
import '../components/Add/Add.css';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authSignIn, logged } = useAuth();
  const p = location.pathname.substring(1, location.pathname.length).split('/');
  const route = p[0];
  const entity = entities.find(x => x.route === route);
  const resource = entity.resource;
  const initItem = entity.obj;
  const schema = entity.schema;
  const fields = entity.fields;
  const title = entity.title;

  const [item, Setitem] =  useState(initItem);
  const signIn = (values) => {
    axios.post(`seguranca/${resource}`, values)
    .then((response) => {
      toast.success(response.data.message);
      authSignIn(true, response.data.nome, response.data.token, response.data.id);
      navigate(`/${location.state?.goTo ?? ''}`);
    })
    .catch((error) => { 
      toast.error(error.response?.data.message)
    })
  }
  
  const onSubmit = (values) =>{
    signIn(values);
  }

  return (
    <div  className="addForm">
          <Formik      
            enableReinitialize= {true}   
            validationSchema={schema}
            onSubmit={(values) => onSubmit(values)}
            initialValues={item}>
            {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <h2>{title}</h2>
                {fields.length && fields.map((item, index) => {
                  const controlId = `formBasic${item.label}`;
                  return(
                    <Form.Group key={index} className="mb-3" controlId={controlId}>
                      <Form.Label>{item.label}</Form.Label>
                      <Form.Control type={item.type} name={item.name} placeholder={item.placeholder} value={values[item.name]} required={item.required} disabled={logged}
                        onChange={handleChange} 
                        isInvalid={!!errors[item.name]}                  
                      />
                      {(item.required ?? false) && <RequiredMessage message={item.errorMessage ?? errors[item.name] }/>}
                    </Form.Group>               
                  )})
                }  

                <Button variant="primary" type="submit" className='btn' >Login</Button>

              </Form>
            )}   
          </Formik> 
        </div>  
    )
}
