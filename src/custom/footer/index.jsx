import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform/config';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  render() {
    const {
      logo,
    } = this.props;
    const { config } = this.context;
    const footerLinksRaw = getConfig().FOOTER_LINKS;
    const siteName = getConfig().SITE_NAME;
    const foooterLinks = footerLinksRaw ? JSON.parse(footerLinksRaw) : null;

    return (
      <footer
        role="contentinfo"
        className="footer d-flex border-top footer-block"
      >
        <div className="colophon">
          <nav className="nav-colophon">
            <ol>
              {foooterLinks && foooterLinks.map(link => <li key={link.url}><a href={link.url} target="_blank">{link.title}</a></li>)}
            </ol>
          </nav>

          <div className="wrapper-logo">
            <p>
              <a
                className="d-block"
                href={config.LMS_BASE_URL}
              >
                <img
                  alt={siteName}
                  style={{ maxHeight: 45 }}
                  src={logo || config.LOGO_URL}
                />
              </a>
            </p>
          </div>
          <p className="copyright">&#169; {siteName}. All rights reserved except where noted. edX, Open edX and their respective logos are registered trademarks of edX Inc.</p>
        </div>
      </footer>
    );
  }
}

SiteFooter.contextType = AppContext;

SiteFooter.propTypes = {
  logo: PropTypes.string,
};

SiteFooter.defaultProps = {
  logo: undefined,
};

export default injectIntl(SiteFooter);
export { EVENT_NAMES };
