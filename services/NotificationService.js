import BaseService from "./BaseService";
import {environment} from "./environment";
import {GET} from "./RequestMethods";

class NotificationService extends BaseService {
    getMustKnowNotifications(location_id) {
        if (isNaN(location_id)) {
            window.location.href = '/not-found';
        }

        const params = {
            location_id: location_id // results per page
        };

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `notifications/must-know`, params, 1, true);
    }

    getMustKnowNotification(must_know_id) {
        if (isNaN(must_know_id)) {
            window.location.href = '/not-found';
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `notifications/must_know/${must_know_id}`, {}, 1, true);
    }
}

export default new NotificationService();
