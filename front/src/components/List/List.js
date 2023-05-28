import React, { useState, useEffect } from 'react'
import { FaRegEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import Table from 'react-bootstrap/Table';
import './List.css';
import { Button, Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from '../../config/axios'
import { toast } from 'react-toastify';
import { entities } from '../../pages/entities'

export const List = (props) => {
    const route = props.route;
    const title = props.title;
    const header = props.header;
    const [data, setData] =  useState([]);
    const [fields, setFields] =  useState([]);
    const [atr, setAtr] =  useState([]);
    const navigate = useNavigate();
    function handleClick(path) {
        navigate(path);
    }

    useEffect (() => {
        setFields(entities.find(x => x.route === route).fields);
        getItems();
      }, [])

    useEffect (() => {
        const atrr = [];
        fields.forEach(field => { atrr.push(field.name) });
        setAtr(atrr)
      }, [fields])

    const getItems = () => {
        axios.get(`${route}`)
        .then((response) => {
            setData(response.data)
        })
        .catch((error) => { 
            console.log(error)
            toast.error(error.response.data?.message)
        })
    }

    const onDelete = async (id) => {
        if(window.confirm(`Deseja deletar o item ${id}?`)){
            axios.delete(`${route}/${id}`)
            .then((response) => {
                toast.success(response.data.message);
                getItems();
            })
            .catch((error) => { 
                toast.error(error.response.data.message)
            })
        }
    }

  return (
    <div className='list'>
        <h2>{title}</h2>
        {!data.length && <Alert key='light' variant='light' > Nenhum item encontrado</Alert>}

        {data.length && <Table striped responsive>
            <thead>
                <tr>
                    {header && header.map((item, index) => {
                        return( <th key={index}>{item}</th> )
                        })
                    }
                    <th>Opções</th>
                </tr>
            </thead>
            <tbody>
                {data.length && data.map((item, index) => {
                    return(
                        <tr key={index}>
                            {atr && atr.map((proprietyName, id) => {
                                return(<td key={id}>{item[proprietyName]}</td>)
                            })}
                            <td key={atr.length} className='options'>
                                <div onClick={() => handleClick(`/${route}/edit/${item.id}`)}> <FaRegEdit /> </div>
                                <div onClick={() => handleClick(`/${route}/view/${item.id}`)}> <FaEye /> </div>
                                <div onClick={() => onDelete(item.id)}> <FaRegTrashAlt /> </div>
                            </td> 
                       </tr>                   
                    )})
                }
            </tbody>
            <tfoot>
            </tfoot>
        </Table>}
        <Button variant="primary" className='btn' onClick={() => handleClick(`/${route}/add`)}>Novo</Button>
    </div>
  )
}
