import BaseService from './BaseService';
import {environment} from './environment';
import {DELETE, GET, POST, PUT} from './RequestMethods';
import moment from 'moment';

class AuctionService extends BaseService {
    async getAuction(auction_id, refresh, user_ip = undefined) {

        this.cancel_id = 'auctions.getAuction';

        const params = {
            refresh,
            user_ip,
        };

        const url = await this.publicAuthedUrl(`auctions/${auction_id}`);
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, params, null, false);
    }

    async getAuctionsEndingSoon(limit = 9) {
        const url = await this.publicAuthedUrl('auctions');

        this.cancel_id = 'auctions.getAuctionsEndingSoon';

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, {limit});
    }

    async getTopAuctions(limit = 9) {

        this.cancel_id = 'auctions.getTopAuction';

        const url = await this.publicAuthedUrl('auctions/top-auctions');
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, {limit});
    }

    async getOnlineAuctions(search_obj) {
        this.cancel_id = 'auctions.getOnlineAuctions';

        const {
            filter_types = [],
            filter_categories = [],
            filter_unit_contents = '',
            type: search_type = 'zipcode',
            radius: search_radius = '100',
            term: search_term = '',
            term_state: search_state = '',
            page_num = 1
        } = search_obj;

        const params = {
            page_num,
            page_count: 30,
            search_type,
            search_term: search_type == 'state' ? search_state : search_term,
            filter_types: filter_types.length > 0? filter_types.join(','): "1,2,3",
            filter_categories: filter_categories.length > 0? filter_categories.join(','): "",
            filter_unit_contents,

            search_state: search_type == 'state' ? search_state : undefined,
            search_radius: search_type == 'zipcode' ? search_radius : undefined,
        };

        const url = await this.publicAuthedUrl('auctions');
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, params);
    }

    async getComingSoonAuctions(search_obj) {
        this.cancel_id = 'auctions.getComingSoonAuctions';

        const {
            filter_types = [],
            filter_categories = [],
            filter_unit_contents = '',
            type: search_type = 'zipcode',
            radius: search_radius = '100',
            term: search_term = '',
            term_state: search_state = '',
            upcoming_page_num: page_num = 1
        } = search_obj;

        const params = {
            page_num,
            page_count: 30,
            search_type,
            search_term: search_type == 'state' ? search_state : search_term,
            filter_types: filter_types.length > 0 ? filter_types.join(',') : "1,2,3",
            filter_categories: filter_categories.length > 0 ? filter_categories.join(',') : "",
            filter_unit_contents,
            search_state: search_type == 'state' ? search_state : undefined,
            search_radius: search_type == 'zipcode' ? search_radius : undefined,
        };

        const url = await this.publicAuthedUrl('auctions/upcoming');
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, params);
    }

    getAuctionCategories = () => this.submitRequestWithPromise(GET, environment.apiEndPoint, 'lists/auction-categories');

    /**
     * get active auction details or a draft auction by id
     *
     * @param auction_id
     * @param draft_id
     * @param import_id
     * @param relist_id
     * @param auction_status
     * @param scope
     * @param facility_id
     * @param import_unit_id
     * @returns {*}
     */
    fmGetAuction({ auction_id = false, draft_id = false, import_id = false, relist_id = false, auction_status = 'active', scope = false, facility_id = undefined, import_unit_id = undefined }) {

        let params = {};

        if (facility_id) {
            params.facility_id = facility_id;
        }

        if (import_unit_id) {
            params.import_unit_id = import_unit_id;
        }

        if (scope) {
            params.scope = scope;
        }

        if (auction_id) {
            return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/auctions/${auction_status}/${auction_id}`, params);
        } else if (relist_id) {
            return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/auctions/unsold/${relist_id}`, params);
        } else if (draft_id) {
            return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/auctions/drafts/${draft_id}`, params);
        } else if (import_id) {
            return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/auctions/imports/${import_id}`, params);
        }

        return new Promise((resolve, reject) => {
            reject('missing auction or draft id');
        });
    }

    /**
     * update or create a draft auction or update an active auction.
     * @param draft_id
     * @param auction_id
     * @param import_id
     * @param relist_id
     * @param form_details
     * @returns {*}
     */
    saveAuctionDetails({draft_id = false, auction_id = false, import_id = false, relist_id = false, ...form_details}) {
        form_details.active_date = moment(form_details.active_date).format('MM/DD/YYYY');
        form_details.expire_date = moment(form_details.expire_date).format('MM/DD/YYYY');

        // update draft or active auction
        if (draft_id) {
            return this.submitRequestWithPromise(PUT, environment.apiEndPoint, `users/account/auctions/drafts/${draft_id}`, {auction_draft: form_details});
        } else if (auction_id) {
            form_details.auction_id = auction_id;
            return this.submitRequestWithPromise(PUT, environment.apiEndPoint, `users/account/auctions/active/${auction_id}`, {auction: form_details});
        } else if (relist_id) {
            form_details.relist_id = relist_id;
            return this.submitRequestWithPromise(POST, environment.apiEndPoint, `users/account/auctions/drafts`, {auction_draft: form_details});
        } else if (import_id) {
            form_details.import_id = import_id;
            return this.submitRequestWithPromise(POST, environment.apiEndPoint, `users/account/auctions/drafts`, {auction_draft: form_details});
        }

        // create a draft auction
        return this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users/account/auctions/drafts', {auction_draft: form_details});
    }

    postImage = ({auction_id, name, file}) => {
        const params = new FormData();
        params.append(name, file, file.name);

        return this.submitRequestWithPromise(POST, environment.apiEndPoint, `/users/account/auctions/${auction_id}`, params);
    };

    /**
     * Api will generate a pre-signed url and storage bucket space to upload images to
     *
     * @param {int} facility_id
     * @param {string} facility_image_type ads|logos
     * @param {string} file_type
     * @param {int} auction_id
     * @param {int} draft_id
     * @param {File} file
     * @returns {Promise<*>}
     */
    requestPreSignedUrl = ({facility_id = undefined, facility_image_type = undefined, file_type, auction_id, draft_id, file}) => {
        // Request a pre signed url for facility images like ads and logs
        if(facility_id) {
            const facility_endpoint_params = {
                file_name: file.name,
                file_type: file.type,
                image_type: facility_image_type, // ads|logos
            }

            const facility_endpoint = `users/account/facilities/${facility_id}/${file_type}/create`;

            return this.submitRequestWithPromise(GET, environment.apiEndPoint, facility_endpoint, facility_endpoint_params)
        }

        const auction_segment = auction_id ? `active/${auction_id}` : `drafts/${draft_id}`;
        const endpoint = `users/account/auctions/${auction_segment}/${file_type}/create`;

        const params = {
            file_name: file.name,
            file_type: file.type,
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, endpoint, params)
    }

    getAuctionImage = ({auction_id, draft_id}) => {
        if (draft_id) {
            return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/auctions/drafts/${draft_id}/images`);
        } else if (auction_id) {
            return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/auctions/active/${auction_id}/images`);
        }
    };

    editAuctionImage = ({auction_id, draft_id, file, action, auction_status, direction, image_ids}) => {
        const {image_id} = file || {};
        let the_auction_id = false;

        if (draft_id) {
            the_auction_id = draft_id;
        } else if (auction_id) {
            the_auction_id = auction_id;
        }

        if (draft_id || auction_id) {
            switch (action) {
                case "delete":
                    // console.log(`/users/account/auctions/${auction_status}/${the_auction_id}/images/${image_id}`);
                    // break;
                    return this.submitRequestWithPromise(DELETE, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${the_auction_id}/images/${image_id}`);
                case "sort":
                    // console.log(`/users/account/auctions/${auction_status}/${the_auction_id}/images/sort`, {image_ids});
                    // break;

                    return this.submitRequestWithPromise(PUT, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${the_auction_id}/images/1`, {action: 'sort', sort_order: image_ids});
                // return this.submitRequestWithPromise(POST, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${the_auction_id}/images/sort`, {image_ids});
                case "main":
                    // console.log(`/users/account/auctions/${auction_status}/${the_auction_id}/images/${image_id}`, {action});
                    // break;
                    return this.submitRequestWithPromise(PUT, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${the_auction_id}/images/${image_id}`, {action});
                case "rotate":
                    // console.log(`/users/account/auctions/${auction_status}/${the_auction_id}/images/${image_id}`, {action, direction});
                    // break;
                    return this.submitRequestWithPromise(PUT, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${the_auction_id}/images/${image_id}`, {action, direction});
            }
        }

        return new Promise((resolve, reject) => {
            reject('missing auction or draft id');
        });
    };

    cancelAuction = ({auction_id, auction_status, cancelation_reason_id, cancelation_reason_other}) => (
        this.submitRequestWithPromise(PUT, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${auction_id}/cancel`, {auction: {cancelation_reason_id, cancelation_reason_other}})
    );

    saveAuctionAsDraft = (draft_id) => (
        this.submitRequestWithPromise(PUT, environment.apiEndPoint, `/users/account/auctions/drafts/${draft_id}/activate`)
    );

    postAuction = (auction_id) => (
        this.submitRequestWithPromise(POST, environment.apiEndPoint, `/users/account/auctions/drafts/${auction_id}/post-auction`)
    );

    postAuctionImage = ({auction_id, draft_id, file}) => {
        if (!auction_id && !draft_id) {
            return this.missingData("missing an auction or draft id");
        }

        const {params, headers} = this.buildFileParams(file);

        const post_url = auction_id ?
            `users/account/auctions/active/${auction_id}/images` :
            `users/account/auctions/drafts/${draft_id}/images`;

        return this.submitRequestWithPromise(POST, environment.apiEndPoint, post_url, params, null, false, headers);
    };
}

export default new AuctionService();
