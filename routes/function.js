function monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
   };

   let delayfunction = t => new Promise(resolve => setTimeout(resolve, t));



   
  module.exports = { monthDiff, delayfunction };
