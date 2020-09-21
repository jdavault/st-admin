import {useEffect, cloneElement} from 'react';
import {useRouter} from 'next/router';

const EnhancedChildren = ({
  children,
  setSelectedItem,
  selectedItem,
},
) => {
  const router = useRouter();

  const alignSidebarWithPathname = () => {
    if (router.pathname.replace('/', '') !== selectedItem) {
      setSelectedItem(router.pathname.replace('/', ''));
    }
  };

  useEffect(() => {
    alignSidebarWithPathname();
  }, [router.pathname]);

  return cloneElement(children, {setSelectedItem, selectedItem});
};

export default EnhancedChildren;
