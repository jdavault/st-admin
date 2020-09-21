import BaseService from "./BaseService";
import {environment} from "./environment";
import {GET, POST, PUT} from "./RequestMethods";

class LiveAuctionService extends BaseService {
    async getLiveAuctions(search_obj) {
        const {
            type: search_type = 'zipcode',
            radius: search_radius = '100',
            term: search_term = '',
            term_state: search_state = '',
            page_num = 1
        } = search_obj;

        let params = {
            page_num, // page in pagination
            page_count: 30, // results per page

            search_type,
            search_term: search_type == 'state' ? search_state : search_term,

            search_radius: search_type == 'zipcode' ? search_radius : undefined,
        };

        const url = await this.publicAuthedUrl('live-auctions');
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, params);
    }

    saveAuction = ({form_data, live_auction_id = false}) => {
        const method = live_auction_id ? PUT : POST;
        const base_url = '/users/account/live-auctions';
        const url = live_auction_id ? `${base_url}/${live_auction_id}` : base_url;

        return this.submitRequestWithPromise(method, environment.apiEndPoint, url, {live_auction: form_data});
    };

    fmGetLiveAuction = ({live_auction_id}) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/live-auctions/${live_auction_id}?scope=auction-details-form`)
    );

    cancelLiveAuction = (live_auction_id) => {
        return this.submitRequestWithPromise(PUT, environment.apiEndPoint, `users/account/live-auctions/${live_auction_id}/cancel`);
    }
}

export default new LiveAuctionService();
