'use server';

import axios from 'axios';
import validateURL from '../utils/validate-url';

export const fetcher = (url: string) => {
  if (!validateURL(url)) {
    throw new Error('Invalid URL');
  }

  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      if (
        err.response &&
        err.response.status < 500 &&
        err.response.status >= 400
      ) {
        return {
          error: {
            status: err.response.status,
            message: err.response.data.message
          }
        };
      } else {
        return {
          error: {
            status: 500,
            message: 'Internal Server Error'
          }
        };
      }
    });
};
