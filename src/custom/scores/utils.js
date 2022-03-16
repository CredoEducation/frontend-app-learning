import { useState, useEffect, useCallback } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const useScoresModalProps = (courseId, sequenceId, sequence) => {
  const [scoresPanelDisplay, setScoresPanelDisplay] = useState(false);
  const [scoresModalIsOpen, setScoresModalIsOpen] = useState(false);
  const [scoresLoadingStatus, setScoresLoadingStatus] = useState('loading');
  const [emailSendingStatus, setEmailSendingStatus] = useState('none');
  const [emailSendingError, setEmailSendingError] = useState('');
  const [scoresData, setScoresData] = useState({});
  const [userEmail, setUserEmail] = useState('');

  const fetchScoresData = async () => {
    const url = new URL(`${getConfig().LMS_BASE_URL}/courses/${courseId}/block_student_progress/${sequenceId}/`);
    const { data } = await getAuthenticatedHttpClient().post(url.href, {});
    if (!data.error) {
      setScoresData(data);
      setScoresLoadingStatus('success');
      if (data.user.email) {
        setUserEmail(data.user.email);
      }
    } else {
      setScoresData({ error: data.error });
      setScoresLoadingStatus('error');
    }
  };

  const sendEmailWithScores = async (emailsArr) => {
    const dtOffset = new Date().getTimezoneOffset();
    const url = new URL(`${getConfig().LMS_BASE_URL}/courses/${courseId}/email_student_progress/${sequenceId}/?data_type=json`);
    const { data } = await getAuthenticatedHttpClient().post(url.href, {
      emails: emailsArr.join(','),
      timezone_offset: (-1) * dtOffset,
    });
    if (data.success) {
      setEmailSendingStatus('success');
    } else {
      setEmailSendingStatus('error');
      setEmailSendingError(data.error);
    }
  };

  const checkScoresPanelDisplay = async () => {
    const url = new URL(`${getConfig().LMS_BASE_URL}/courses/${courseId}/block_student_progress/${sequenceId}/`);
    const { data } = await getAuthenticatedHttpClient().post(url.href, {});
    let showPanel = false;
    if (!data.error) {
      if (data.items.length > 0) {
        data.items.forEach(value => {
          if (value.correctness !== 'Not Answered') {
            showPanel = true;
          }
        });

        if (showPanel) {
          setScoresPanelDisplay(true);
        }
      }
    }
  };

  const openScoresModalListener = useCallback((msg) => {
    if (sequence && sequence.showSummaryInfoAfterQuiz && msg.data === 'problemAnswered') {
      setScoresPanelDisplay(true);
    }
  }, [sequence]);

  const closeScoresModalFn = () => {
    setScoresModalIsOpen(false);
  };

  const displayScoresModalWindowFn = () => {
    setScoresModalIsOpen(true);
    fetchScoresData();
  };

  useEffect(() => {
    if (sequence && sequence.showSummaryInfoAfterQuiz) {
      checkScoresPanelDisplay();
    }
  }, [sequence]);

  /* Add listener on component mount */
  useEffect(() => {
    window.addEventListener('message', openScoresModalListener, false);
  }, []);

  /* Reset data on component unmount */
  useEffect(
    () => () => {
      window.removeEventListener('message', openScoresModalListener, false);
    },
    [],
  );

  return {
    scoresPanelDisplay,
    displayScoresModalWindowFn,
    scoresModalIsOpen,
    closeScoresModalFn,
    scoresLoadingStatus,
    scoresData,
    userEmail,
    emailSendingStatus,
    emailSendingError,
    userEmailChangeFn: (event) => { setUserEmail(event.target.value); },
    sendScoresEmailFn: () => {
      const arr = userEmail.split(',');
      const emailsArr = [];
      let isError = false;
      setEmailSendingError('');
      setEmailSendingStatus('');
      arr.forEach(item => {
        const tmp = item.trim();
        if (tmp !== '') {
          if (!validateEmail(tmp)) {
            setEmailSendingError(`Invalid email: ${tmp}`);
            setEmailSendingStatus('error');
            isError = true;
          } else {
            emailsArr.push(tmp);
          }
        }
      });
      if (!isError) {
        if (emailsArr.length > 0) {
          setEmailSendingStatus('loading');
          sendEmailWithScores(emailsArr);
        } else {
          setEmailSendingError('Please enter at least one email');
          setEmailSendingStatus('error');
        }
      }
    },
  };
};
