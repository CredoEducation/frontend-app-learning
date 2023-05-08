import { Modal } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { faAngleRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const formatDate = (dateStr) => {
  const dt = new Date(dateStr);
  const year = dt.getFullYear();
  let month = dt.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = dt.getDate();
  day = day < 10 ? `0${day}` : day;
  let hours = dt.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = dt.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getQuestionItem = (value) => {
  const correctIcon = `${getConfig().LMS_BASE_URL}/static/images/credo/question_correct.png`;
  const incorrectIcon = `${getConfig().LMS_BASE_URL}/static/images/credo/question_incorrect.png`;
  const unansweredIcon = `${getConfig().LMS_BASE_URL}/static/images/credo/question_unanswered.png`;
  let iconWidth = 25;
  let iconHeight = 25;
  let iconSrc = correctIcon;
  if (value.correctness === 'Not Answered') {
    iconSrc = unansweredIcon;
    iconWidth = 24;
    iconHeight = 24;
  } else if (value.correctness === 'Incorrect') {
    iconSrc = incorrectIcon;
  }

  return (
    <div className="seq-grade-details-item-block">
      <table className="seq-grade-details-item-table">
        <tbody>
          <tr>
            <td className="seq-grade-details-item-block-icon"><img
              src={iconSrc}
              alt={value.correctness}
              title={value.correctness}
              width={iconWidth}
              height={iconHeight}
            />
            </td>
            <td className="seq-grade-details-item-block-content">
              <div className="seq-grade-details-item-block-content-header">{value.parent_name} <FontAwesomeIcon icon={faAngleRight} /> {value.display_name}
              </div>
              {value.last_answer_timestamp
                        && <div className="seq-grade-details-item-block-content-text">Time of the last answer: {formatDate(value.last_answer_timestamp)}</div>}
              {value.question_text
                        && <div className="seq-grade-details-item-block-content-text">{value.question_text}</div>}
              {value.answer && (
              <>
                <div className="seq-grade-details-item-block-content-header">Answer</div>
                <div className="seq-grade-details-item-block-content-text">{value.answer}</div>
              </>
              )}
            </td>
            <td className="seq-grade-details-item-block-points">{value.earned}/{value.possible}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const ScoresModal = ({
  onClose, scoresLoadingStatus, data, userEmail, emailSendingStatus, emailSendingError,
  userEmailChangeFn, sendScoresEmailFn,
}) => {
  const assessmentDoneImg = `${getConfig().LMS_BASE_URL}/static/images/credo/assessment_done.png`;
  let sendEmailBtn = 'Email My Results';
  let sendEmailDisabled = false;
  if (emailSendingStatus === 'loading') {
    sendEmailBtn = 'Sending...';
    sendEmailDisabled = true;
  }

  return (
    <Modal
      body={(
        <div className="seq-grade-block" id="seq-grade-block">
          {scoresLoadingStatus === 'loading' && <div>Please wait ...</div>}
          {scoresLoadingStatus !== 'loading' && (
          <div className="seq-main-block">
            <div className="seq-left-panel">
              <div className="seq-lesson-completion">
                <div className="seq-finish-icon">
                  <img src={assessmentDoneImg} className="seq-img-done" alt="Lesson Completion" />
                </div>
                <div className="seq-finish-text">
                  <div className="seq-finish-text-header">LESSON COMPLETION</div>
                  <div className="seq-finish-text-congratulations"><strong>Congratulations, </strong>you
                    have now completed the assessment. You may return to the assessment to answer any
                    un-submitted questions and obtain your score again.
                  </div>
                  <div className="seq-finish-text-congratulations">To email your results to yourself or your
                    instructor, please enter the email address(es) of the recipient(s) in the box below.
                    If there are multiple addresses please separate them with a comma.
                  </div>
                  <div className="seq-email">
                    <div className="email-box">
                      <span className="email-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                      <input
                        type="text"
                        maxLength="255"
                        className="email-assessment"
                        name="email-assessment"
                        value={userEmail}
                        onChange={userEmailChangeFn}
                      />
                    </div>
                    <div className="email-box-button">
                      <button type="button" className="send-email-btn btn btn-pl-primary" disabled={sendEmailDisabled} onClick={sendScoresEmailFn}>{sendEmailBtn}</button>
                    </div>
                  </div>
                  {emailSendingStatus === 'error' && <div className="email-error">{emailSendingError}</div>}
                  {emailSendingStatus === 'success' && <div className="email-success">Email was successfully sent</div>}
                </div>
              </div>
              <div className="seq-grade-comment">
                <div className="seq-grade-description">Some instructors may require this step for you to
                  receive credit for your work. If you are not sure, email your results to yourself, and
                  check with your instructor. Make sure to check your email&apos;s Spam or Junk folder.
                </div>
                <div className="seq-grade-description">Make sure to complete this step before navigating away
                  from the quiz in your browser. If you try to re-open this page, you will not be able to
                  return to this screen.
                </div>
                <div className="seq-grade-description">By providing these email addresses, you are granting
                  Credo permission to share your score results on this assessment with the recipients
                  listed.
                </div>
              </div>
              <div className="seq-grade-details">
                <div className="seq-grade-details-summary">
                  <div className="seq-grade-details-total-score">
                    <div className="seq-grade-details-total-score-num">{data.common.percent_graded}%</div>
                    <div className="seq-grade-details-total-score-text">TOTAL SCORE</div>
                  </div>
                  <div className="seq-grade-details-total-points">
                    <div className="seq-grade-details-total-points-num">{data.common.earned}/{data.common.possible}</div>
                    <div className="seq-grade-details-total-points-text">POINTS</div>
                  </div>
                </div>
                <div className="seq-grade-details-questions">
                  <div className="seq-grade-details-questions-title seq-grade-details-quiz-name">{data.common.quiz_name}</div>
                  {data.common.last_answer_timestamp && (
                  <div
                    className="seq-grade-details-questions-title seq-grade-details-last-answer-timestamp"
                  >Time of the last answer: {formatDate(data.common.last_answer_timestamp)}
                  </div>
                  )}
                  <div className="seq-grade-details-items">
                    {data.items.map(item => <React.Fragment key={item.id}>{getQuestionItem(item)}</React.Fragment>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="seq-right-panel">
              <div className="seq-grade-description seq-grade-description-active">Some instructors may require
                this step for you to receive credit for your work. If you are not sure, email your results to
                yourself, and check with your instructor. Make sure to check your email&apos;s Spam or Junk folder.
              </div>
              <div className="seq-grade-description">Make sure to complete this step before navigating away from
                the quiz in your browser. If you try to re-open this page, you will not be able to return to
                this screen.
              </div>
              <div className="seq-grade-description">By providing these email addresses, you are granting Credo
                permission to share your score results on this assessment with the recipients listed.
              </div>
            </div>
          </div>
          )}
        </div>
          )}
      onClose={onClose}
      open
      title=""
      dialogClassName="modal-scores"
      renderDefaultCloseButton={false}
    />
  );
};

ScoresModal.propTypes = {
  onClose: PropTypes.func,
  scoresLoadingStatus: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  userEmail: PropTypes.string,
  emailSendingStatus: PropTypes.string,
  emailSendingError: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  userEmailChangeFn: PropTypes.func,
  // eslint-disable-next-line react/require-default-props
  sendScoresEmailFn: PropTypes.func,
};

ScoresModal.defaultProps = {
  onClose: undefined,
  scoresLoadingStatus: 'loading',
  emailSendingStatus: 'none',
  emailSendingError: '',
  data: {},
  userEmail: '',
};
