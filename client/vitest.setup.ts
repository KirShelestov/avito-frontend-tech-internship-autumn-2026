import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import './src/shared/test/polyfills';
import './src/shared/i18n';

afterEach(() => {
  cleanup();
});
