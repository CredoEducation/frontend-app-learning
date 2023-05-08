import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { Alert, Button, Hyperlink } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import enrollmentMessages from '../../../../alerts/enrollment-alert/messages';
import genericMessages from '../../../../generic/messages';
import messages from './messages';
import outlineMessages from '../../messages';
import useEnrollClickHandler from '../../../../alerts/enrollment-alert/clickHook';
import { useModel } from '../../../../generic/model-store';

const PrivateCourseAlert = ({ intl, payload }) => {
  const {
    anonymousUser,
    canEnroll,
    courseId,
    userMustBeActive,
  } = payload;

  const {
    org,
    title,
  } = useModel('courseHomeMeta', courseId);

  const { enrollClickHandler, loading } = useEnrollClickHandler(
    courseId,
    org,
    intl.formatMessage(enrollmentMessages.success),
  );

  const enrollNowButton = (
    <Button
      disabled={loading}
      variant="link"
      className="p-0 border-0 align-top mr-1"
      style={{ textDecoration: 'underline' }}
      size="sm"
      onClick={enrollClickHandler}
    >
      {intl.formatMessage(enrollmentMessages.enrollNowInline)}
    </Button>
  );

  const disableRegister = getConfig().DISABLE_REGISTER;
  const register = (
    <Hyperlink
      style={{ textDecoration: 'underline' }}
      destination={`${getConfig().LMS_BASE_URL}/register?next=${encodeURIComponent(global.location.href)}`}
    >
      {intl.formatMessage(genericMessages.registerLowercase)}
    </Hyperlink>
  );

  const signIn = (
    <Hyperlink
      style={{ textDecoration: 'underline' }}
      destination={`${getLoginRedirectUrl(global.location.href)}`}
    >
      {intl.formatMessage(genericMessages.signInSentenceCase)}
    </Hyperlink>
  );

  return (
    <Alert variant="light" data-testid="private-course-alert">
      {anonymousUser && (
        <>
          <p className="font-weight-bold">
            {intl.formatMessage(enrollmentMessages.alert)}
          </p>
          {!disableRegister && (
          <FormattedMessage
            id="learning.privateCourse.signInOrRegister"
            description="Prompts the user to sign in or register to see course content."
            defaultMessage="{signIn} or {register} and then enroll in this course."
            values={{
              signIn,
              register,
            }}
          />
          )}
          {disableRegister && (
          <FormattedMessage
            id="learning.privateCourse.signInOrRegister"
            description="Prompts the user to sign in to see course content."
            defaultMessage="{signIn} and then enroll in this course."
            values={{
              signIn,
            }}
          />
          )}
        </>
      )}
      {!anonymousUser && (
        <>
          <p className="font-weight-bold">{intl.formatMessage(outlineMessages.welcomeTo)} {title}</p>
          {canEnroll && (
            <div className="d-flex">
              {enrollNowButton}
              {intl.formatMessage(messages.toAccess)}
              {loading && <FontAwesomeIcon icon={faSpinner} spin />}
            </div>
          )}
          {!canEnroll && (
            <>
              {userMustBeActive ? 'Please, activate you account' : intl.formatMessage(enrollmentMessages.alert)}
            </>
          )}
        </>
      )}
    </Alert>
  );
};

PrivateCourseAlert.propTypes = {
  intl: intlShape.isRequired,
  payload: PropTypes.shape({
    anonymousUser: PropTypes.bool,
    canEnroll: PropTypes.bool,
    userMustBeActive: PropTypes.bool,
    courseId: PropTypes.string,
  }).isRequired,
};

export default injectIntl(PrivateCourseAlert);
