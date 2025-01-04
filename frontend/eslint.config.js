export default {
  root: true,
  ignorePatterns: ['dist'],
  rules: {
    // Menonaktifkan semua aturan ESLint
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  }
}
