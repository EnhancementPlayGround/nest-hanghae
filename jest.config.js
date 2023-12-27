module.exports = {
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    rootDir: "./",
    testRegex: ".*\\.(spec)\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
      "src/**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node"
  };