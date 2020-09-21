import {useEffect, useState} from 'react';
import Table from '../../components/Table';
import AuctionService from '../../services/AuctionService';

const results = {
  columns: [
    {},
  ],
};

const ARS = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const {
        auctions,
        auction_categories: categories = [],
        total_records = 0,
        current_page = '1',
      } = await AuctionService.getOnlineAuctions({});


      return setData({
        auctions,
        categories,
        total_records,
        current_page,
        online_search_loading: false,
      });
    };

    fetchData();
  }, []);

  useEffect(() => console.log(data), [data]);

  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
      <Table
        key="recent-bids"
        className="recent-bids"
        tableTitle="Recent Bids"
        headers={['AUCTION ID', 'FACILITY', 'BID DATE', 'AMOUNT']}
        canRespond={false}
      />
    </div>
  );
};

export default ARS;
