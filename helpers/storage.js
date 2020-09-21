import * as Cookies from 'js-cookie';

/** @class */
class CookieStorage {
    cache = {};

    /**
     * Constructs a new CookieStorage object
     * @param {object} data Creation options.
     * @param {string} data.path Cookies path (default: '/')
     * @param {integer} data.expires Cookie expiration (in days, default: 365)
     * @param {boolean} data.secure Cookie secure flag (default: true)
     */
    constructor(data = {}) {
        // if (data.path) {
        //     this.path = data.path;
        // } else {
        //     this.path = '/';
        // }
        // if (Object.prototype.hasOwnProperty.call(data, 'expires')) {
        //     this.expires = data.expires;
        // } else {
        //     this.expires = 365;
        // }
        // if (Object.prototype.hasOwnProperty.call(data, 'secure')) {
        //     this.secure = data.secure;
        // } else {
        //     this.secure = true;
        // }
    }

    /**
     * This is used to set a specific item in storage
     * @param {string} key - the key for the item
     * @param {object} value - the value
     * @returns {string} value that was set
     */
    setItem(key, value) {
        Cookies.set(key, value);
        return Cookies.get(key);
    }

    /**
     * This is used to get a specific key from storage
     * @param {string} key - the key for the item
     * This is used to clear the storage
     * @returns {string} the data item
     */
    getItem(key) {
        if (typeof document == 'undefined'){
            return this.cache[key];
        }

        return Cookies.get(key);
    }

    /**
     * This is used to remove an item from storage
     * @param {string} key - the key being set
     * @returns {string} value - value that was deleted
     */
    removeItem(key) {
        return Cookies.remove(key);
    }

    /**
     * This is used to clear the storage
     * @returns {string} nothing
     */
    clear() {
        const cookies = Cookies.get();
        const keys = Object.keys(cookies);

        keys.forEach(k => Cookies.remove(k));
    }
}

export default new CookieStorage({secure: false});
