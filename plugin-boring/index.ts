import { logger } from '@rsbuild/core';

logger.override({
  log: (message) => {
    console.log(`[log] ${message}`);
  },
  info: (message) => {
    console.log(`[info] ${message}`);
  },
  warn: (message) => {
    console.warn(`[warn] ${message}`);
  },
  start: (message) => {
    console.log(`[start] ${message}`);
  },
  ready: (message) => {
    console.log(`[ready] ${message}`);
  },
  error: (message) => {
    console.error(`[error] ${message}`);
  },
  success: (message) => {
    console.error(`[success] ${message}`);
  },
  debug: (message) => {
    if (process.env.DEBUG) {
      console.log(`[debug] ${message}`);
    }
  },
});
