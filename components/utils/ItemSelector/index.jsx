import {useState} from 'react';

/**
 * ItemSelector util component for 'select' type logic – takes in a
 * list of items, renders each to 'renderItemComponent' prop, and
 * stores selected one in state.
 *
 * This component uses the 'render props' technique:
 *   * https://reactjs.org/docs/render-props.html
 *   * https://reactjs.org/docs/render-props.html#using-props-other-than-render
 *
 * @return {Function} children as 'render props' with three props:
 *   * {string} selectedItem - the current selected item stored in state
 *   * {Function} setSelectedItem - function to set 'selectedItem'
 *   * {ReactNode} itemListComponent - a react component with each item rendered
 *                 as 'renderItemComponent'; a list of 'renderItemComponent'
 *
 * This util component is handy when developing components that need
 * list selection storing logic such as sidebars, navbars, radios, etc.
 *
 * @example
 * const NavItem = ({name, label, selected, setSelectedItem}) => (
 *    <div
 *      className={`navitem ${selected && 'navitem-selected}`}
 *      onClick={() => setSelectedItem(name)}
 *    >
 *      {label}
 *    </div>
 * )
 *
 * const NavBar = ({items}) => (
 *    <ItemSelector items={items} renderItemComponent={NavItem}>
 *      {({selectedItem, setSelectedItem, itemListComponent}) => {
 *          {itemListComponent}
 *          {children({selectedItem})}
 *        </div>
 *      }}
 *    </ItemSelector>
 * )
 *
 * const HomePage = () => (
 *    <NavBar
 *      items={[
 *       {name: 'home', label:'Home'},
 *       {name: 'account', label: 'Account'}
 *      ]}
 *    >
 *      {({selectedItem}) => (
 *        {selectedItem === 'home' && <div>This is the homepage!</div>}
 *        {selectedItem === 'account' && <div>This is your account!</div>}
 *      )}
 *    </NavBar>
 * )
 *
 * @param {Object} items
 * @param {string} items.name
 * @param {string} items.label
 * @param {ReactNode} renderItemComponent
 * @param {ReactNode} children
 */
const ItemSelector = ({items, renderItemComponent: Item, children}) => {
  const [selectedItem, setSelectedItem] = useState(items[0].name);

  const itemListComponent = items.map(item =>
    <Item
      key={item.name}
      selected={selectedItem === item.name}
      setSelectedItem={setSelectedItem}
      {...item}
    />,
  );

  return children({selectedItem, setSelectedItem, itemListComponent});
};

export default ItemSelector;
