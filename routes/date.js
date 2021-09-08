//jshint esversion:6

exports.getMonthYear = function(date) {
  const options = {
    month: "long",
    year: "numeric"
  };
  return date.toLocaleDateString("in-ID", options);
};

exports.getNumericValue = function(date) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  };
  return date.toLocaleDateString("in-ID", options);
};

exports.getMonth = function(date) {
  const options = {
    month: "2-digit",
  };
  return date.toLocaleDateString("in-ID", options);
};

exports.getYear = function(date) {
  const options = {
    year: "numeric"
  };
  return date.toLocaleDateString("in-ID", options);
};
