import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';

import { ALERT_TYPES, AlertList } from '../generic/user-messages';
import Alert from '../generic/user-messages/Alert';
import MasqueradeWidget from './masquerade-widget';
import { useAccessExpirationMasqueradeBanner } from '../alerts/access-expiration-alert';
import { useCourseStartMasqueradeBanner } from '../alerts/course-start-alert';

function getInsightsUrl(courseId) {
  const urlBase = getConfig().INSIGHTS_BASE_URL;
  let urlFull;
  if (urlBase) {
    urlFull = `${urlBase}/courses`;
    // This shouldn't actually be missing, at present,
    // but we're providing a reasonable fallback,
    // in case of either error or extension.
    if (courseId) {
      urlFull += `/${courseId}`;
    }
  }
  return urlFull;
}

function getStudioUrl(courseId, unitId) {
  const urlBase = getConfig().STUDIO_BASE_URL;
  let urlFull;
  if (urlBase) {
    if (unitId) {
      urlFull = `${urlBase}/container/${unitId}`;
    } else if (courseId) {
      urlFull = `${urlBase}/course/${courseId}`;
    }
  }
  return urlFull;
}

function getLegacyWebUrl(canViewLegacyCourseware, courseId, unitId) {
  if (!canViewLegacyCourseware || !unitId) {
    return undefined;
  }

  return `${getConfig().LMS_BASE_URL}/courses/${courseId}/jump_to/${unitId}?experience=legacy`;
}

function getHelpUrl() {
  const url = getConfig().NW_HELP_URL;
  if (url) {
    return url;
  }
  return false;
}

export default function InstructorToolbar(props) {
  // This didMount logic became necessary once we had a page that does a redirect on a quick exit.
  // As a result, it unmounts the InstructorToolbar (which will be remounted by the new component),
  // but the InstructorToolbar's MasqueradeWidget has an outgoing request. Since it is unmounted
  // during that time, it raises an error about a potential memory leak. By stopping the render
  // when the InstructorToolbar is unmounted, we avoid the memory leak.
  // NOTE: This was originally added because of the CourseExit page redirect. Once that page stops
  //   doing a redirect because a CourseExit experience exists for all learners, this could be removed
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
    // Returning this function here will run setDidMount(false) when this component is unmounted
    return () => setDidMount(false);
  });

  const {
    courseId,
    unitId,
    canViewLegacyCourseware,
    showNwHelp,
    studioStaffAccess,
    tab,
  } = props;

  const urlInsights = getInsightsUrl(courseId);
  const urlLegacy = getLegacyWebUrl(canViewLegacyCourseware, courseId, unitId);
  const urlStudio = getStudioUrl(courseId, unitId);
  const nwHelpUrl = getHelpUrl();
  const [masqueradeErrorMessage, showMasqueradeError] = useState(null);

  const accessExpirationMasqueradeBanner = useAccessExpirationMasqueradeBanner(courseId, tab);
  const courseStartDateMasqueradeBanner = useCourseStartMasqueradeBanner(courseId, tab);

  return (!didMount ? null : (
    <div data-testid="instructor-toolbar">
      <div className="bg-primary text-white">
        <div className="container-xl py-3 d-md-flex justify-content-end align-items-start">
          <div className="align-items-center flex-grow-1 d-md-flex mx-1 my-1">
            <MasqueradeWidget courseId={courseId} onError={showMasqueradeError} />
          </div>
          <>
            {urlLegacy && (
            <span className="mx-1 my-1">
              <a className="btn btn-inverse-outline-primary" href={urlLegacy}>Legacy experience</a>
            </span>
            )}
            {(studioStaffAccess && urlStudio) && (
            <span className="mx-1 my-1">
              <a className="btn btn-inverse-outline-primary" href={urlStudio}>View in Studio</a>
            </span>
            )}
            {urlInsights && (
            <span className="mx-1 my-1">
              <a className="btn btn-inverse-outline-primary" href={urlInsights}>Insights</a>
            </span>
            )}
            {(showNwHelp && nwHelpUrl) && (
            <span className="mx-1 my-1">
              <a className="btn btn-inverse-outline-primary" href={nwHelpUrl} target="_blank">Help Center</a>
            </span>
            )}
          </>
        </div>
      </div>
      {masqueradeErrorMessage && (
        <div className="container-xl mt-3">
          <Alert
            type={ALERT_TYPES.ERROR}
            dismissible={false}
          >
            {masqueradeErrorMessage}
          </Alert>
        </div>
      )}
      <AlertList
        topic="instructor-toolbar-alerts"
        customAlerts={{
          ...accessExpirationMasqueradeBanner,
          ...courseStartDateMasqueradeBanner,
        }}
      />
    </div>
  ));
}

InstructorToolbar.propTypes = {
  courseId: PropTypes.string,
  unitId: PropTypes.string,
  canViewLegacyCourseware: PropTypes.bool,
  showNwHelp: PropTypes.bool,
  studioStaffAccess: PropTypes.bool,
  tab: PropTypes.string,
};

InstructorToolbar.defaultProps = {
  courseId: undefined,
  unitId: undefined,
  canViewLegacyCourseware: undefined,
  showNwHelp: true,
  studioStaffAccess: true,
  tab: '',
};
