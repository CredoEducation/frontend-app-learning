const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
    rules: {
      'import/named': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      'react/jsx-no-target-blank': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
    },
});
