import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@edx/paragon';

import messages from './messages';

function AuthenticatedUserDropdown({ enterpriseLearnerPortalLink, intl, username }) {
  let dashboardMenuItem = (
    <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
      {intl.formatMessage(messages.dashboard)}
    </Dropdown.Item>
  );
  if (enterpriseLearnerPortalLink && Object.keys(enterpriseLearnerPortalLink).length > 0) {
    dashboardMenuItem = (
      <Dropdown.Item
        href={enterpriseLearnerPortalLink.href}
      >
        {enterpriseLearnerPortalLink.content}
      </Dropdown.Item>
    );
  }
  return (
    <>
      <Dropdown className="user-dropdown">
        <Dropdown.Toggle variant="outline-primary">
          <FontAwesomeIcon icon={faUserCircle} className="d-md-none" size="lg" />
          <span data-hj-suppress className="d-none d-md-inline">
            {username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right">
          {dashboardMenuItem}
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/u/${username}`}>
            {intl.formatMessage(messages.profile)}
          </Dropdown.Item>
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/account/settings`}>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>
          <Dropdown.Item href={getConfig().LOGOUT_URL}>
            {intl.formatMessage(messages.signOut)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

AuthenticatedUserDropdown.propTypes = {
  enterpriseLearnerPortalLink: PropTypes.string,
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
};

AuthenticatedUserDropdown.defaultProps = {
  enterpriseLearnerPortalLink: '',
};

export default injectIntl(AuthenticatedUserDropdown);
