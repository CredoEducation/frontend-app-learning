import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { history } from '@edx/frontend-platform';
import { Button } from '@edx/paragon';

import messages from './messages';

const ContentLock = ({
  btnTitle, lockMsg, intl, courseId, prereqSectionName, prereqId, sequenceTitle,
}) => {
  const handleClick = useCallback(() => {
    history.push(`/course/${courseId}/${prereqId}`);
  }, [courseId, prereqId]);

  return (
    <>
      <h3>
        <FontAwesomeIcon icon={faLock} />
        {' '}
        {sequenceTitle && <>{sequenceTitle}</>}
      </h3>
      {!lockMsg && (
      <><h4>{intl.formatMessage(messages['learn.contentLock.content.locked'])}</h4>
        {prereqSectionName && (
        <p>
          {intl.formatMessage(messages['learn.contentLock.complete.prerequisite'], {
            prereqSectionName,
          })}
        </p>
        )}
      </>
      )}
      {lockMsg && <><br /><p>{lockMsg}</p></>}
      {prereqId && (
      <p>
        <Button variant="primary" onClick={handleClick}>{btnTitle || intl.formatMessage(messages['learn.contentLock.goToSection'])}</Button>
      </p>
      )}
    </>
  );
};

ContentLock.defaultProps = {
  btnTitle: undefined,
  lockMsg: undefined,
  sequenceTitle: null,
  prereqId: undefined,
  prereqSectionName: null,
};

ContentLock.propTypes = {
  btnTitle: PropTypes.string,
  lockMsg: PropTypes.string,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  prereqSectionName: PropTypes.string,
  prereqId: PropTypes.string,
  sequenceTitle: PropTypes.string,
};
export default injectIntl(ContentLock);
