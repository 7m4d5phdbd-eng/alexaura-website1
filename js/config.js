// Airtable Configuration
// Base: eTravel Agency (appxY8xOcCvpHyI7Y)

const AIRTABLE_CONFIG = {
  baseId: 'appxY8xOcCvpHyI7Y',

  // Note: Replace these with your actual PAT tokens
  // PUBLIC_TOKEN: for customer portal (read-only)
  // ADMIN_TOKEN: for admin dashboard (read-write)
  publicToken: process.env.AIRTABLE_PUBLIC_TOKEN || '',
  adminToken: process.env.AIRTABLE_ADMIN_TOKEN || '',

  tables: {
    destinations: {
      id: 'tblMHbYPSP915hKYj',
      name: 'Destinations'
    },
    packages: {
      id: 'tblPp5s7F5TMbqZDt',
      name: 'Travel Packages'
    },
    clients: {
      id: 'tblk5qNs7Ari0nvA9',
      name: 'Clients'
    },
    bookings: {
      id: 'tblUyFWLENQDkWpFF',
      name: 'Bookings'
    },
    payments: {
      id: 'tbla6oIQwcufaKfIQ',
      name: 'Payments'
    },
    services: {
      id: 'tblxVSNYQ4Mi2BAVe',
      name: 'Services'
    },
    adminUsers: {
      id: 'tblUfgopHlCrcwOrl',
      name: 'Admin Users'
    }
  },

  fields: {
    destinations: {
      name: 'fldY1CISWQBaWqHsC',
      country: 'fldkq8Yxb5ChxBFvQ',
      description: 'fldSaByz5EVWDXA9I',
      bestMonths: 'fldSzYdot3UEE9rIN',
      activities: 'fldhnNthbThjW8UnU',
      imageUrl: 'fldIAgsG4hvbQOEbz',
      featured: 'fld23PcLnNZeBwaWa',
      rating: 'fldHVbX3ZMe7oSlih',
      status: 'fldt7VJVM2OGjRWM0'
    },
    packages: {
      name: 'fldoUhD0SYTEp0Omi',
      description: 'fldCrI5yy1nH7h3yS',
      destinationName: 'fldGaAIpT75kAkSF0',
      duration: 'fldHm8zgXyKh8F3nr',
      pricePerPerson: 'fldMqdVORtHDuryMK',
      includedServices: 'fldbVMst4mZHId9ui',
      maxCapacity: 'fldPw21KO2hUpSNP7',
      currentBookings: 'fld2JpumkMW9uO9n3',
      status: 'fldKIB7w3bgdrZFW8',
      imageUrl: 'fldg5pU3Bt1N04R6t',
      highlights: 'fld3FUIjQ0X05nnOP'
    },
    clients: {
      name: 'fldYQK247OOMsMX9k',
      email: 'fldb5obsDUNzMzuAA',
      phone: 'fld8aIL9QiZB3xo8b',
      address: 'fld90XKJtHEyAPH4H',
      country: 'fldK4x99iwHhNnpNN',
      dateCreated: 'fldBET6OvGIkha6Hg',
      status: 'fldLQorJQhl05cmqC',
      notes: 'fldLjaqexonJQkA1N'
    },
    bookings: {
      bookingId: 'fld0NfkfQMdhgBxXN',
      clientName: 'fldPjVXoZOkjSk3F8',
      tripType: 'fldOJFM3b5U3U6J1k',
      destination: 'fldlw0MLxXMwmznPu',
      departureDate: 'fldNNDCqf9OlRsRnP',
      returnDate: 'fldRYdNm5Sqfvtnke',
      numTravelers: 'fldk3OJpjCvPYwx4G',
      status: 'fld7nkA8GW50ZZVcg',
      totalCost: 'fld0ijGEJgQ4TsCt6',
      paymentStatus: 'fldlJJrKYMXnyLYl0',
      notes: 'fld14uuog1lj4EFzF',
      dateCreated: 'fldSo7MGXlXKrXMq3'
    },
    payments: {
      paymentId: 'fldCFOKZDLBTYr6cw',
      bookingId: 'fldekV3vzIWGB1Qok',
      clientName: 'flduEiqyRsiJ42E8u',
      amount: 'fldKbBiUlITC7Kl1a',
      currency: 'fldROJYgbJUEDaTKA',
      paymentDate: 'fldsW3cQCFPKR4zDo',
      paymentMethod: 'fldGPTzZTFEKaolDa',
      status: 'fld2GUUZPTE6qA1Kp',
      invoiceUrl: 'fldZJ9MIIKLVN7J0n'
    },
    services: {
      name: 'fldiRFqSEtdaJi8G0',
      category: 'fldEKLM9NNZqCHwJ1',
      description: 'fldaDIkiLw78ORniD',
      basePrice: 'fldxeiUsdtt1PBdml',
      status: 'fldUxZAgAkSxzMJPV'
    },
    adminUsers: {
      name: 'fldfiZg56MitdKugR',
      email: 'fldGSTfApnOr3eI68',
      role: 'fldXKfZeT5AZ31r1a',
      status: 'fldvImTWjregXIelh',
      createdDate: 'fldik58HNkNOaseHq'
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIRTABLE_CONFIG;
}
