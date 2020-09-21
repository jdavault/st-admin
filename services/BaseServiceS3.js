import axios from 'axios'

export default class BaseServiceS3 {
    /**
     *
     * @param {string} method
     * @param {string} url
     * @param {File} file
     * @param configs
     * @returns {Promise<AxiosResponse<any>>}
     */
    async submitRequestWithPromise(method, url, file = undefined, configs = {}) {
        const config = {
            url,
            method,
            headers: {
                'Content-Type': file.type,
            },
            ...configs
        };

        return axios.put(url, file, config).then(({data}) => data);
    }
}
