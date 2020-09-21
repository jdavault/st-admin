import BaseService from "./BaseService";
import {environment} from "./environment";
import {GET} from "./RequestMethods";

class AddressService extends BaseService {
    getCountries() {
        const params = {
        };

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'lists/countries', params);
    }
}

export default new AddressService();
