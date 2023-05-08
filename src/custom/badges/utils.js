import { useState, useEffect } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export const useBadgesModalProps = () => {
  const [badgesModalIsOpen, setBadgesModalIsOpen] = useState(false);
  const [badgeLoadingStatus, setBadgeLoadingStatus] = useState('loading');
  const [badgeData, setBadgeData] = useState({});

  const fetchBadgeData = async (cId, sId) => {
    const url = new URL(`${getConfig().LMS_BASE_URL}/badges/issue-badge/${cId}/${sId}/`);
    const { data } = await getAuthenticatedHttpClient().post(url.href, {});
    if (!data.error) {
      setBadgeData(data.data);
      setBadgeLoadingStatus('success');
    } else {
      setBadgeData({ error: data.error });
      setBadgeLoadingStatus('error');
    }
  };

  const openBadgesModalListener = (msg) => {
    if (msg.data === 'badgeReady') {
      setBadgesModalIsOpen(true);
      // example: https://lms.host/course/<courseId>/<seqId>/...
      const locPath = window.location.pathname.split('/');
      fetchBadgeData(locPath[2], locPath[3]);
    }
  };

  const closeBadgesModalFn = () => {
    setBadgesModalIsOpen(false);
  };

  /* Add listener on component mount */
  useEffect(() => {
    window.addEventListener('message', openBadgesModalListener, false);
  }, []);

  /* Reset data on component unmount */
  useEffect(
    () => () => {
      window.removeEventListener('message', openBadgesModalListener, false);
    },
    [],
  );

  return {
    badgesModalIsOpen,
    closeBadgesModalFn,
    badgeLoadingStatus,
    badgeData,
  };
};
