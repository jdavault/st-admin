import BaseService from "./BaseService";
import {environment} from "./environment";
import {DELETE, GET, POST, PUT} from "./RequestMethods";
import {APP_CONFIG} from "Config";
import {randomString} from "helpers/string";

class FacilityService extends BaseService {
    async getFacility(facility_id) {
        if (isNaN(facility_id)) {
            window.location.href = '/not-found';
        }

        const url = await this.publicAuthedUrl(`facilities/${facility_id}`);
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, {}, 1, true);
    }

    bookmarkFacility = ({facility_id, bookmark_id = false, direction}) => (
        direction ?
            // create the bookmark
            this.submitRequestWithPromise(POST, environment.apiEndPoint, `users/account/bookmarks`, {facility_id}) :

            bookmark_id?
                // remove the bookmark;
                this.submitRequestWithPromise(DELETE, environment.apiEndPoint, `users/account/bookmarks/${bookmark_id}`):
                new Promise((resolve, reject) => reject('no bookmark id to remove'))
    );

    createFacility(facility, csrf_token) {
        if (!facility.user_id){
            APP_CONFIG.DEV && alert("Create facility error missing user_id");
            return false;
        }
        return this.submitRequestWithPromise(POST, environment.apiEndPoint, 'facilities', {facility, csrf_token});
    };

    fmSaveFacility = ({facility_id, form_data}) => (
        this.submitRequestWithPromise(PUT, environment.apiEndPoint, `users/account/facilities/${facility_id}`, {facility: form_data})
    );

    async getFacilityOnlineAuction(facility_id, page) {
        const randStr = randomString();

        const params = {
            page_num: page,
            page_count: 10, // results per page
            randStr,
        };

        const url = await this.publicAuthedUrl(`facilities/${facility_id}/auctions`);
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, params);
    }

    async getFacilityOnlineAuctionComingSoon(facility_id, page) {
        const randStr = randomString();
        const params = {
            randStr,
            page_num: page,
            page_count: 10
        };

        const url = await this.publicAuthedUrl(`facilities/${facility_id}/auctions/upcoming`);
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, params);
    }

    async getFacilityLiveAuction(facility_id, page) {
        const randStr = randomString();
        const params = {
            randStr,
            page_num: page,
            page_count: 10
        };

        const url = await this.publicAuthedUrl(`facilities/${facility_id}/live-auctions`);
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, url, params);
    }

    getPMSSystems() {
        const params = {};

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `lists/pms`, params);
    }

    getFacilityManagerTopAuctions = (params) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/top-auctions', {...params, randStr: randomString()})
    );

    getUserFacilityList() {
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/facilities?limit=none');
    }

    getFacilityFeatures = () => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, 'lists/facility-features')
    );

    deleteImage = ({facility_id, image_type, image_id}) => (
        this.submitRequestWithPromise(DELETE, environment.apiEndPoint, `users/account/facilities/${facility_id}/images/${image_id}`, {image_id, image_type})
    );

    deleteLienFile = ({auction_id = false, draft_id = false, auction_status, file_id}) => {
        if ((!auction_id && !draft_id) || !file_id) {
            return this.missingData("missing an auction or draft id or the file");
        }

        const the_auction_id = auction_id || draft_id;

        return this.submitRequestWithPromise(DELETE, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${the_auction_id}/files/${file_id}`)
    };

    /**
     * poll the server to see if lien file has been processed
     * @param auction_id
     * @param draft_id
     * @param auction_status
     * @returns {Promise<*>}
     */
    getLienFile = ({auction_id, draft_id, auction_status}) => {
        const the_auction_id = auction_id || draft_id;

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `/users/account/auctions/${auction_status}/${the_auction_id}/files`)
    }

    getImages = ({facility_id}) => {
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `/users/account/facilities/${facility_id}/images`)
    }
}

export default new FacilityService();
