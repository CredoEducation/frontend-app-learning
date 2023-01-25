/* eslint-disable react/no-danger */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl } from '@edx/frontend-platform/i18n';
import Menu from './menu';

const Header = ({
  courseOrg, courseNumber, courseTitle, showUserDropdown, profileImageUrl,
}) => {
  const { authenticatedUser } = useContext(AppContext);
  const siteName = getConfig().SITE_NAME;
  const logoUrl = getConfig().LOGO_URL;
  const lmsBaseUrl = getConfig().LMS_BASE_URL;
  const dashboardLink = `${lmsBaseUrl}/dashboard`;
  const logoutLink = `${lmsBaseUrl}/logout`;
  const logoutLinkWithLoginRedirect = `${lmsBaseUrl}/logout?redirect_url=%2Flogin`;
  const isCredoAnonymous = authenticatedUser && authenticatedUser.email.endsWith('@credomodules.com');

  let userProfileImageUrl = `${lmsBaseUrl}/static/images/profiles/default_50.png`;
  let userMenuLinks = [];

  if (showUserDropdown && authenticatedUser) {
    if (profileImageUrl) {
      userProfileImageUrl = profileImageUrl.startsWith('http')
        ? profileImageUrl
        : `${lmsBaseUrl}${profileImageUrl}`;
    }

    userMenuLinks = [{
      key: 'dashboard',
      title: 'Dashboard',
      href: dashboardLink,
    }, {
      key: 'profile',
      title: 'Profile',
      href: `${lmsBaseUrl}/u/${authenticatedUser.username}`,
    }, {
      key: 'account',
      title: 'Account',
      href: `${lmsBaseUrl}/account/settings`,
    }, {
      key: 'signOut',
      title: 'Sign Out',
      href: logoutLink,
    }];
  }

  return (
    <header className="learning-header">
      <div className="header">
        <h1 className="logo-ext">
          {/* eslint-disable-next-line no-script-url */}
          <a href={isCredoAnonymous ? '#' : dashboardLink} style={{ cursor: isCredoAnonymous ? 'default' : 'pointer' }}>
            <img
              src={logoUrl}
              alt={siteName}
            />
          </a>
        </h1>
        <div className="nav">
          <div className="course">
            <div className="courseNum" dangerouslySetInnerHTML={{ __html: courseOrg && courseNumber ? `${courseOrg}: ${courseNumber}` : '&nbsp;' }} />
            <div className="courseName" dangerouslySetInnerHTML={{ __html: courseTitle || '&nbsp;' }} />
          </div>
          {showUserDropdown && authenticatedUser
          && (
          <div className="secondary">
            {isCredoAnonymous && <div className="item"><a href={logoutLinkWithLoginRedirect} className="link">Login as admin</a></div>}
            {!isCredoAnonymous && (
            <>
              <div className="item">
                <a className="link" href={dashboardLink}>
                  <img
                    src={userProfileImageUrl}
                    alt={authenticatedUser.username}
                  />
                  <span>{authenticatedUser.username}</span>
                </a>
              </div>
              <div className="item dropdown">
                <Menu>
                  {userMenuLinks.map(item => (
                    <Menu.Item key={item.key} href={item.href} role="menuitem">{item.title}</Menu.Item>
                  ))}
                </Menu>
              </div>
            </>
            )}
          </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  showUserDropdown: PropTypes.bool,
  profileImageUrl: PropTypes.string,
};

Header.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
  profileImageUrl: '',
};

export default injectIntl(Header);
