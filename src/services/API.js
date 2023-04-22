import axios from 'axios';

export const baseURL = process.env.REACT_APP_API

export const API = axios.create({
  baseURL: `${baseURL}/adminAPI/`,
});

export const setAuthorizationToken = token => {

  if (token) {
    API.defaults.headers.common['Authorization'] = token;
  }
  else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export const removeAuthorizationToken = () => {

  delete axios.defaults.headers.common['Authorization'];
};

export const handleRequestError = error => {
  const genericError = 'Generic error happened';
  if(!error) return genericError;

  if(error.response && error.response.data) {
    return error.response.data.errorMessage || error.message || genericError;
  }

  if(error.message) return error.message;

  return genericError;
};

export const extractDataObject = (data, defaultValue) => data && data.data && data.data.data ? data.data.data : defaultValue || {};
