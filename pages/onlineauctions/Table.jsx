import React, {useState} from 'react';

import StTable from '../../components/st-react/partials/Table';
import MissingBlock from '../../components/st-react/partials/MissingBlock';
import { get } from 'lodash';
import { getSortDirection } from '../../helpers/table_functions';
const WATCH = '../static/images/watch.svg';

const initialState = {
  sort_columns: [1, 2, 3, 5, 6],
  sort_asc: true,
  sort_column: {
    body: 'EXPIRES',
    className: 'date',
    column_map: 'expire_date',
    sort_asc: true,
  },
  results_current_page: 1,
  headers: [
    false,
    {
      body: 'HIGH BID',
      column_map: 'current_bid',
      className: 'number',
    },
    {
      body: 'EXPIRES',
      column_map: 'expire_date',
      className: 'date',
    },
    {
      body: 'FACILITY',
      column_map: 'facility_name',
      className: 'facility-name',
    },
    {
      body: 'AUCTION ID',
      column_map: 'auction_id',
      className: 'number',
    },
    {
      body: 'TOTAL BIDS',
      className: 'number',
      column_map: 'total_bids',
      sort_direction: 'asc',
    },
    {
      body: 'APPROX. SIZE',
      className: 'number',
      column_map: 'unit_volume',
      sort_direction: 'asc',
    },
    false,
  ],
  sortByModal: [],
  auction_id: false,
  doRedirect: false,
};

const Table = props => {
  const [state, setState] = useState(initialState);

  const getPageCount = () => {
    return 10;
  };

  const redoSearch = ({currentPage = 1, sortAsc = false, sortColumn}) => {
    const page_count = getPageCount();

    // Basically handles pagination
    setState({
      page_num: currentPage,
      sort_asc: sortAsc,
      sort_column: sortColumn,
    });

    props.getUserAuctionWatch(
        false,
        currentPage,
        page_count,
        sortColumn.column_map,
        getSortDirection(sortAsc),
    );
  };

  const formatWatchedAuctions = () => {
    const user_auctions = get(props, 'watchlist', []);

    return user_auctions.map((row_columns) => {
      const {
        auction,
        auction_id,
      } = row_columns;

      const banner_ribbon = (
        <div className="auction-image-wrapper">
          <AuctionImage
            auction={auction}
            image_url={get(auction, 'image.image_path', '')}
            className="auction-image bid-manager"
            needs_bottom={false}
          />

          <AuctionRibbon
            auction={auction}
            position="bottom"
          />
        </div>
      );


      return {
        rowLink: () => {
          this.setState({doRedirect: '/auctions/detail/' + auction_id});
        },
        columns: [
          {body: banner_ribbon},
          {body: <span className="auction-table-high-bid">{auction.current_bid.formatted}</span>, className: 'auction-table-high-bid number'},
          {body: `${auction.expire_date.user.date_formatted} - ${auction.expire_date.user.time_formatted}`},
          {body: (<>{auction.facility_name} <br/> {auction.city + ', ' + auction.state}</>), className: 'facility-name'},
          {body: auction.auction_id, className: 'number'},
          {body: auction.total_bids, className: 'number'},
          {body: `${auction.unit_length} x ${auction.unit_width}`, className: 'number'},
          {
            body: <a className="btn btn-regular btn-gray btn-block table-button" onClick={() => {
              this.setState({auction_id});
              this.showRemoveConfirm();
            }}>Remove</a>, rowLink: false,
          },
        ],
      };
    });
  };

  const renderNoResults = () => {
    return (
      <>
        <div className="text-center">
          <MissingBlock image={WATCH} message="You're not currently watching any auctions. Don't miss out on the action!"/>

          <div className="row">
            <div className="col-xxs-12 col-sm-6 search-button">
              <button className="btn btn-regular btn-orange dashboard-btn">
                Search Online Auctions
              </button>
            </div>
            <div className="col-xxs-12 col-sm-6">
              <button className="btn btn-regular btn-blue dashboard-btn">
                Learn About AuctionWatch
              </button>
            </div>
          </div>

        </div>
      </>
    );
  };

  return (
    <div>
      <StTable
        className="dashboard-table"
        // required.
        handleRedoSearch={redoSearch}
        headers={state.headers}
        results={formatWatchedAuctions()}
        // optional. defaults to true
        canRespond={true}
        // optional. unless you want to show sortable columns
        hasSort={true}
        sortableColumns={state.sort_columns} /* Only allow specific columns to be sortable. */
        sortAsc={state.sort_asc}
        sortColumn={state.sort_column}
        // optional. defaults to false. so this is optional unless you want it
        hasPagination={true}
        totalRecords={props.total_results}
        currentPage={state.page_num}
        paginationPerPage={getPageCount()}
        // optional. if not set it uses the Missing component with default text and image.
        emptyRows={renderNoResults()}
        respondAt="992"
        xlCards={true}
        hasActions={true}
        withImg
      />
    </div>
  );


  return (
    <div>

    </div>
  );
};

export default Table;
