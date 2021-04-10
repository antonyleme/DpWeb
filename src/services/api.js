import axios from 'axios';
//import { store } from '../store';

//store.subscribe(listener)

//const api = axios.create({ baseURL: 'http://localhost:8888/api' });
const api = axios.create({ baseURL: 'https://api.dp.codenative.com.br/api' });
api.defaults.headers.post['Content-Type'] = 'application/json'

//function listener() {
//  api.defaults.headers.common['Authorization'] = 'Bearer ' + store.getState().auth.token;
//}

export default api;