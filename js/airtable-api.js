/**
 * Airtable REST API Wrapper
 * Handles all CRUD operations for the eTravel Agency base
 */

class AirtableAPI {
  constructor(baseId, token) {
    this.baseId = baseId;
    this.token = token;
    this.baseURL = `https://api.airtable.com/v0/${baseId}`;
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get all records from a table
   * @param {string} tableId - Airtable table ID
   * @param {object} options - Query options (filterByFormula, sort, pageSize, etc.)
   * @returns {Promise<Array>} Array of records
   */
  async getRecords(tableId, options = {}) {
    try {
      const params = new URLSearchParams();

      if (options.filterByFormula) {
        params.append('filterByFormula', options.filterByFormula);
      }
      if (options.sort) {
        // sort should be array of {field, direction}
        options.sort.forEach((s, i) => {
          params.append(`sort[${i}][field]`, s.field);
          params.append(`sort[${i}][direction]`, s.direction || 'asc');
        });
      }
      if (options.fields) {
        options.fields.forEach(f => params.append('fields[]', f));
      }
      if (options.pageSize) {
        params.append('pageSize', options.pageSize);
      }
      if (options.maxRecords) {
        params.append('maxRecords', options.maxRecords);
      }

      const url = `${this.baseURL}/${tableId}?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  }

  /**
   * Get a single record by ID
   * @param {string} tableId - Airtable table ID
   * @param {string} recordId - Record ID
   * @returns {Promise<Object>} Record object
   */
  async getRecord(tableId, recordId) {
    try {
      const url = `${this.baseURL}/${tableId}/${recordId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching record:', error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {string} tableId - Airtable table ID
   * @param {object} fields - Field values for the new record
   * @returns {Promise<Object>} Created record
   */
  async createRecord(tableId, fields) {
    try {
      const url = `${this.baseURL}/${tableId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          records: [{ fields }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.records[0] || null;
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  }

  /**
   * Create multiple records
   * @param {string} tableId - Airtable table ID
   * @param {array} records - Array of {fields: {}} objects
   * @returns {Promise<Array>} Created records
   */
  async createRecords(tableId, records) {
    try {
      const url = `${this.baseURL}/${tableId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ records })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error('Error creating records:', error);
      throw error;
    }
  }

  /**
   * Update a record
   * @param {string} tableId - Airtable table ID
   * @param {string} recordId - Record ID
   * @param {object} fields - Updated field values
   * @returns {Promise<Object>} Updated record
   */
  async updateRecord(tableId, recordId, fields) {
    try {
      const url = `${this.baseURL}/${tableId}/${recordId}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ fields })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }

  /**
   * Update multiple records
   * @param {string} tableId - Airtable table ID
   * @param {array} records - Array of {id, fields: {}} objects
   * @returns {Promise<Array>} Updated records
   */
  async updateRecords(tableId, records) {
    try {
      const url = `${this.baseURL}/${tableId}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ records })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error('Error updating records:', error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param {string} tableId - Airtable table ID
   * @param {string} recordId - Record ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async deleteRecord(tableId, recordId) {
    try {
      const url = `${this.baseURL}/${tableId}/${recordId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }

  /**
   * Delete multiple records
   * @param {string} tableId - Airtable table ID
   * @param {array} recordIds - Array of record IDs to delete
   * @returns {Promise<Array>} Array of deleted record IDs
   */
  async deleteRecords(tableId, recordIds) {
    try {
      const url = `${this.baseURL}/${tableId}`;
      const params = new URLSearchParams();
      recordIds.forEach(id => params.append('records[]', id));

      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error('Error deleting records:', error);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AirtableAPI;
}
