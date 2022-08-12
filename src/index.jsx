import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
  mergeConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage, PageRoute } from '@edx/frontend-platform/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';

import { messages as footerMessages } from '@edx/frontend-component-footer';
import { messages as headerMessages } from '@edx/frontend-component-header';

import appMessages from './i18n';
import { UserMessagesProvider } from './generic/user-messages';

import './index.scss';
import OutlineTab from './course-home/outline-tab';
import { CourseExit } from './courseware/course/course-exit';
import CoursewareContainer from './courseware';
import CoursewareRedirectLandingPage from './courseware/CoursewareRedirectLandingPage';
import DatesTab from './course-home/dates-tab';
import PageNotFound from './custom/page-not-found';
import GoalUnsubscribe from './course-home/goal-unsubscribe';
import ProgressTab from './course-home/progress-tab/ProgressTab';
import { TabContainer } from './tab-page';

import { fetchDatesTab, fetchOutlineTab, fetchProgressTab } from './course-home/data';
import { fetchCourse } from './courseware/data';
import initializeStore from './store';
import NoticesProvider from './generic/notices';
import PathFixesProvider from './generic/path-fixes';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={initializeStore()}>
      <PathFixesProvider>
        <NoticesProvider>
          <UserMessagesProvider>
            <Switch>
              <PageRoute exact path="/goal-unsubscribe/:token" component={GoalUnsubscribe} />
              <PageRoute path="/redirect" component={CoursewareRedirectLandingPage} />
              <PageRoute path="/course/:courseId/home">
                <TabContainer tab="outline" fetch={fetchOutlineTab} slice="courseHome">
                  <OutlineTab />
                </TabContainer>
              </PageRoute>
              <PageRoute path="/course/:courseId/dates">
                <TabContainer tab="dates" fetch={fetchDatesTab} slice="courseHome">
                  <DatesTab />
                </TabContainer>
              </PageRoute>
              <PageRoute
                path={[
                  '/course/:courseId/progress/:targetUserId/',
                  '/course/:courseId/progress',
                ]}
                render={({ match }) => (
                  <TabContainer
                    tab="progress"
                    fetch={(courseId) => fetchProgressTab(courseId, match.params.targetUserId)}
                    slice="courseHome"
                  >
                    <ProgressTab />
                  </TabContainer>
                )}
              />
              <PageRoute path="/course/:courseId/course-end">
                <TabContainer tab="courseware" fetch={fetchCourse} slice="courseware">
                  <CourseExit />
                </TabContainer>
              </PageRoute>
              <PageRoute
                path={[
                  '/course/:courseId/:sequenceId/:unitId',
                  '/course/:courseId/:sequenceId',
                  '/course/:courseId',
                ]}
                component={CoursewareContainer}
              />
              <PageRoute component={PageNotFound} />
            </Switch>
          </UserMessagesProvider>
        </NoticesProvider>
      </PathFixesProvider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  console.log('Error: ', error);
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        CONTACT_URL: process.env.CONTACT_URL || null,
        CREDENTIALS_BASE_URL: process.env.CREDENTIALS_BASE_URL || null,
        CREDIT_HELP_LINK_URL: process.env.CREDIT_HELP_LINK_URL || null,
        DISCUSSIONS_MFE_BASE_URL: process.env.DISCUSSIONS_MFE_BASE_URL || null,
        ENTERPRISE_LEARNER_PORTAL_HOSTNAME: process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME || null,
        ENABLE_JUMPNAV: process.env.ENABLE_JUMPNAV || null,
        ENABLE_NOTICES: process.env.ENABLE_NOTICES || null,
        INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
        SEARCH_CATALOG_URL: process.env.SEARCH_CATALOG_URL || null,
        SOCIAL_UTM_MILESTONE_CAMPAIGN: process.env.SOCIAL_UTM_MILESTONE_CAMPAIGN || null,
        STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
        SUPPORT_URL: process.env.SUPPORT_URL || null,
        SUPPORT_URL_CALCULATOR_MATH: process.env.SUPPORT_URL_CALCULATOR_MATH || null,
        SUPPORT_URL_ID_VERIFICATION: process.env.SUPPORT_URL_ID_VERIFICATION || null,
        SUPPORT_URL_VERIFIED_CERTIFICATE: process.env.SUPPORT_URL_VERIFIED_CERTIFICATE || null,
        TERMS_OF_SERVICE_URL: process.env.TERMS_OF_SERVICE_URL || null,
        TWITTER_HASHTAG: process.env.TWITTER_HASHTAG || null,
        TWITTER_URL: process.env.TWITTER_URL || null,
        LEGACY_THEME_NAME: process.env.LEGACY_THEME_NAME || null,
        FOOTER_LINKS: process.env.FOOTER_LINKS || null,
        NW_HELP_URL: process.env.NW_HELP_URL || null,
        DISABLE_REGISTER: process.env.DISABLE_REGISTER || false,
      }, 'LearnerAppConfig');
      const { hostname } = global.location;
      if (hostname.indexOf('credocourseware') !== -1) {
        mergeConfig({
          BASE_URL: process.env.CREDO_BASE_URL || process.env.BASE_URL || null,
          CONTACT_URL: process.env.CREDO_CONTACT_URL || process.env.CONTACT_URL || null,
          FAVICON_URL: process.env.CREDO_FAVICON_URL || process.env.FAVICON_URL || null,
          // eslint-disable-next-line max-len
          LMS_BASE_URL: hostname.indexOf('frame') !== -1 ? process.env.CREDO_FRAME_LMS_BASE_URL : (process.env.CREDO_LMS_BASE_URL || process.env.LMS_BASE_URL),
          LOGIN_URL: process.env.CREDO_LOGIN_URL || process.env.LOGIN_URL || null,
          LOGOUT_URL: process.env.CREDO_LOGOUT_URL || process.env.LOGOUT_URL || null,
          LOGO_URL: process.env.CREDO_LOGO_URL || process.env.LOGO_URL || null,
          // eslint-disable-next-line max-len
          MARKETING_SITE_BASE_URL: process.env.CREDO_MARKETING_SITE_BASE_URL || process.env.MARKETING_SITE_BASE_URL || null,
          // eslint-disable-next-line max-len
          REFRESH_ACCESS_TOKEN_ENDPOINT: process.env.CREDO_REFRESH_ACCESS_TOKEN_ENDPOINT || process.env.REFRESH_ACCESS_TOKEN_ENDPOINT || null,
          SITE_NAME: process.env.CREDO_SITE_NAME || process.env.SITE_NAME || null,
          STUDIO_BASE_URL: process.env.CREDO_STUDIO_BASE_URL || process.env.STUDIO_BASE_URL || null,
          SESSION_COOKIE_DOMAIN: process.env.CREDO_SESSION_COOKIE_DOMAIN || process.env.SESSION_COOKIE_DOMAIN || null,
          FOOTER_LINKS: process.env.CREDO_FOOTER_LINKS || process.env.FOOTER_LINKS || null,
        }, 'LearnerAppConfig');
      }
    },
  },
  messages: [
    appMessages,
    footerMessages,
    headerMessages,
  ],
});
