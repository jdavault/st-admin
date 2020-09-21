import React, {Component} from 'react';

import {get} from 'lodash';

const Question = "../static/images/question.svg";

class MissingBlock extends Component {

    classShow = () => {

        let show = ' hidden';
        if (get(this.props, 'show', true) === true) {
            show = ' in';
        }

        if (show == ' in') {
            // After fadeout is done then set to hidden(display none" so it does not push down elements under it
            setTimeout(() => {
                show = ' hidden';
            }, 66.67);  // the bootstrap fade animation take 66.67 microseconds
        }

        return show;
    };

    render() {
        let image = get(this.props, 'image', Question);
        let imageClass = get(this.props, 'imageClass', 'standard');

        return (
            <div className={"missing-block row fade" + this.classShow()}>
                <div className="text-center marginT30 marginB30">
                    <img src={image} alt="Empty" className={` ${imageClass} marginB30 missing-image`} style={{minHeight: 91}}/>

                    <div className="st-h3">{get(this.props, 'message', 'Nothing here. Check back soon!')}</div>
                </div>
            </div>
        )
    }
}

export default MissingBlock;
