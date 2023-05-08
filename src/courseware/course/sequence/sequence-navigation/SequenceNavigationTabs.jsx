import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import UnitButton from './UnitButton';
import SequenceNavigationDropdown from './SequenceNavigationDropdown';
import useIndexOfLastVisibleChild from '../../../../generic/tabs/useIndexOfLastVisibleChild';

const SequenceNavigationTabs = ({
  disableUnitsAfterCompletion, unitIds, unitId, showCompletion, onNavigate, units, unitsSequentialCompletion,
}) => {
  const [
    indexOfLastVisibleChild,
    containerRef,
    invisibleStyle,
  ] = useIndexOfLastVisibleChild();
  const shouldDisplayDropdown = indexOfLastVisibleChild === -1;

  const unitCompletion = {};

  if (unitsSequentialCompletion && units) {
    const unitsArr = Object.values(units);
    unitIds.forEach((uId, i) => {
      if ((i > 0) && (!unitCompletion[unitIds[i - 1]])) {
        unitCompletion[uId] = false;
      } else {
        unitCompletion[uId] = unitsArr[i].complete;
      }
    });
  }

  return (
    <div style={{ flexBasis: '100%', minWidth: 0 }}>
      <div className="sequence-navigation-tabs-container" ref={containerRef}>
        <div
          className="sequence-navigation-tabs d-flex flex-grow-1"
          style={shouldDisplayDropdown ? invisibleStyle : null}
        >
          {unitIds.map((buttonUnitId, i) => (
            <UnitButton
              disableUnitsAfterCompletion={disableUnitsAfterCompletion}
              key={buttonUnitId}
              unitId={buttonUnitId}
              isActive={unitId === buttonUnitId}
              showCompletion={showCompletion}
              onClick={onNavigate}
              forceLock={(unitsSequentialCompletion && (i > 0)) ? !unitCompletion[unitIds[i - 1]] : false}
            />
          ))}
        </div>
      </div>
      {shouldDisplayDropdown && (
        <SequenceNavigationDropdown
          unitId={unitId}
          onNavigate={onNavigate}
          showCompletion={showCompletion}
          unitIds={unitIds}
        />
      )}
    </div>
  );
};

SequenceNavigationTabs.propTypes = {
  unitId: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  unitsSequentialCompletion: PropTypes.bool,
  disableUnitsAfterCompletion: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  units: PropTypes.object,
};

SequenceNavigationTabs.defaultProps = {
  disableUnitsAfterCompletion: false,
  units: undefined,
  unitsSequentialCompletion: false,
};

const mapStateToProps = (state) => ({ units: state.models.units });

export default connect(mapStateToProps)(SequenceNavigationTabs);
