import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@edx/paragon';

import UnitIcon from './UnitIcon';
import CompleteIcon from './CompleteIcon';
import BookmarkFilledIcon from '../../bookmark/BookmarkFilledIcon';

const UnitButton = ({
  onClick,
  title,
  contentType,
  isActive,
  bookmarked,
  complete,
  showCompletion,
  unitId,
  className,
  showTitle,
  forceLock,
  disableUnitsAfterCompletion,
}) => {
  const handleClick = useCallback(() => {
    if (disableUnitsAfterCompletion && complete) {
      return;
    }
    onClick(unitId);
  }, [onClick, unitId, disableUnitsAfterCompletion, complete]);
  const css = disableUnitsAfterCompletion && complete ? { cursor: 'default' } : {};

  return (
    <Button
      className={classNames({
        active: isActive,
        complete: showCompletion && complete,
      }, className)}
      variant="link"
      onClick={handleClick}
      title={title}
      style={css}
    >
      <UnitIcon type={forceLock ? 'lock' : contentType} />
      {showTitle && <span className="unit-title">{title}</span>}
      {showCompletion && complete ? <CompleteIcon size="sm" className="text-success ml-2" /> : null}
      {bookmarked ? (
        <BookmarkFilledIcon
          className="text-primary small position-absolute"
          style={{ top: '-3px', right: '5px' }}
        />
      ) : null}
    </Button>
  );
};

UnitButton.propTypes = {
  disableUnitsAfterCompletion: PropTypes.bool,
  bookmarked: PropTypes.bool,
  className: PropTypes.string,
  complete: PropTypes.bool,
  contentType: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool,
  showTitle: PropTypes.bool,
  title: PropTypes.string.isRequired,
  unitId: PropTypes.string.isRequired,
  forceLock: PropTypes.bool,
};

UnitButton.defaultProps = {
  disableUnitsAfterCompletion: false,
  className: undefined,
  isActive: false,
  bookmarked: false,
  complete: false,
  showTitle: false,
  showCompletion: true,
  forceLock: false,
};

const mapStateToProps = (state, props) => {
  if (props.unitId && state.models.units) {
    return {
      ...state.models.units[props.unitId],
    };
  }
  return {};
};

export default connect(mapStateToProps)(UnitButton);
