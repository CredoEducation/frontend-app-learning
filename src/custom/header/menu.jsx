/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useEffect, useCallback, useState, useRef, cloneElement, Children,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const Menu = ({ children, title }) => {
  const [visible, setVisible] = useState(false);
  const handleClose = useCallback(() => setVisible(false), []);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (visible && ref.current && !ref.current.contains(event.target)) {
        setVisible(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div className="menu" role="menu" ref={ref} onClick={() => { setVisible(!visible); }} tabIndex="-1">
      <div
        className="toggle"
      >
        {title && (
          <span className="title">{title}</span>
        )}
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
      {visible && (
        <div
          className="items"
        >
          {Children.map(children, child => (
            cloneElement(child, { onClose: handleClose })
          ))}
        </div>
      )}
    </div>
  );
};

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

Menu.defaultProps = {
  title: null,
};

const MenuItem = ({
  children, href, onClose, onClick,
}) => {
  const handleClick = event => {
    if (onClose) {
      onClose();
    }
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div className="item">
      <a
        onClick={handleClick}
        href={href}
        className="link"
        role="menuitem"
      >
        {children}
      </a>
    </div>
  );
};

MenuItem.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/require-default-props
  onClose: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  href: null,
};

Menu.Item = MenuItem;

export default Menu;
