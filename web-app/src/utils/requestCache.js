// Simple request cache to prevent duplicate requests
class RequestCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  // Generate cache key from URL and params
  generateKey(url, params = {}) {
    return `${url}:${JSON.stringify(params)}`;
  }

  // Get cached data if available and not expired
  get(url, params = {}, maxAge = 5000) {
    const key = this.generateKey(url, params);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data;
    }

    return null;
  }

  // Set cache data
  set(url, params = {}, data) {
    const key = this.generateKey(url, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Get pending request promise if exists
  getPending(url, params = {}) {
    const key = this.generateKey(url, params);
    return this.pendingRequests.get(key);
  }

  // Set pending request promise
  setPending(url, params = {}, promise) {
    const key = this.generateKey(url, params);
    this.pendingRequests.set(key, promise);

    // Clean up after request completes
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }

  // Clear cache
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // Clear specific cache entry
  clearKey(url, params = {}) {
    const key = this.generateKey(url, params);
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }
}

export const requestCache = new RequestCache();

// Helper function to make cached requests
export const cachedRequest = async (requestFn, url, params = {}, maxAge = 5000) => {
  // Check cache first
  const cached = requestCache.get(url, params, maxAge);
  if (cached) {
    return cached;
  }

  // Check if request is already pending
  const pending = requestCache.getPending(url, params);
  if (pending) {
    return pending;
  }

  // Make new request
  const promise = requestFn();
  requestCache.setPending(url, params, promise);

  try {
    const data = await promise;
    requestCache.set(url, params, data);
    return data;
  } catch (error) {
    throw error;
  }
};
