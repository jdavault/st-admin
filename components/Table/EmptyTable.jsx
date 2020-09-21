import React from 'react';

const EmptyTable = ({
  Title,
  Footer,
  tableClass,
  emptyRows,
}) => {
  return (
    <div className="table-container is-table empty-table">
      <Title />
      <table className={tableClass}>
        <tbody>
          <tr key="no-rows" className="no-rows">
            <td colSpan="100">
              {emptyRows}
            </td>
          </tr>
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default EmptyTable;
