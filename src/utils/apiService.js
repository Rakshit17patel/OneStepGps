class ApiService {
  // Base URL for your API
  static baseURL = '';

  // Helper method for making HTTP requests
  static async request(url, method = 'GET', body = null, headers = {}) {
    // Add default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const finalHeaders = {...defaultHeaders, ...headers};

    // If the method is POST, PUT, or PATCH, we need to add the body
    const options = {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(`${ApiService.baseURL}${url}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  static async get(url, headers = {}) {
    return ApiService.request(url, 'GET', null, headers);
  }

  // POST request
  static async post(url, body, headers = {}) {
    return ApiService.request(url, 'POST', body, headers);
  }

  // PUT request
  static async put(url, body, headers = {}) {
    return ApiService.request(url, 'PUT', body, headers);
  }

  // DELETE request
  static async delete(url, headers = {}) {
    return ApiService.request(url, 'DELETE', null, headers);
  }
}

export default ApiService;
