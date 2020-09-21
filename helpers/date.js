import {get} from 'lodash';
import moment from "moment";

export const user_formatted_date = (to_format, default_value = null) => (
    get(to_format, 'user.date_formatted', default_value)
);

export const user_formatted_time = (to_format, default_value = null) => (
    get(to_format, 'user.time_formatted', default_value)
);

export const user_formatted_date_time = (to_format, default_value = null) => {
    const time = user_formatted_time(to_format, default_value);
    const date = user_formatted_date(to_format, default_value);

    if (`${time} ${date}` == `${default_value} ${default_value}`) {
        return default_value;
    }

    return `${date} ${time}`;
};

export const user_unformatted_date = (to_date, default_format = 'MM/DD/YYYY', default_value = null) => {
    const date = get(to_date, 'user.datetime');

    if (!date) return default_value;

    return moment(date.replace(/:00$/, ''), 'YYYY-MM-DD').format(default_format);
};

export const user_unformatted_time = (to_date, default_format = 'h:mm A', default_value = null) => {
    const date = get(to_date, 'user.datetime');

    if (!date) return default_value;

    return moment(date.replace(/:00$/, ''), 'YYYY-MM-DD HH:mm').format(default_format);
};

/**
 *
 * @param {string|null|undefined|moment} date
 * @param {string} dt_format
 * @param {string} d_format
 * @param {string} t_format
 * @param {string} d_mil_format
 * @returns {{utc: {datetime: *}, user: {datetime: *, date_formatted: *, time_formatted: *}}}
 */
export const generate_date_object = (date = undefined, dt_format = 'YYYY-MM-DD h:mm', d_format = 'MMM D, YYYY', t_format = 'h:mm A', d_mil_format = 'YYYY-MM-DD HH:mm') => {

    let use_date = date || undefined;

    if (typeof use_date == 'function') {
        use_date = use_date.format();
    }

    return {
        utc: {
            datetime: moment(use_date).format(d_mil_format),
        },
        user: {
            datetime: moment(use_date).format(d_mil_format),
            date_formatted: moment(use_date).format(d_format),
            time_formatted: moment(use_date).format(t_format),
        }
    }
};

/**
 * formats database timestamp to Jun 19, 2019 - 6:00 AM by default
 * @see https://devhints.io/moment
 * @param {array} to_format
 * @param {string} default_value
 * @param {string} default_formatting
 * @returns {string|null}
 */
export const utc_datetime_formatted = (to_format, default_value = null, default_formatting = 'MMM DD, YYYY - h:mm A') => {
    const datetime = utc_datetime_raw(to_format, default_value);
    const moment_obj = moment(datetime, 'YYYY-MM-DD HH:mm');

    if (!datetime || !moment_obj.isValid()) return null;

    return moment_obj.format(default_formatting);
};

export const utc_datetime_raw = (to_format, default_value = null) => get(to_format, 'utc.datetime', default_value);

export const is_time_after = (from_date, from_time = '', to_date_time = moment()) => {
    let to_military_time = to_date_time;

    if (typeof to_date_time == 'string') {
        let to_input_time_format = 'YYYY-MM-DD h:mm A';

        if (from_date.indexOf('/') > 0) {
            to_input_time_format = 'MM/DD/YYYY h:mm A';

            to_military_time = moment(`${from_date} ${from_time}`, to_input_time_format).format('YYYY-MM-DD HH:mm');
        }
    }

    let input_time_format = 'YYYY-MM-DD h:mm A';

    if (from_date.indexOf('/') > 0) {
        input_time_format = 'MM/DD/YYYY h:mm A';
    }

    const military_time = moment(`${from_date} ${from_time}`, input_time_format).format('YYYY-MM-DD HH:mm');

    return moment(military_time).isAfter(to_military_time);
};
