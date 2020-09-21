import {get} from 'lodash';

export const formatted_number = (obj, default_number = '$0') => (
    get(obj, 'formatted', default_number)
);

export const unformatted_amount = (obj, default_number = '0') => (
    get(obj, 'amount', default_number)
);

// convert a string number with currency symbol and commas to an int and if not a number then return the default
export const numberize_int = (number, default_number = 0) => {
    const new_number = parseInt((number + "").replace(/\D/g, ''));

    return isNaN(new_number) ?
        default_number :
        new_number;
};

export const do_format_number = (number, default_number = '0', currency = '') => (
    `${currency}${(numberize_int(number, default_number) + "").replace(/\d(?=(\d{3})+$)/g, '$&,')}`
);
