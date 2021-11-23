import express from 'express';
import childProcess from 'child_process';

import expressLoader from './loaders/express';

let app = express();

expressLoader({ app });

if (process.env.NODE_ENV === 'production') {
  childProcess.exec('gcloud auth activate-service-account --key-file $GOOGLE_APPLICATION_CREDENTIALS');
}

export default app;
