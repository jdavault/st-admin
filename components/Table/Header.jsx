import React from 'react';
import {get, has} from 'lodash';

const Header = ({
  results,
  headers: _headers,
  hasSort,
  sortColumn,
  triggerSearchChange,
  sortAsc,
}) => {
  if (!results) {
    return '';
  }

  const renderTableSorting = (column_object, column_index) => {
    const column_name = get(column_object, 'body', column_object);

    if (this.props.sortableColumns !== false) {
      if (this.props.sortableColumns.indexOf(column_index) < 0) {
        return [
          false,
          () => {
          },
        ];
      }
    }

    if (column_name !== sortColumn.body && column_name !== sortColumn) {
      // New column clicked column sorting restarted to ascending
      const onclick = () => {
        triggerSearchChange({sortColumn: column_object, sortAsc: true});
      };

      return [
        (
          <span className="sort-arrow sort">
            <i className="fa fa-long-arrow-up"/>
            <i className="fa fa-long-arrow-down"/>
          </span>
        ),
        onclick,
      ];
    }

    if (sortAsc) {
      const onclick = () => {
        triggerSearchChange({sortColumn: column_object, sortAsc: false});
      };
      return [
        (
          <i className="fa fa-sort-amount-asc sort-arrow" onClick={onclick}/>
        ),
        onclick,
      ];
    }

    const onclick = () => {
      triggerSearchChange({sortColumn: column_object, sortAsc: true});
    };

    return [
      (
        <i className="fa fa-sort-amount-desc sort-arrow" onClick={onclick}/>
      ),
      onclick,
    ];
  };


  const headers = _headers.map((item, i) => {
    if (item === false) {
      return (<th key={`th-empty-${i}`} className="empty-header"/>);
    }

    const sorting = (hasSort ? renderTableSorting(item, i) : '');
    let thClass = (hasSort && sorting[0] !== false ? 'sort-arrow' : '');

    if (has(item, 'body')) {
      thClass += ' ' + item.className;
      item = item.body;
    }

    return (
      <th key={`th-${i}`} className={thClass} onClick={sorting[1]}>
        <span>{item}</span> {sorting[0]}
      </th>
    );
  });

  return (
    <thead>
      <tr>
        {headers}
      </tr>
    </thead>
  );
};

export default Header;
