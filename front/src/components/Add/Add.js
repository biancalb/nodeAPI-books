import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import axios from '../../config/axios'
import { entities } from '../../pages/entities'
import { RequiredMessage } from '../RequiredMessage/RequiredMessage'
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import './Add.css';

export const Add = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const p = location.pathname.substring(1, location.pathname.length).split('/');

  const route = p[0];
  const action = p[1];
  const entity = entities.find(x => x.route === route);
  const resource = entity.resource;
  const initItem = entity.obj;
  const schema = entity.schema;
  const fields = entity.fields;
  const title = entity.title;

  const [id, setId] =  useState(0);
  const [item, Setitem] =  useState(initItem);
  
  function handleClick(path) {
    navigate(path);
  }

  useEffect(() => {
    Setitem(initItem)
    if(p.length > 2 && !Number.isNaN(p[p.length -1])){
      setId(parseInt(p[p.length -1]));
    } 
  }, [])

  useEffect(() => {
      if(id){
        getItem(id, resource);
      }  
  }, [id])

  const getItem = (id, resource) => {
    axios.get(`${resource}/${id}`)
    .then((response) => {
      Setitem({...response.data[0]})
    })
    .catch((error) => { 
      toast.error(error.response.data.message)
    })
  }

  const onSave = (values) => {
    axios.post(`${resource}`, values)
    .then((response) => {
      toast.success(response.data.message)
      navigate(`/${resource}`);
    })
    .catch((error) => { 
      toast.error(error.response.data.message)
    })
  }
  
  const onEdit = (values) => {
    axios.put(`${resource}/${id}`, values)
    .then((response) => {
      toast.success(response.data.message)
      navigate(`/${resource}`);
    })
    .catch((error) => { 
      toast.error(error.response?.data.message)
    })
  }

  const onSubmit = (values) =>{
    id !== 0 ? onEdit(values) : onSave(values);
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
            <h2>Adicionar {title}</h2>
            {fields.length && fields.map((item, index) => {
              const controlId = `formBasic${item.label}`;
              return(
                <Form.Group key={index} className="mb-3" controlId={controlId}>
                  <Form.Label>{item.label}</Form.Label>
                  <Form.Control type={item.type} name={item.name} placeholder={item.placeholder} value={values[item.name]} required={item.required} disabled={action === 'view'}
                    onChange={handleChange} 
                    isInvalid={!!errors[item.name]}                  
                  />
                  {(item.required ?? false) && <RequiredMessage message={item.errorMessage ?? errors[item.name] }/>}
                </Form.Group>               
              )})
            }
            <Button variant="secondary" className='btn' onClick={() => handleClick(`/${route}`)}>Voltar</Button>    

            <Button variant="primary" type="submit" className='btn' >Salvar</Button>

          </Form>
        )}   
      </Formik> 
    </div>
  )
}
