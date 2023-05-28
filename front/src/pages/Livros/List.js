import React from 'react'
import { List as ListTemplate } from '../../components/List/List';

export const List = () => {
  return (
    <ListTemplate 
      route="livros"
      title="Livros"
      header={['Nome', 'Autor', 'Valor']} 
      obj={{nome: '', autor: '', valor: '' }} 
    />
  )
}
