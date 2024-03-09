module.exports = {
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "!**/__tests__/helpers/authHelper.ts", // Exclude the authSin file
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
