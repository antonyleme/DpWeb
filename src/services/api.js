import axios from 'axios';
//import { store } from '../store';

//store.subscribe(listener)

//const api = axios.create({ baseURL: 'https://api.persistir.codenative.com.br/api' });
const api = axios.create({ baseURL: 'http://10.0.0.133:8000/api' });
api.defaults.headers.post['Content-Type'] = 'application/json'

//function listener() {
//  api.defaults.headers.common['Authorization'] = 'Bearer ' + store.getState().auth.token;
//}

export default api;