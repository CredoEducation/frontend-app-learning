import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PageLoading from '../../../generic/PageLoading';
import { useModel, useModels } from '../../../generic/model-store';

import messages from './messages';
import Unit from './Unit';

const ContentLock = React.lazy(() => import('./content-lock'));

const SequenceContent = ({
  gated,
  intl,
  courseId,
  sequenceId,
  unitId,
  unitLoadedHandler,
}) => {
  const sequence = useModel('sequences', sequenceId);
  const unitsArr = useModels('units', sequence.unitIds);
  const unitCompletion = {};
  let firstUncompletedUnitId = null;
  let firstUncompletedUnitTitle = null;
  let currentUnitTitle = null;
  let prevUnitId = null;
  let currentCompletion = false;

  if (sequence.unitsSequentialCompletion || sequence.disableUnitsAfterCompletion) {
    sequence.unitIds.forEach((uId, i) => {
      if (uId === unitId) {
        currentUnitTitle = unitsArr[i].title;
        currentCompletion = unitsArr[i].complete;
      }
      if ((i > 0) && (uId === unitId)) {
        prevUnitId = sequence.unitIds[i - 1];
      }
      if ((i > 0) && (!unitCompletion[sequence.unitIds[i - 1]])) {
        unitCompletion[uId] = false;
      } else {
        unitCompletion[uId] = unitsArr[i].complete;
      }
      if (!unitCompletion[uId] && (firstUncompletedUnitId === null)) {
        firstUncompletedUnitId = unitsArr[i].id;
        firstUncompletedUnitTitle = unitsArr[i].title;
      }
    });
  }

  // Go back to the top of the page whenever the unit or sequence changes.
  useEffect(() => {
    global.scrollTo(0, 0);
  }, [sequenceId, unitId]);

  if (gated) {
    return (
      <Suspense
        fallback={(
          <PageLoading
            srMessage={intl.formatMessage(messages.loadingLockedContent)}
          />
        )}
      >
        <ContentLock
          courseId={courseId}
          sequenceTitle={sequence.title}
          prereqSectionName={sequence.gatedContent.prereqSectionName}
          prereqId={sequence.gatedContent.prereqId}
        />
      </Suspense>
    );
  }

  const unit = useModel('units', unitId);
  if (!unitId || !unit) {
    return (
      <div>
        {intl.formatMessage(messages.noContent)}
      </div>
    );
  }

  let contentLocked = false;
  let lockMsg;
  if (sequence.unitsSequentialCompletion && prevUnitId && !unitCompletion[prevUnitId]) {
    contentLocked = true;
  }
  if (sequence.disableUnitsAfterCompletion && currentCompletion) {
    contentLocked = true;
    lockMsg = 'Block is completed';
  }

  if (contentLocked) {
    return (
      <Suspense
        fallback={(
          <PageLoading
            srMessage={intl.formatMessage(messages.loadingLockedContent)}
          />
        )}
      >
        <ContentLock
          btnTitle="Go To Uncompleted Block"
          lockMsg={lockMsg}
          courseId={courseId}
          sequenceTitle={currentUnitTitle}
          prereqSectionName={firstUncompletedUnitTitle}
          prereqId={firstUncompletedUnitId ? `${sequenceId}/${firstUncompletedUnitId}` : undefined}
        />
      </Suspense>
    );
  }

  return (
    <Unit
      courseId={courseId}
      format={sequence.format}
      key={unitId}
      id={unitId}
      onLoaded={unitLoadedHandler}
      prevUnitId={prevUnitId}
      unitsSequentialCompletion={sequence.unitsSequentialCompletion}
    />
  );
};

SequenceContent.propTypes = {
  gated: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  unitLoadedHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

SequenceContent.defaultProps = {
  unitId: null,
};

export default injectIntl(SequenceContent);
