import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  // Set options.method to 'GET' if there is no method
  options.method = options.method || 'GET';
  // Set options.headers to an empty object if there are no headers
  options.headers = options.headers || {};

  // If the options.method is not 'GET', then set the "Content-Type" header to
  // "application/json", and set the "CSRF-TOKEN" header to the value of the
  // "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['CSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
  }

  // Call the default window's fetch with the url and the options passed in
  const res = await window.fetch(url, options);

  // If the response status code is 400 or above, then throw an error with the
  // error being the response
  if (res.status >= 400) {
    // Try to parse the error response as JSON
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      // If parsing fails, fall back to a generic error message
      errorData = { message: "An unexpected error occurred" };
    }
    const error = new Error(errorData.message || "Request failed");
    error.status = res.status; // Include the status for debugging purposes
    error.data = errorData;   // Include the parsed error data
    throw error;
  }

  // If the response status code is under 400, then return the response to the
  // next promise chain
  return res;
}

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}