/**
 * Konfiguracja Jest dla testów jednostkowych Simplex Atanor
 * 
 * Ten plik konfiguracyjny dostosowuje środowisko testowe Jest
 * do specyficznych wymagań projektu Simplex Atanor.
 */

module.exports = {
  // Ścieżka bazowa dla modułów
  moduleDirectoryName: ['node_modules', 'src'],
  
  // Wzorce plików testowych
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Środowisko testowe
  testEnvironment: 'jsdom',
  
  // Transformacje plików
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Mapowanie modułów
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Konfiguracja raportowania
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // Konfiguracja pokrycia kodu
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!**/node_modules/**'
  ],
  
  // Minimalne pokrycie kodu
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70
    }
  },
  
  // Opcje wyświetlania
  verbose: true,
  
  // Konfiguracja setupFiles
  setupFiles: [
    '<rootDir>/tests/jest-setup.js'
  ]
};
