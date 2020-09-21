import axios from 'axios';
import {environment} from './environment'

export const login = (email, password) => {
    const data = {
        grant_type: 'password',
        client_id: 'StWebApp',
        scope: 'offline_access',
        username: email,
        password: password
    };

    return axios.post(`${environment.authEndPoint}/auth/token`, data,
        {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        })
};

export const refresh = (refresh_token) => {
    const data = {
        grant_type: 'refresh_token',
        client_id: 'StWebApp',
        scope: 'offline_access',
        refresh_token: refresh_token,
    };

    return axios.post(`${environment.authEndPoint}/auth/token`, data,
        {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        })
};
