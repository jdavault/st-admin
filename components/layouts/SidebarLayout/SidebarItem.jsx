import Link from '../../st-react/Link';

const SidebarItem = ({
  render,
  selected,
  setSelectedItem,
  label,
  name,
  onClick = () => {},
}) => {
  if (render) {
    return render({label, name});
  }

  const _onClick = () => {
    setSelectedItem(name);
    onClick(name);
  };

  return (
    <Link to={`/${name}`}>
      <div
        onClick={_onClick}
        className={`
        sidebarlayout-item-container
        ${selected && 'sidebarlayout-item-container-selected'}
      `}
      >
        <p className="sidebarlayout-item-label">{label}</p>
      </div>
    </Link>
  );
};

export default SidebarItem;
