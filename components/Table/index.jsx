import './table.less';
import React from 'react';
import {useWindowSize} from '../../hooks/useWindowSize';
import EmptyTable from './EmptyTable';
import Header from './Header';
import MissingBlock from '../st-react/partials/MissingBlock';
import {get} from 'lodash';


const Table = ({
  tableTitle = false, // change to 'title'
  cardFooter = false, // change to 'footerText'
  results = [],
  className = '',
  baseTableClass = 'table table-hover table-stripped',
  emptyRows = <MissingBlock/>, // change to 'EmptyRowComponent'
  canRespond = true, // change to 'responsive'
  respondAt = 'xs', // .......
  rowClicked = false,
}) => {
  const tableClass = `${baseTableClass} ${className}`;

  const Title = () => tableTitle &&
    <div className="table-title">{tableTitle}</div>;

  const Footer = () => cardFooter &&
    <div className="card-footer">{cardFooter}</div>;

  const defaultLinkClicked = (link) => {
    if (typeof link === 'function') {
      // since in this component this.props.history
      // is undefined we have this as a workaround.
      link();
    }
    // TODO:// fix this
    // alert(`This does not work as of right now ${link}`);
    // -- commented this out so it doesn't break the page as of right now -- //
    // this.props.history.push(link);
    // the application is saying that this.props.history.push is undefined
  };

  const renderTableColumns = () => {
    return (
      <tbody>
        {results.map((row, row_key) => {
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
                    if (rowClicked) {
                      // use the user defined clicked function
                      rowClicked(row.rowLink);
                    } else {
                      // use the default clicked function
                      defaultLinkClicked(row.rowLink);
                    }
                  };
                }

                let body = column;

                if (typeof column == 'object') {
                  if ('body' in column) {
                    // if key of body is in the object
                    // then it's a user definied row
                    body = column.body;
                  }
                }

                return (
                  <td
                    key={column_key}
                    onClick={rowClick}
                    className={get(column, 'className', 'text')}
                  >
                    {body}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };

  if (results.length) {
    return (
      <div className="table-container is-table">
        <Title/>
        <table className={tableClass}>
          <Header/>
          {renderTableColumns()}
        </table>
        {/* this.renderTablePagination()*/}
        <Footer/>
      </div>
    );
  }

  return <EmptyTable
    tableClass={tableClass}
    emptyRows={emptyRows}
    Title={Title}
    Footer={Footer}
  />;
};

export default Table;
