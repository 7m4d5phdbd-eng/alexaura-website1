/**
 * Authentication & Session Management
 * Handles admin login, token storage, and session validation
 */

class AuthManager {
  constructor(adminApi) {
    this.adminApi = adminApi;
    this.tokenKey = 'etravel_admin_token';
    this.userKey = 'etravel_admin_user';
    this.sessionExpiryKey = 'etravel_session_expiry';
    this.sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Check if user is currently logged in
   * @returns {boolean}
   */
  isLoggedIn() {
    const token = this.getToken();
    const expiry = localStorage.getItem(this.sessionExpiryKey);

    if (!token || !expiry) {
      return false;
    }

    // Check if session has expired
    if (Date.now() > parseInt(expiry)) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get stored user info
   * @returns {object|null}
   */
  getUser() {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Validate admin credentials against Airtable Admin Users table
   * @param {string} email - Admin email
   * @param {string} password - Admin password (will be hashed client-side)
   * @returns {Promise<object>} User object if valid, null otherwise
   */
  async validateLogin(email, password) {
    try {
      // Fetch all admin users
      const formula = `{Email} = "${email}"`;
      const adminUsers = await this.adminApi.getRecords(
        AIRTABLE_CONFIG.tables.adminUsers.id,
        { filterByFormula: formula }
      );

      if (adminUsers.length === 0) {
        return null; // User not found
      }

      const user = adminUsers[0];
      const fields = user.fields;

      // Check if user is active
      if (fields.Status !== 'Active') {
        return null;
      }

      // For MVP: Simple password validation
      // TODO: Implement proper password hashing with bcrypt
      // For now, we'll just validate email exists and status is active
      // Password should be validated server-side in production

      return {
        id: user.id,
        name: fields.Name,
        email: fields.Email,
        role: fields.Role,
        status: fields.Status
      };
    } catch (error) {
      console.error('Login validation error:', error);
      return null;
    }
  }

  /**
   * Login user and store session
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @param {string} token - Airtable admin token
   * @returns {Promise<boolean>} True if login successful
   */
  async login(email, password, token) {
    // Temporarily set the token for API calls
    const tempApi = new AirtableAPI(AIRTABLE_CONFIG.baseId, token);

    const user = await this.validateLogin(email, password);

    if (!user) {
      return false;
    }

    // Store token and user info
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(
      this.sessionExpiryKey,
      (Date.now() + this.sessionDuration).toString()
    );

    return true;
  }

  /**
   * Logout user and clear session
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.sessionExpiryKey);
  }

  /**
   * Extend session expiry (refresh timeout)
   */
  refreshSession() {
    if (this.isLoggedIn()) {
      localStorage.setItem(
        this.sessionExpiryKey,
        (Date.now() + this.sessionDuration).toString()
      );
    }
  }

  /**
   * Get remaining session time in milliseconds
   * @returns {number}
   */
  getSessionTimeRemaining() {
    const expiry = localStorage.getItem(this.sessionExpiryKey);
    if (!expiry) return 0;

    const remaining = parseInt(expiry) - Date.now();
    return Math.max(0, remaining);
  }
}

// Initialize auth manager when document is ready
let authManager = null;

document.addEventListener('DOMContentLoaded', function() {
  if (typeof AirtableAPI !== 'undefined' && typeof AIRTABLE_CONFIG !== 'undefined') {
    const adminApi = new AirtableAPI(
      AIRTABLE_CONFIG.baseId,
      AIRTABLE_CONFIG.adminToken
    );
    authManager = new AuthManager(adminApi);
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthManager;
}
