// href="/facilities/homepage/' . $result->facility_id . '"
import React from "react";

export const map_position = ({lat, lng}) => lat && lng ? `${lat},${lng}` : false;

export const map_marker = ({facility_name, address, city, zipcode, state_code = '', state = false, link = '#', link_text = 'View Auctions', link_icon = 'gavel'}) => (
    <div style={{padding: '15px 5px 15px 10px', width: 155}}>
        <strong>{facility_name}</strong><br/>
        <small>
            {address}<br/>
            {city}, {state || state_code} {zipcode}
        </small>
        <br/>
        <br/>
        <div className="text-center">
            {/*<i className={`fa fa-${link_icon}`}/> &nbsp;*/}
            <a className="" href={link}>{link_text}</a>
        </div>
    </div>
);
