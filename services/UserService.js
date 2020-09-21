import BaseService from "./BaseService";
import {environment} from "./environment";
import {DELETE, GET, POST, PUT} from "./RequestMethods";
import {_GET} from "helpers/request";
import {is_authed_async} from "helpers/user";

class UserService extends BaseService {
    createUser(user, csrf_token) {
        return this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users', {user, csrf_token});
    }

    checkEmailExists(email) {
        const params = { email };

        if (!email.length) {
            // if no email has been passed in. we don't need to call the api.
            return new Promise((resolve, reject) => {
                resolve({
                    message: null
                })
            });
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/check-email', params);
    }

    getHeardQuestions() {
        const params = {};

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'lists/heard-about-us', params);
    }

    getSecurityQuestions() {
        const params = {};

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'lists/security-questions', params);
    }

    getUserNotificationById(notificationId) {
        const params = {};

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/auction-notifications/${notificationId}`, params);
    }

    getUserNotifications({ ...params }) {

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auction-notifications', params);
    }

    createUserNotification(notification) {
        const params = { notification };

        return this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users/account/auction-notifications', params);
    }

    updateUserNotification(notification) {
        const params = { notification };

        return this.submitRequestWithPromise(PUT, environment.apiEndPoint, `users/account/auction-notifications/${notification.notification_id}`, params);
    }

    deleteUserNotification(notificationId) {
        const params = {};

        return this.submitRequestWithPromise(DELETE, environment.apiEndPoint, `users/account/auction-notifications/${notificationId}`, params)
    }


    saveSettings(user) {
        const params = { user };

        return this.submitRequestWithPromise(PUT, environment.apiEndPoint, 'users/account', params);
    }

    getSettings = (params = undefined) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account', params)
    );

    /**
     * special validation check password
     * @param password
     * @param confirm_password
     * @param params
     * @returns {Promise<*>}
     */
    passwordCheck = async (password, confirm_password, params) => {
        params.check = password;

        const authed = await is_authed_async();

        if (authed) {
            return this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users/account/check-password', params);
        }

        params['l'] = _GET('l');
        return this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users/check-password', params);
    }

    getWonAuctions({ ...params }) {

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/won', params);
    }

    getUserAuctionWatch(dashboard, page_num, page_count, sort_column, sort_direction) {
        const params = {
            page_num,
            page_count,
            sort_column,
            sort_direction
        };

        if (dashboard) {
            params['limit'] = 10;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/watchlist', params);
    }

    deleteAuctionWatch(auction_id) {
        const params = {auction_id};

        return this.submitRequestWithPromise(DELETE, environment.apiEndPoint, `users/account/watchlist`, params);
    }


    getUserBookmarkedFacilities(dashboard, page, page_count, sort_column, sort_direction) {
        const params = {page, page_count, sort_column, sort_direction};

        if (dashboard) {
            params['limit'] = 10;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/bookmarks', params);
    }

    deleteUserBookmarkedFacility = (bookmark_id) => (
        this.submitRequestWithPromise(DELETE, environment.apiEndPoint, 'users/account/bookmarks/' + bookmark_id)
    );

    getUserAuctionsWithBids({term = '', ...params}) {
        if (term) {
            params.push({term});
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auction-bids', params);
    }

    processForgotPassword = (params) => (
        this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users/reset-password', params)
    );

    processForgotPasswordChange(password, password_confirm, params) {
        params.password = password;
        params.password_confirm = password_confirm;

        return this.submitRequestWithPromise(PUT, environment.apiEndPoint, 'users/account/password', params);
    }

    resetPasswordCheckLink = (params) => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/reset-password/check-link', params)
    )

    toggleDetailAuctionWatch({add_watch, ...params}) {
        if (add_watch) {
            return this.submitRequestWithPromise(POST, environment.apiEndPoint, `users/account/watchlist`, params);
        }

        return this.deleteAuctionWatch(params.auction_id);
    }

    getMmembershipChange() {
        const params = {};

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/membership', params);
    }

    changeMembership({...params}) {
        return this.submitRequestWithPromise(PUT, environment.apiEndPoint, 'users/account/membership', params);
    }

    validatePromoCode({promo_code, ...params}) {
        return this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/membership/check-promo-code?promo_code=${promo_code}`, params);
    }

    submitBid({...params}) {
        return this.submitRequestWithPromise(POST, environment.apiEndPoint, `users/account/auction-bids`, params)
    }

    getFMActiveAuctions(search_term, params = {}) {

        if (search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/active', params)
    }

    getFMSoldAuctions(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/sold', params)
    }

    getFMUnsoldAuctions(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/unsold', params)
    }


    getFMCanceledAuctions(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/canceled', params)
    }

    fmDashboardMetrics = () => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/metrics/auctions')
    );

    getFMCanceledAfterSoldAuctions(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/canceled-sold', params)
    }

    getFMDraftAuctions(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/drafts', params)
    }
    getFMImportedAuctions(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/auctions/imports', params)
    }

    deleteDraftAuction(draft_id){
        var params = {};

        return this.submitRequestWithPromise(DELETE, environment.apiEndPoint, 'users/account/auctions/drafts/' + draft_id, params);
    }

    getAccountDefaults = () => (
        this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/facilities/account')
    )

    getFMFacilities(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/facilities', params)
    }

    getFMFacility = ({facility_id}) => this.submitRequestWithPromise(GET, environment.apiEndPoint, `users/account/facilities/${facility_id}?scope=facility-details-form`);

    getFMLiveAuctions(search_term, params = {}) {

        if(search_term){
            params.search_term = search_term;
        }

        return this.submitRequestWithPromise(GET, environment.apiEndPoint, 'users/account/live-auctions', params)
    }

    paymentProfile = ({action} = {}) => (
        this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users/account/billing/payment-profile', {action})
    );

    actionsActiveUser = (params) => (
        this.submitRequestWithPromise(POST, environment.apiEndPoint, 'users/activate', params)
    )
}

export default new UserService();
