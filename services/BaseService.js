import axios from 'axios'
import {GET} from './RequestMethods';
import {redirectLogin} from "../helpers/page";
import {is_authed_async} from "../helpers/user";
import {get, includes, set} from 'lodash';

//import store from 'utils/reduxStore';
//import {doLogout} from "../actions";
//import {general_error_toastr} from "../components/partials/Notification";

import {Auth} from 'aws-amplify';
import {randomString} from "../helpers/string";
import storage from '../helpers/storage';

let cancel_obj = {};

/**
 * Allow component to cancel an api request
 * @param key
 * @returns {boolean}
 */
export const trigger_cancel = (key) => {
    const cancel_func = get(cancel_obj, key);

    if (!cancel_func) {
        return true;
    }

    cancel_func('canceled')
    cancel_obj = set(cancel_obj, key, undefined);
};

export default class BaseService {
    allow_404_redirect = false;
    cancel_id = undefined;

    async submitRequestWithPromise(method, baseURL, url, params = {}, api_version, allow_404_redirect, headers = {}) {
        this.allow_404_redirect = allow_404_redirect;

        let cancelToken = undefined;

        if (this.cancel_id) {
            const tmp_cancel_token = axios.CancelToken.source();

            cancelToken = tmp_cancel_token.token;
            set(cancel_obj, this.cancel_id, tmp_cancel_token.cancel);
        }

        return this.accessToken().then(async auth_token => {

            // add cache busting for internet explorer
            if (method == GET) set(params, 'randStr', randomString());

            const config = {
                url,
                baseURL,
                method,
                headers: {
                    ...{
                        'x-api-key': 'ntV4QlG0kMIKjdjNgDJB1N2Uwn1RNkB7oKF3TVe2',
                        "content-type": 'application/json',
                    },
                    // Merge headers passed in with the presets
                    ...headers
                },

                cancelToken,

                [method == GET ? 'params' : 'data']: params,
            };

            // if auth then set the token
            if (auth_token) {
                config.headers['Authorization'] = `Bearer ${auth_token}`;
            }

            axios.interceptors.response.use(
                async response => response, error => {
                    const {response} = error;
                    const {status = '0'} = response || {};
                    //const dispatch = store().dispatch;

                    if (axios.isCancel(error)) {
                        return Promise.reject({message: 'canceled', response: {status: 204}});
                    }

                    // Do something with response error
                    switch (status) {
                        case 401:
                            storage.setItem('st.authed', '0');

                            if (includes(window.location.pathname, '/account')) {
                                return redirectLogin();
                            } else {
                                //dispatch(doLogout());
                            }
                            break;
                        case 500:
                            //general_error_toastr();
                            break;
                    }
                    return Promise.reject(error);
                });

            return axios
                .request(config)
                .then(response => {
                    return response.data
                });
        });
    }

    async accessToken() {

        try {
            const res = await Auth.currentSession();
            const idToken = res.idToken;

            return idToken.getJwtToken();
        } catch (e) {
            return false;
        }
    }

    missingData = (message) => new Promise((resolve, reject) => reject(message));

    buildFileParams = (file, field_name = 'file') => {
        const headers = {
            'content-type': 'multipart/form-data'
        };
        const params = new FormData();
        params.append(field_name, file, file.name);
        params.append('type', file.type);
        params.append('name', file.name);
        params.append('size', file.size);

        return {params, headers};
    };

    // TODO :: revert this to async and use auth_authed_cache to clean up this code and the function calls. to remove the unnecessary promise calls.
    publicAuthedUrl = async (public_url, authed_url = true) => {
        const authed = await is_authed_async();

        if (authed && authed_url == true) {
            return 'authed/' + public_url;
        } else if (authed) {
            return authed_url;
        }

        return public_url;
    };

}
