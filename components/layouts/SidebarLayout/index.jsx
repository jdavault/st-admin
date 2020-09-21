import './styles.less';
import SidebarItem from './SidebarItem';
import ItemSelector from '../../utils/ItemSelector';
import EnhancedChildren from './EnhancedChildren';

const SidebarLayout = ({items, children}) => {
  return (
    <ItemSelector items={items} renderItemComponent={SidebarItem}>
      {({selectedItem, setSelectedItem, itemListComponent}) => (
        <div className="sidebarlayout-container">
          <div className="sidebar-container">
            {itemListComponent}
          </div>
          <EnhancedChildren
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          >
            {children}
          </EnhancedChildren>
        </div>
      )}
    </ItemSelector>
  );
};

export default SidebarLayout;
