import BaseService from "./BaseService";
import {environment} from "./environment";
import {GET} from "./RequestMethods";
import {APP_CONFIG} from "../Config";

class PaymentGatewayService extends BaseService {
    getToken = () => {
        const {REACT_APP_PUBLIC_URL = 'https://storagetreasures.com'} = APP_CONFIG;

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/billing/profile-page`, {
            iframe_url: `${REACT_APP_PUBLIC_URL}/static/IFrameCommunicator.html`,
        })
    }
}

export default new PaymentGatewayService();
