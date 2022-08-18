import { useState, useEffect } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export const useBadgesModalProps = (courseId, sequenceId) => {
  const [badgesModalIsOpen, setBadgesModalIsOpen] = useState(false);
  const [badgeLoadingStatus, setBadgeLoadingStatus] = useState('loading');
  const [badgeData, setBadgeData] = useState({});

  const fetchBadgeData = async () => {
    const url = new URL(`${getConfig().LMS_BASE_URL}/badges/issue-badge/${courseId}/${sequenceId}/`);
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
      fetchBadgeData();
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
