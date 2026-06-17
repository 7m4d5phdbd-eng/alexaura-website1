/**
 * Admin Dashboard Logic
 * Handles all CRUD operations and dashboard functionality
 */

class DashboardManager {
  constructor(baseId, token) {
    this.api = new AirtableAPI(baseId, token);
    this.config = AIRTABLE_CONFIG;
  }

  // ==================== CLIENTS ====================

  async getClients(options = {}) {
    return await this.api.getRecords(this.config.tables.clients.id, options);
  }

  async createClient(fields) {
    return await this.api.createRecord(this.config.tables.clients.id, fields);
  }

  async updateClient(clientId, fields) {
    return await this.api.updateRecord(this.config.tables.clients.id, clientId, fields);
  }

  async deleteClient(clientId) {
    return await this.api.deleteRecord(this.config.tables.clients.id, clientId);
  }

  // ==================== BOOKINGS ====================

  async getBookings(options = {}) {
    return await this.api.getRecords(this.config.tables.bookings.id, options);
  }

  async createBooking(fields) {
    return await this.api.createRecord(this.config.tables.bookings.id, fields);
  }

  async updateBooking(bookingId, fields) {
    return await this.api.updateRecord(this.config.tables.bookings.id, bookingId, fields);
  }

  async deleteBooking(bookingId) {
    return await this.api.deleteRecord(this.config.tables.bookings.id, bookingId);
  }

  // ==================== PACKAGES ====================

  async getPackages(options = {}) {
    return await this.api.getRecords(this.config.tables.packages.id, options);
  }

  async createPackage(fields) {
    return await this.api.createRecord(this.config.tables.packages.id, fields);
  }

  async updatePackage(packageId, fields) {
    return await this.api.updateRecord(this.config.tables.packages.id, packageId, fields);
  }

  async deletePackage(packageId) {
    return await this.api.deleteRecord(this.config.tables.packages.id, packageId);
  }

  // ==================== DESTINATIONS ====================

  async getDestinations(options = {}) {
    return await this.api.getRecords(this.config.tables.destinations.id, options);
  }

  async createDestination(fields) {
    return await this.api.createRecord(this.config.tables.destinations.id, fields);
  }

  async updateDestination(destinationId, fields) {
    return await this.api.updateRecord(this.config.tables.destinations.id, destinationId, fields);
  }

  async deleteDestination(destinationId) {
    return await this.api.deleteRecord(this.config.tables.destinations.id, destinationId);
  }

  // ==================== PAYMENTS ====================

  async getPayments(options = {}) {
    return await this.api.getRecords(this.config.tables.payments.id, options);
  }

  async createPayment(fields) {
    return await this.api.createRecord(this.config.tables.payments.id, fields);
  }

  async updatePayment(paymentId, fields) {
    return await this.api.updateRecord(this.config.tables.payments.id, paymentId, fields);
  }

  async deletePayment(paymentId) {
    return await this.api.deleteRecord(this.config.tables.payments.id, paymentId);
  }

  // ==================== SERVICES ====================

  async getServices(options = {}) {
    return await this.api.getRecords(this.config.tables.services.id, options);
  }

  async createService(fields) {
    return await this.api.createRecord(this.config.tables.services.id, fields);
  }

  async updateService(serviceId, fields) {
    return await this.api.updateRecord(this.config.tables.services.id, serviceId, fields);
  }

  async deleteService(serviceId) {
    return await this.api.deleteRecord(this.config.tables.services.id, serviceId);
  }

  // ==================== ANALYTICS ====================

  async getDashboardStats() {
    try {
      const bookings = await this.getBookings();
      const payments = await this.getPayments();
      const clients = await this.getClients();

      const totalBookings = bookings.length;
      const totalRevenue = payments.reduce((sum, p) => sum + (p.fields.Amount || 0), 0);
      const totalClients = clients.length;
      const pendingPayments = payments.filter(p => p.fields.Status === 'Pending').length;

      return {
        totalBookings,
        totalRevenue,
        totalClients,
        pendingPayments,
        conversionRate: clients.length > 0 ? ((totalBookings / clients.length) * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  }

  async getBookingsByStatus() {
    try {
      const bookings = await this.getBookings();
      const statusCounts = {};

      bookings.forEach(b => {
        const status = b.fields.Status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return statusCounts;
    } catch (error) {
      console.error('Error fetching booking status stats:', error);
      return null;
    }
  }

  async getRevenueByDestination() {
    try {
      const bookings = await this.getBookings();
      const revenuByDest = {};

      bookings.forEach(b => {
        const dest = b.fields.Destination || 'Unknown';
        const amount = b.fields['Total Cost'] || 0;
        revenuByDest[dest] = (revenuByDest[dest] || 0) + amount;
      });

      return revenuByDest;
    } catch (error) {
      console.error('Error fetching revenue by destination:', error);
      return null;
    }
  }
}

// Initialize dashboard on document ready
let dashboardManager = null;

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  if (!authManager || !authManager.isLoggedIn()) {
    window.location.href = '/pages/admin-login.html';
    return;
  }

  // Initialize dashboard manager
  const token = authManager.getToken();
  if (token) {
    dashboardManager = new DashboardManager(AIRTABLE_CONFIG.baseId, token);
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DashboardManager;
}
