import React, {Component} from 'react';

import {get} from 'lodash';

import {connect} from 'react-redux'

//import "styles/components/pagination.less";

class Pagination extends Component {

    doNext = () => {
        typeof window != 'undefined' && window.scrollTo(0, 0);
        const {
            currentPage,
        } = this.props;

        this.props.onSetPage && this.props.onSetPage(currentPage + 1, get(this.props, 'passThrough'));
        this.props.redoSearch && this.props.redoSearch(currentPage + 1, get(this.props, 'passThrough'));
    };

    doPrevious = () => {
        const {currentPage} = this.props;

        typeof window != 'undefined' && window.scrollTo(0, 0);

        this.props.onSetPage && this.props.onSetPage(currentPage - 1, get(this.props, 'passThrough'));
        this.props.redoSearch && this.props.redoSearch(currentPage - 1, get(this.props, 'passThrough'));
    };

    doOnClick = (page) => {
        typeof window != 'undefined' && window.scrollTo(0, 0);
        this.props.onSetPage && this.props.onSetPage(page, get(this.props, 'passThrough'));
        this.props.redoSearch && this.props.redoSearch(page, get(this.props, 'passThrough'));
    };

    getPerPage = () => {
        const {windowWidth} = this.props;

        if (windowWidth <= 320) {
            return 4;
        } else if (windowWidth > 320 && windowWidth < 768) {
            return 5;
        } else if (windowWidth >= 768 && windowWidth < 1200) {
            return 9;
        }

        return 10;
    };

    render() {
        const {
            perPage,
            currentPage,
            dataCount,

            maxPaginationWidth = this.getPerPage(),
        } = this.props;

        if (perPage >= dataCount) {
            return null;
        }

        let range = [];

        for (let i = 1; i - 1 < Math.ceil(dataCount / perPage); ++i) {
            range.push(i);
        }

        //show set number of pagination links with the current page as in the middle as we can get
        if (currentPage < maxPaginationWidth) {
            range = range.slice(0, maxPaginationWidth);
        } else if (currentPage > (range[range.length - 1] - maxPaginationWidth)) {
            range = range.slice(-(maxPaginationWidth));
        } else {
            range = range.slice(currentPage - (maxPaginationWidth / 2), currentPage).concat(range.slice(currentPage, currentPage + (maxPaginationWidth / 2)));
        }

        const pageLt = currentPage == 1;
        const pageGt = currentPage == range[range.length - 1];

        return (
            <nav className="st-pagination-wrapper text-center">
                <ul className="st-pagination">
                    <li className={"page-item" + (pageLt ? ' disabled' : '')}
                        onClick={() => {
                            !pageLt && this.doPrevious()
                        }}
                        key="lt">
                        <span className={"page-link" + (pageLt ? ' disabled' : '')}><i className="fa fa-chevron-left"/></span>
                    </li>
                    {
                        range.map(v => {
                            const isCurrent = v === currentPage;

                            if (v == -1) {
                                return (
                                    <li className="page-item dots disabled"
                                        key={v.toString()}>

                                        <span className="page-link disabled">..</span>
                                    </li>
                                );
                            }

                            return (
                                <li className={isCurrent ? 'page-item active' : 'page-item'}
                                    onClick={() => !isCurrent && this.doOnClick(v)}
                                    key={(v).toString()}>

                                    <span className="page-link">{v}</span>
                                </li>
                            );
                        })
                    }
                    <li className={"page-item" + (pageGt ? ' disabled' : '')}
                        onClick={() => {
                            !pageGt && this.doNext()
                        }}
                        key="gt">
                        <span className={"page-link" + (pageGt ? ' disabled' : '')}><i className="fa fa-chevron-right"/></span>
                    </li>
                </ul>
            </nav>
        );
    };
}

Pagination.defaultProps = {
    currentPage: 1,
    dataCount: 0,
    perPage: 10,
};

const mapStateToProps = ({page}, props) => {

    const {
        currentPage,
        dataCount,
    } = props;

    return {
        windowWidth: page.windowWidth,
        currentPage: typeof currentPage == 'string' ? parseInt(currentPage) : currentPage,
        dataCount: typeof dataCount == 'string' ? parseInt(dataCount) : dataCount,
    }
};

export default connect(mapStateToProps)(Pagination);
