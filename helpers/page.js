import querystring from "querystring";
import {forEach} from 'lodash';
import {_GET} from "./request";
//import {general_form_error_toastr} from "components/partials/Notification";
import {CredentialsStorage} from "./CredentialStorage";
import {APP_CONFIG} from "../utils/Config";
import storage from "./storage";

/**
 * scrolls to first occurrence of the query string.
 * @param queryString
 * @param offset
 * @param speed
 */
export const scrollToElement = (queryString, offset = 200, speed = 500) => {
    if (typeof window != 'undefined' && window.jQuery(`${queryString}`).first().offset()) { // catch undefined .top errors
        window.jQuery('html, body').animate({
            scrollTop: window.jQuery(`${queryString}`).first().offset().top - offset
        }, speed);
    }
};

export const scrollToFirstError = ({offset = 266} = {}) => {
    setTimeout(() => {
        scrollToElement('.parsley-has-error', offset);
    }, 200);
};

export const scrollTo = (top, left = 0, offset = 200, speed = 500) => {
    typeof window != 'undefined' && window.jQuery('html, body').animate({
        scrollTop: top - offset
    }, speed);
};

export const autoShowTab = (tab, {timeout = 1} = {}) => {
    let retry_count = 10;

    const interval = setInterval(() => {
        if (typeof window != 'undefined' && window.$ && window.$(`#${tab}`).length > 0) {
            window.$(`a[href="#${tab}"]`).click();
            clearInterval(interval);
        } else if (--retry_count < 1) {
            clearInterval(interval);
        }
    }, timeout)
};

export const loginLink = ({redirect_to: _redirect_to = undefined, force = false, default_url = '/'} = {}) => {
    const {pathname = '/', search = ''} = typeof window != 'undefined' && window.location || {};

    const redirect_to = _redirect_to? _redirect_to: pathname;

    let redirect_link = redirect_to;
    const old_redirect_url = _GET('state');

    if (redirect_to == '/account/reset-password' || force == true) redirect_link = default_url;

    if (old_redirect_url && force === false) redirect_link = old_redirect_url;

    if (redirect_link == '/') {
        return '/account/login?state=/';
    }

    return `/account/login?state=${encodeURIComponent(redirect_link + search)}`;
};

export const redirectLogin = (params = {}) => {
    if (typeof window != 'undefined') window.location = loginLink(params);

    return false;
};

export const pageLoadFormFill = (fill_vars = [], search_obj = {}, {input_update = false, fill_vars_update = []}) => {
    if (typeof window != 'undefined' && window.location.search) {
        const params = querystring.parse(window.location.search.substr(1));

        // populate the search obj with stuff from the address bar
        forEach(fill_vars, (item) => {
            if (params[item]) {
                if (input_update && fill_vars_update.indexOf(item) >= 0) {
                    input_update({target: {name: item, value: params[item]}});
                }
                search_obj[item] = params[item];
            } else {
                if (fill_vars_update.includes(item)) {
                    delete search_obj[item];
                }
            }
        });
    } else {
        forEach(fill_vars_update, (name) => {
            input_update && input_update({target: {name, value: ''}});
        });
    }

    return search_obj;
};

export const readParamsAndDoSearch = ({search_obj_set, params_refill: {fill_vars = [], fill_vars_update = []}, search_obj = {}, input_update}) => {
    const _search_obj = pageLoadFormFill(fill_vars, search_obj, {input_update, fill_vars_update});

    search_obj_set(_search_obj);
};

export const setQueryString = ({search_obj = {}} = {}, cleanup = false) => {

    if (cleanup) {
        Object.keys(search_obj).forEach(key => {
            if (!search_obj[key]) {
                delete search_obj[key];
            }
        })
    }

    const queryParams = {};
    for (const key of Object.keys(search_obj)) {
        const val = search_obj[key];
        if (val && (typeof val == 'string' && val.length > 0) || (typeof val == 'number')) {
            queryParams[key] = val;
        }
    }

    // cleanup of the params on the query string
    let search_str = querystring.stringify(queryParams)
        .replace(/&+/g, '&') // remove duplicate groups of &
        .replace(/([&?])$/, ''); // remove trailing & and ?

    // if the search string is the same then don't push history. try to remove some duplication.

    if (typeof window != 'undefined') {
        if (window.location.search == `?${search_str}`) {
            return true;
        }
        if (search_str) {
            window.history.pushState('', '', `?${search_str}`);
        } else {
            window.history.replaceState('', '', window.location.pathname)
        }
    }
};

export const is_env = (which = 'local|dev') => {
    const {REACT_APP_ENV} = process.env;
    return which.includes(REACT_APP_ENV);
};

export const open_url_new_tab = (url = '', target = '_blank') => url && typeof window != 'undefined' && window.open(url, target);

/**
 * used for the form element, as a pre validate before submitting the form
 * @param e - form event property
 * @returns {boolean}
 */
export const formPreValidate = (e) => {
    e.preventDefault();
    const form_name = e.target.id;
    return validateForm(form_name);
};

/**
 * stand alone form validation without the forms event property
 * @param form_name
 * @param do_message
 * @returns {boolean}
 */
export const validateForm = (form_name, {do_message = true} = {}) => {
    try {
        const is_valid = typeof window != 'undefined' && window.$(`#${form_name}`).parsley().validate();
        if (is_valid) {
            return true;
        }

        //if (do_message) general_form_error_toastr();
        return false;
    } catch (e) {
        return true;
    }
};

/**
 * just checks to see if the form is valid without running the validation
 * @param form_name
 * @returns {*|boolean|null}
 */
export const isFormValid = (form_name) => {
    try {
        return typeof window != 'undefined' && window.$(`#${form_name}`).parsley().isValid()
    } catch (e) {
        return null;
    }
};

export const safeKeyCode = (event) => {
    if (event.keyIdentifier !== undefined) {
        return event.keyIdentifier;
    } else if (event.keyCode !== undefined) {
        return event.keyCode;
    }

    return false;
};

export const clear_cookies = () => {
    const credentialsStorage = new CredentialsStorage(undefined, {
        domain: APP_CONFIG.COOKIE_DOMAIN,
        path: '/',
        expires: 365,
        secure: true, //!APP_CONFIG.DEV, // true or false
    });

    credentialsStorage.clear();
    storage.clear();
};
