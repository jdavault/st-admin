import '../styles/global.less';
import {useEffect} from 'react';
import {Provider} from 'react-redux';
import {useStore} from '../redux/store';
import Navbar from '../components/Navbar';
import SidebarLayout from '../components/layouts/SidebarLayout';
import {useRouter} from 'next/router';

import '../styles/vendors/bootstrap/bootstrap.less';
import '../styles/vendors/bootstrap/theme.less';

const sidebarItems = [
  { name: 'ars', label: 'ARS' },
  { name: 'onlineauctions', label: 'Online Auctions' },
  { name: 'liveauctions', label: 'Live Auctions' },
  { name: 'users', label: 'Users' },
  { name: 'facilities', label: 'Facilities' },
  { name: 'accounts', label: 'Accounts' },
  { name: 'invoices', label: 'Invoices' },
  { name: 'emaillog', label: 'Email Log' },
  { name: 'articles', label: 'Articles' },
  { name: 'promocodes', label: 'Promo Codes' },
  { name: 'admins', label: 'Admins' },
  { name: 'editor', label: 'Editor' },
  { name: 'merlin', label: 'Merlin' },
];

function Root({Component, pageProps}) {
  const store = useStore();
  const router = useRouter();

  useEffect(() => {
    router.push('ars');
  }, []);

  return (
    <Provider store={store}>
      <Navbar />
      <SidebarLayout items={sidebarItems}>
        <Component {...pageProps} />
      </SidebarLayout>
    </Provider>
  );
}

export default Root;
