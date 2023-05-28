import * as yup from 'yup';

export const entities = [
    { 
        route: 'login', 
        resource: 'login',
        title: 'Login',
        obj: {
            login: '',
            senha: '',
        },
        schema: yup.object().shape({
            login: yup.string().required(),
            senha: yup.string().required(),
        }),
        fields: [
            {   
                name: 'login',
                label: 'Usuário',
                placeholder: 'Usuário',
                type: 'text',
                errorMessage: 'Obrigatório',
                required: true
            },
            {   
                name: 'senha',
                label: 'Senha',
                placeholder: 'Senha',
                type: 'password',
                errorMessage: 'Obrigatório',
                required: true
            },
        ],
    },
    { 
        route: 'livros', 
        resource: 'livros',
        title: 'Livros',
        obj: {
            nome: '',
            autor: '',
            valor: '',
        },
        schema: yup.object().shape({
            nome: yup.string().required(),
            autor: yup.string().required(),
            valor: yup.number().min(0).required(),
        }),
        fields: [
            {   
                name: 'nome',
                label: 'Nome',
                placeholder: 'Nome',
                type: 'text',
                errorMessage: 'Obrigatório',
                required: true
            },
            {   
                name: 'autor',
                label: 'Autor',
                placeholder: 'Autor',
                type: 'text',
                errorMessage: 'Obrigatório',
                required: true
            },
            {   
                name: 'valor',
                label: 'Valor',
                placeholder: 'Valor',
                type: "number",
                required: true
            },
        ]
    }
]
