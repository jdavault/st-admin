import BaseService from "./BaseService";
import {environment} from "./environment";
import {POST} from "./RequestMethods";

class FormService extends BaseService {
    requestToken = (params) => this.submitRequestWithPromise(POST, environment.apiEndPoint, 'csrf/token', params);
}

export default new FormService()
