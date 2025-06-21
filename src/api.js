import config from './config.json';

export const getApiBaseUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost') {
    return config.apiBaseUrls.local;
  }
  if (host.startsWith('stage-worknest')) {
    return config.apiBaseUrls.staging;
  }
  return config.apiBaseUrls.production;
};
