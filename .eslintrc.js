// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@edx/frontend-build');

const config = createConfig('eslint', {
  rules: {
    // TODO: all these rules should be renabled/addressed. temporarily turned off to unblock a release.
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-no-target-blank': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'no-restricted-exports': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/no-unknown-property': 'off',
    'func-names': 'off',
    'no-script-url': 'off',
  },
});

module.exports = config;
