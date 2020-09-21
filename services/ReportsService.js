import BaseService from "./BaseService";
import {environment} from "./environment";
import {DELETE, GET} from "./RequestMethods";

class ReportsService extends BaseService {
    getReports = (search_obj = {}) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/downloads`, search_obj)
    );

    deleteReport = (report_id) => (
        this.submitRequestWithPromise(DELETE, environment.apiEndPoint, `users/account/downloads/${report_id}`)
    )

    requestReports = (report_type, {status, term, ...search_obj}) => {
        search_obj.search_term = term || '';

        if (report_type == 'auctions') {
            return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/export/${report_type}/${status}`, search_obj);
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/export/${report_type}`, search_obj);
    };
}

export default new ReportsService();
