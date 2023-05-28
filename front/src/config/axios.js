import axios from 'axios'

const token = localStorage.getItem('token');

export default axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 
        process.env.REACT_APP_PRODUCTION_URL 
        : process.env.REACT_APP_DEVELOPMENT_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        },
})