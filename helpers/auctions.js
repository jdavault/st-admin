import React from 'react';
import {setQueryString} from "./page";

export const generalRedoSearch = ({callback, date_filters, search_obj, sort_direction, currentPage, sortColumn, page_count}) => {

    const presets = date_filters.map(df => df.date);

    const {
        term,
        search_date_preset = 'any',
        search_date_start,
        search_date_end,
    } = search_obj;

    const options = {
        page_count, // results per page
        page_num: currentPage, // which page in pagination
        sort_direction,
    };

    if (search_obj.page_num && search_obj.page_num == 1) {
        delete search_obj['page_num'];
    }
    // if (search_obj.term && search_obj.term.length == 0) {
    //     delete search_obj['term'];
    // }

    setQueryString({search_obj});

    if (search_date_preset) options.search_date_preset = search_date_preset;
    if (search_date_start) options.search_date_start = search_date_start;
    if (search_date_end) options.search_date_end = search_date_end;

    if (presets.includes(search_date_preset)) {
        options.sort_column = sortColumn.column_map;
        return callback(term, options)
    }

    return callback(term, options);
};

export const formatLienStatus = (ars_enabled, status, is_in_past = true) => {

    if (!ars_enabled) {
        return "N/A";
    }

    if (status === null) {
        return is_in_past ? "Not Reviewed" : "Awaiting Review";
    }

    if (status === false) {
        return "Rejected";
    }

    return "Approved";
};

export const formatLienColumn = (ars_enabled, file) =>
    ars_enabled ?
        file && file.length > 0 ? (<a href={file} target="_blank" className="lien-file-yes">Y</a>) : (<span>N</span>) :
        "N/A";

export const generalRedoSearchWithoutPresets = ({callback, search_obj, sort_direction = undefined, currentPage = undefined, sort_column = undefined, page_count = undefined, append_options = {}}) => {
    const {
        term,
    } = search_obj;

    const options = {
        page_count, // results per page
        page_num: currentPage, // which page in pagination
        sort_direction,
        sort_column,
        ...append_options,
    };

    if (search_obj.page_num && search_obj.page_num == 1) {
        delete search_obj['page_num'];
    }

    setQueryString({search_obj});

    return callback(term, options);
};
