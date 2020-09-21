import * as Cookies from 'js-cookie'
import nookie from 'nookies';

// This implementation is based on the amazon-cognito-auth-js/es/CookieStorage.js
export class CredentialsStorage {

    constructor(ctx = undefined , params) {
        // this.req = ctx.req;
        if(ctx) {
            this.req = ctx.req || {};
            this.req.cookies = nookie.get(ctx);
        }
        this.path = params.path;
        this.expires = params.expires;
        this.domain = params.domain;
        this.secure = params.secure;
    }

    setItem(key, value) {
        Cookies.set(key, value, {
            path: this.path,
            expires: this.expires,
            domain: this.domain,
            secure: this.secure,
        });

        return Cookies.get(key, {
            path: this.path,
            expires: this.expires,
            domain: this.domain,
            secure: this.secure,
        })
    }

    getItemClient(key) {
        return Cookies.get(key, {
            path: this.path,
            expires: this.expires,
            domain: this.domain,
            secure: this.secure,
        })
    }

    getItemServer(passedKey) {
        const req = this.req;
        const key = encodeURIComponent(passedKey); // there are @ symbols in the passedKey sometimes
        const cookieItem = req.cookies && req.cookies[key];

        return cookieItem
    }

    getItem(key) {
        return typeof window != 'undefined' ? this.getItemClient(key) : this.getItemServer(key);
    }

    removeItem(key) {
        return Cookies.remove(key, {
            path: this.path,
            domain: this.domain,
            secure: this.secure,
        })
    }

    clear() {
        const settings = {
            path: this.path,
            expires: this.expires,
            domain: this.domain,
            secure: this.secure,
        };

        const cookies = Cookies.get(undefined, settings);
        const keys = Object.keys(cookies);

        keys.forEach(k => Cookies.remove(k, settings));
    }
}
