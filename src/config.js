export const config = {
    apiBase: import.meta.env.VITE_API_BASE || "/api",
    endpoints: {
      fetchEmployees: '/fetchEmployees',
      fetchArticles: '/fetchArticles',
      authCredentials: '/authCredentials',
      fetchNewEmployees: '/fetchNewEmployees',
      deleteEmployees: '/deleteEmployees',
      submitPointage: '/submitPointage',
      addEmployees: '/addEmployees',
      updatePointage: '/updatePointage',
      getSubmittedDates: '/getSubmittedDates',
      addAdvances: '/addAdvances',
      fetchSalaries: '/fetchSalaries'
      // Add other endpoints as needed
    },
  };
