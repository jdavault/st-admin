import React, {Component} from 'react';

import {chunk, forEach, get, has} from 'lodash';

import MissingBlock from "./MissingBlock";
import Pagination from "./Pagination";

import "../../Table/table.less";

/**
 * Documentation here - https://opentechlabs.atlassian.net/wiki/spaces/ST/pages/515670033/Tables
 */
class Table extends Component {

    triggerSearchChange = (changed, newPage) => {
        let search = {
            sortColumn: get(changed, 'sortColumn', this.props.sortColumn),
            sortAsc: get(changed, 'sortAsc', this.props.sortAsc),
            currentPage: newPage || this.props.current_page
        };
        this.props.handleRedoSearch(search);
    };

    getBodyText = (column) => {
        if (typeof column == 'string') {
            return column;
        }

        return get(column, 'body', '');
    };

    /**
     *
     */
    renderTablePagination = () => {
        if (!this.props.hasPagination) {
            return null;
        }

        return (
            <Pagination perPage={this.props.paginationPerPage} dataCount={this.props.totalRecords}
                        currentPage={this.props.currentPage} onSetPage={(newPage) => {
                this.triggerSearchChange({}, newPage);
            }}/>
        )
    };

    renderTableSorting = (column_object, column_index) => {
        const column_name = get(column_object, 'body', column_object);

        if (this.props.sortableColumns !== false) {
            if (this.props.sortableColumns.indexOf(column_index) < 0) {
                return [
                    false,
                    () => {
                    }
                ];
            }
        }

        if (column_name !== this.props.sortColumn.body && column_name !== this.props.sortColumn) {
            // New column clicked column sorting restarted to ascending
            let onclick = () => {
                this.triggerSearchChange({sortColumn: column_object, sortAsc: true})
            };

            return [
                (
                    <span className="sort-arrow sort">
                        <i className="fa fa-long-arrow-up"/>
                        <i className="fa fa-long-arrow-down"/>
                    </span>
                ),
                onclick
            ]
        }

        if (this.props.sortAsc) {
            let onclick = () => {
                this.triggerSearchChange({sortColumn: column_object, sortAsc: false})
            };
            return [
                (
                    <i className="fa fa-sort-amount-asc sort-arrow" onClick={onclick}/>
                ),
                onclick
            ]
        }

        let onclick = () => {
            this.triggerSearchChange({sortColumn: column_object, sortAsc: true})
        };

        return [
            (
                <i className="fa fa-sort-amount-desc sort-arrow" onClick={onclick}/>
            ),
            onclick
        ]
    };

    renderHeader = () => {
        if (!this.props.results || !this.props.results.length) {
            return '';
        }

        let headers = this.props.headers.map((item, i) => {

            if (item === false) {
                return (<th key={`th-empty-${i}`} className="empty-header"/>);
            }

            let sorting = (this.props.hasSort ? this.renderTableSorting(item, i) : '');
            let thClass = (this.props.hasSort && sorting[0] !== false ? 'sort-arrow' : '');

            if (has(item, 'body')) {
                thClass += " " + item.className;
                item = item.body;
            }

            return (
                <th key={`th-${i}`} className={thClass} onClick={sorting[1]}>
                    <span>{item}</span> {sorting[0]}
                </th>
            )
        });

        return (
            <thead>
            <tr>
                {headers}
            </tr>
            </thead>
        );
    };

    renderTableColumns = () => {
        return (
            <tbody>
            {this.props.results.map((row, row_key) => {
                return (
                    <tr key={row_key} className={`${row.rowLink ? 'clickable' : null}`}>
                        {row.columns.map((column, column_key) => {

                            if (typeof column === 'object' && column.tableHidden === true) {
                                return null;
                            }

                            let rowClick = () => {
                            };

                            if (row.rowLink && get(column, 'rowLink', true) !== false) {
                                rowClick = () => {
                                    if (this.props.rowClicked) {
                                        this.props.rowClicked(row.rowLink); // use the user defined clicked function
                                    } else {
                                        this.defaultLinkClicked(row.rowLink); // use the default clicked function
                                    }
                                };
                            }

                            var body = column;

                            if (typeof column == 'object') {
                                if ('body' in column) { // if key of body is in the object then it's a user definied row
                                    body = column.body;
                                }
                            }

                            return (
                                <td key={column_key} onClick={rowClick} className={get(column, 'className', 'text')}>
                                    {body}
                                </td>
                            );
                        })}
                    </tr>
                )
            })}
            </tbody>
        );
    };

    renderTable = () => {
        let tableClass = `${this.props.baseTableClass} ${this.props.className}`;
        let tableTitle = '';
        let tableOptions = '';

        if (this.props.tableTitle !== false) {
            tableTitle = (
                <div className="table-title">
                    {this.props.tableTitle}
                </div>
            );
        }

        if (this.props.cardFooter !== false) {
            tableOptions = (
                <div className="card-footer">
                    {this.props.cardFooter}
                </div>
            );
        }

        return (
            <div className="table-container is-table">
                {tableTitle}
                <table className={tableClass}>
                    {this.renderHeader()}
                    {this.renderTableColumns()}
                </table>
                {this.renderTablePagination()}
                {tableOptions}
            </div>
        );
    };

    findCardTitle = (card) => {
        let foundTitle = '',
            cardTitleIndex = -1;

        forEach(card.columns, (column, i) => {
            if (get(column, 'cardTitle', false)) {

                foundTitle = get(this.props.headers, i, '');

                if (typeof foundTitle === 'object') {
                    foundTitle = foundTitle.body;
                }

                cardTitleIndex = i;

                foundTitle += (foundTitle ? ": " : "") + column.cardTitle;
                return true; // break the foreach loop
            }
        });

        return [foundTitle, cardTitleIndex];
    };

    specialLowercase = (the_string) => (
        the_string.toLowerCase().replace(/ id/, ' ID')
    );

    renderXLCards = () => {
        return (
            <div className="table-container is-card card-container">
                {this.props.results.map((card, card_index) => {
                    let tempRes = card.columns;
                    let img = null;
                    let actions = null;

                    if (get(this.props, 'hasActions', true)) actions = tempRes.pop();

                    let cardTitle = '',
                        cardTitleHtml = '',
                        cardTitleIndex = -1;

                    [cardTitle, cardTitleIndex] = this.findCardTitle(card);

                    tempRes.splice(cardTitleIndex, 1);
                    if (this.props.withImg) img = tempRes.splice(0, 1);

                    let chunks = chunk(tempRes, Math.ceil(tempRes.length / 2));

                    let rowClick = () => {};

                    if (card.rowLink) {
                        rowClick = () => {
                            if (this.props.rowClicked) {
                                this.props.rowClicked(card.rowLink); // use the user defined clicked function
                            } else {
                                this.defaultLinkClicked(card.rowLink); // use the default clicked function
                            }
                        }
                    }

                    if (cardTitle) {
                        cardTitleHtml = (
                            <div className="card-title" onClick={rowClick}>
                                {this.specialLowercase(cardTitle)}
                            </div>
                        );
                    }

                    return (
                        <div key={`card-${card_index}`} className={`card ${this.props.className} xlCards`}>
                            {cardTitleHtml}
                            <div className="card-body">
                                {img && React.cloneElement(img[0].body, {has_ribbon: false, needs_bottom: true})}
                                <div className="row card-row">
                                    <div className={`col-sm-${img ? (actions ? 5 : 6) : (actions ? 4 : 6)}`}>
                                        {chunks[0].map((column, i) => {
                                            i++;

                                            // for auction cards if the column body is empty then don't output it.
                                            // Like if store id is empty then skip it
                                            if (!get(column, 'body', column)) {
                                                return null
                                            }

                                            if (typeof column === 'object' && column.cardHidden === true) {
                                                return (
                                                    <span key={`column-${i}-removed`} className="column-removed"/>);
                                            }

                                            if (i === cardTitleIndex) {
                                                return (
                                                    <span key={`column-${i}-removed`} className="column-removed"/>);
                                            }

                                            let rowClick = () => {
                                            };

                                            if (card.rowLink && get(column, 'rowLink', true) !== false) {
                                                rowClick = () => {
                                                    if (this.props.rowClicked) {
                                                        this.props.rowClicked(card.rowLink); // use the user defined clicked function
                                                    } else {
                                                        this.defaultLinkClicked(card.rowLink); // use the default clicked function
                                                    }
                                                };
                                            }

                                            let title = get(this.props.headers, i, ''),
                                                titleHtml = null,
                                                cardBodyTitleClass = "card-body-row",
                                                titleClass = "";


                                            if (typeof title === 'object') {
                                                titleClass = " " + title.className;
                                                title = title.body;
                                            }

                                            if (title) {
                                                titleHtml = (
                                                    <div className={`title${titleClass}`}
                                                         onClick={rowClick}>{this.specialLowercase(title)}:</div>
                                                );
                                            } else {
                                                cardBodyTitleClass += " card-no-header";
                                            }

                                            let clearFix = this.props.fmCards ? (
                                                <div className="clearfix"></div>) : null;

                                            if (get(column, 'body', column) && get(column, 'body', column) != '') {

                                                return [
                                                    <div key={`card-${i}-body`} className={cardBodyTitleClass}
                                                         onClick={rowClick}>
                                                        {titleHtml}
                                                        <span className={"body " + get(column, 'className', '')}>
                                                                {this.getBodyText(column)}
                                                            </span>
                                                    </div>,
                                                    clearFix
                                                ];
                                            }

                                            return null;
                                        })}
                                    </div>
                                    <div className={`col-sm-${img ? (actions ? 4 : 6) : (actions ? 4 : 6)}`}>
                                        {chunks[1].map((column, i) => {
                                            i = i + Math.ceil(tempRes.length / 2);
                                            i++;

                                            if (typeof column === 'object' && column.cardHidden === true) {
                                                return (
                                                    <span key={`column-${i}-removed`} className="column-removed"/>);
                                            }

                                            if (i === cardTitleIndex) {
                                                return (
                                                    <span key={`column-${i}-removed`} className="column-removed"/>);
                                            }

                                            let rowClick = () => {
                                            };

                                            if (card.rowLink && get(column, 'rowLink', true) !== false) {
                                                rowClick = () => {
                                                    if (this.props.rowClicked) {
                                                        this.props.rowClicked(card.rowLink); // use the user defined clicked function
                                                    } else {
                                                        this.defaultLinkClicked(card.rowLink); // use the default clicked function
                                                    }
                                                };
                                            }

                                            let title = get(this.props.headers, i, ''),
                                                titleHtml = null,
                                                cardBodyTitleClass = "card-body-row",
                                                titleClass = "";


                                            if (typeof title === 'object') {
                                                titleClass = " " + title.className;
                                                title = title.body;
                                            }

                                            if (title) {
                                                titleHtml = (
                                                    <div className={`title${titleClass}`}
                                                         onClick={rowClick}>{this.specialLowercase(title)}:</div>
                                                );
                                            } else {
                                                cardBodyTitleClass += " card-no-header";
                                            }

                                            let clearFix = this.props.fmCards ? (
                                                <div className="clearfix"></div>) : null;

                                            if (get(column, 'body', column) && get(column, 'body', column) != '') {

                                                return [
                                                    <div key={`card-${i}-body`} className={cardBodyTitleClass}
                                                         onClick={rowClick}>
                                                        {titleHtml}
                                                        <span className={"body " + get(column, 'className', '')}>
                                                        {this.getBodyText(column)}
                                                    </span>
                                                    </div>,
                                                    clearFix
                                                ];
                                            }

                                            return null;
                                        })}
                                    </div>
                                    {actions &&
                                        <div className={`col-sm-${img ? 3 : "4 actions-menu"}`}>
                                            {/*get(this.props, 'fmCards', false) ? actions.body : actions*/}
                                            {actions.body || actions}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}

                {this.renderTablePagination()}
            </div>
        )
    };

    renderCards = () => {
        return (
            <div className="table-container is-card card-container">
                {this.props.results.map((card, card_index) => {

                    let cardTitle = '',
                        cardTitleHtml = '',
                        cardTitleIndex = -1;

                    [cardTitle, cardTitleIndex] = this.findCardTitle(card);

                    let rowClick = () => {
                    };

                    if (card.rowLink) {
                        rowClick = () => {
                            if (this.props.rowClicked) {
                                this.props.rowClicked(card.rowLink); // use the user defined clicked function
                            } else {
                                this.defaultLinkClicked(card.rowLink); // use the default clicked function
                            }
                        }
                    }

                    if (cardTitle) {
                        cardTitleHtml = (
                            <div className="card-title" onClick={rowClick}>
                                {this.specialLowercase(cardTitle)}
                            </div>
                        );
                    }

                    return (
                        <div key={`card-${card_index}`} className={`card ${this.props.className}`}>
                            {cardTitleHtml}
                            <div className="card-body">
                                {card.columns.map((column, i) => {

                                    // for auction cards if the column body is empty then don't output it.
                                    // Like if store id is empty then skip it
                                    if (!get(column, 'body', column)) {
                                        return null;
                                    }

                                    if (typeof column === 'object' && column.cardHidden === true) {
                                        return (<span key={`column-${i}-removed`} className="column-removed"/>);
                                    }

                                    if (i === cardTitleIndex) {
                                        return (<span key={`column-${i}-removed`} className="column-removed"/>);
                                    }

                                    let rowClick = () => {
                                    };

                                    if (card.rowLink && get(column, 'rowLink', true) !== false) {
                                        rowClick = () => {
                                            if (this.props.rowClicked) {
                                                this.props.rowClicked(card.rowLink); // use the user defined clicked function
                                            } else {
                                                this.defaultLinkClicked(card.rowLink); // use the default clicked function
                                            }
                                        };
                                    }

                                    let title = get(this.props.headers, i, ''),
                                        titleHtml = null,
                                        cardBodyTitleClass = "card-body-row",
                                        titleClass = "";


                                    if (typeof title === 'object') {
                                        titleClass = " " + title.className;
                                        title = title.body;
                                    }

                                    if (title) {
                                        titleHtml = (
                                            <div className={`title${titleClass}`} onClick={rowClick}>{this.specialLowercase(title)}:</div>
                                        );
                                    } else {
                                        cardBodyTitleClass += " card-no-header";
                                    }

                                    if (get(column, 'body', column) && get(column, 'body', column) != '') {

                                        return (
                                            <div key={`card-${i}-body`} className={cardBodyTitleClass} onClick={rowClick}>
                                                {titleHtml}
                                                <span className={"body " + get(column, 'className', '')}>
                                                    {this.getBodyText(column)}
                                                </span>
                                            </div>
                                        );
                                    }

                                    return null;
                                })}
                            </div>
                        </div>
                    );
                })}

                {this.renderTablePagination()}
            </div>
        )
    };

    renderEmptyTable = () => {
        let tableClass = `${this.props.baseTableClass} ${this.props.className}`;
        let tableTitle = '';
        let tableOptions = '';

        if (this.props.tableTitle !== false) {
            tableTitle = (
                <div className="table-title">
                    {this.props.tableTitle}
                </div>
            );
        }

        if (this.props.cardFooter !== false) {
            tableOptions = (
                <div className="card-footer">
                    {this.props.cardFooter}
                </div>
            );
        }

        return (
            <div className="table-container is-table empty-table">
                {tableTitle}
                <table className={tableClass}>
                    <tbody>
                    <tr key="no-rows" className="no-rows">
                        <td colSpan="100">
                            {this.props.emptyRows}
                        </td>
                    </tr>
                    </tbody>
                </table>
                {tableOptions}
            </div>
        );
    };

    defaultLinkClicked = (link) => {
        if (typeof link === 'function') {
            link(); // since in this component this.props.history is undefined we have this as a workaround.
        }
        // TODO:// fix this
        // alert(`This does not work as of right now ${link}`);
        // -- commented this out so it doesn't break the page as of right now -- //
        //this.props.history.push(link); // the application is saying that this.props.history.push is undefined
    };

    render() {

        // Empty tables or cards look the same
        if (get(this.props, 'results', []).length == 0) {
            return this.renderEmptyTable();
        }

        let responseAt = get(this.props.screen, this.props.respondAt);
        if (responseAt) {
            responseAt -= 1;
        } else {
            responseAt = this.props.respondAt;
        }

        const xlCards = get(this.props, 'xlCards', false);

        return (this.props.canRespond && this.props.windowWidth <= (responseAt - 1)) ?
            (xlCards ? this.renderXLCards() : this.renderCards()) :
            this.renderTable();
    }
}

Table.defaultProps = {
    withImg: false,
    baseTableClass: 'table table-hover table-stripped',
    className: '',

    tableTitle: false,
    headers: [],

    hasPagination: true,
    paginationPerPage: 50,
    totalRecords: -1,
    currentPage: 1,

    canRespond: true,
    respondAt: 'xs',

    hasSort: false,
    sortColumn: '',
    sortAsc: false,
    sortableColumns: false,

    cardFooter: false,

    emptyRows: (<MissingBlock/>),

    rowClicked: false,
    handleRedoSearch: (search) => {
        alert("missing the handleRedoSearch function");
        // empty function to prevent undefined error
    }
};

export default Table;
