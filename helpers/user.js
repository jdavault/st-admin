import {Auth} from 'aws-amplify';
import storage from './storage';

export const is_authed_async = async () => {
    try {
        await Auth.currentAuthenticatedUser();
        return true;
    } catch (error) {
        return false;
    }
};

export const is_authed_cache = () => {
    return (storage.getItem('st.authed') || '0') == '1';
};

export const is_guest_async = async () => {
    const is_authed = await is_authed_async();
    return !is_authed;
};

// export const is_guest_cache = () => {
//     return (storage.getItem('st.authed') || '0') == '0';
// }

export const get_reg_type = (default_value = '0', return_mapped = false) => {
    if (!return_mapped) return storage.getItem('st.reg_type') || default_value;

    const reg_types = {
        "0": default_value,
        "1": "FM",
        "2": "AB",
        "3": "AU",
    };

    const reg_type = storage.getItem('st.reg_type') || "0";
    return reg_types[!reg_type || reg_type == "false" || reg_type == "" ? "0" : reg_type];
};

export const CANCEL_REASON_NON_PAYMENT = "1";
export const CANCEL_REASON_UNKNOWN = "2";

export const is_user_suspended = ({return_reason = false} = {}) => {
    const suspended = storage.getItem('st.suspended') || "0";

    const is_suspended = suspended == "1";

    if (!is_suspended) {
        return false;
    }

    if (is_suspended === true && return_reason === true) {
        const suspended_reason = storage.getItem('st.suspended_reason_id') || "0";

        switch (suspended_reason) {
            case CANCEL_REASON_NON_PAYMENT:
                return CANCEL_REASON_NON_PAYMENT;
            case 'unknown':
            default:
                return CANCEL_REASON_UNKNOWN;
        }
    }

    return is_suspended;
};
