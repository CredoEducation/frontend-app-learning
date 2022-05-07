import { Modal } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

export function BadgesModal({ onClose, badgeLoadingStatus, data }) {
  return (
    <Modal
      body={(
        <>
          <div className="badge-block" id="badge-block">
            <div className="badge-main-block">
              {badgeLoadingStatus === 'loading' && <div className="badge-loading">Please wait while we grab your badge!</div>}
              {badgeLoadingStatus === 'error' && <div className="badge-loading">Can&apos;t issue badge: {data.error}</div>}
              {badgeLoadingStatus === 'success' && (
              <div className="badge-info-block">
                <div className="badge-issuer-logo"><img src={data.platform_logo_url} style={{ height: 40 }} /></div>
                <div className="badge-congrat">Congratulations, you earned a badge!</div>
                <div className="badge-img"><img src={data.badge_image_url} /></div>
                <div className="badge-title">{data.badge_title}</div>
                <div className="badge-description">{data.badge_description}</div>
                <hr />
                <div className="badge-issuer-info">
                  <div className="badge-issued-by-txt">Issued by:</div>
                  <div className="badge-issued-by-logo"><a
                    href={data.badgr_issuer_url}
                    target="_blank"
                    className="badge-issued-by-link"
                  ><img src={data.badgr_issuer_image} /></a>
                  </div>
                </div>
                <div className="badge-buttons">
                  <a className="btn btn-primary badge-go-to-badgr" href={data.badgr_login_page} target="_blank">Go To Badgr
                    Account
                  </a>
                </div>
                <div className="badge-notification">
                  <a href={data.badge_external_url} className="badge-notification-link" target="_blank">View your badge on Badgr for sharing options.</a>
                </div>
              </div>
              )}
            </div>
          </div>
        </>
          )}
      onClose={onClose}
      open
      title=""
      dialogClassName="modal-badges"
      renderDefaultCloseButton={false}
    />
  );
}

BadgesModal.propTypes = {
  onClose: PropTypes.func,
  badgeLoadingStatus: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
};

BadgesModal.defaultProps = {
  onClose: undefined,
  badgeLoadingStatus: 'loading',
  data: {},
};
