import { useEffect } from 'react';
import { getConfig } from '@edx/frontend-platform';

function PageNotFound() {
  useEffect(() => {
    window.location.href = getConfig().LMS_BASE_URL + window.location.pathname + window.location.search;
  }, []);

  return (
    <>
      Redirect to {getConfig().LMS_BASE_URL}
    </>
  );
}

export default PageNotFound;
