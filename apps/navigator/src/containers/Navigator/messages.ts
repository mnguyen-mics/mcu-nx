import { defineMessages } from 'react-intl';

export default defineMessages({
  adBlock: {
    id: 'errors.adBlock',
    defaultMessage:
      'It appears you have an adblocker activated, in order to access mediarithmics navigator you need to disable your adblocker. Please contact the support if the issue persists afterwards',
  },
  generic: {
    id: 'errors.generic',
    defaultMessage: 'Oops, please try to reload the page or contact your support',
  },
  notFound: {
    id: 'errors.notFound',
    defaultMessage: 'Oops... Looks like there is nothing over here',
  },
  redirectHome: {
    id: 'errors.notFound.redirectHome',
    defaultMessage: 'Get back on track',
  },
  lostParrot: {
    id: 'errors.notFound.lostParrot',
    defaultMessage: 'Oh! You’ve found our lost parrot ',
  },
  noAccess: {
    id: 'errors.noAccess',
    defaultMessage:
      "You currently don't have the right to view this page, if you think this is a mistake, please contact your administrator.",
  },
});
