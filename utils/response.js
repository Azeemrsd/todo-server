module.exports.sendResponse = (
  res,
  status,
  statusCode,
  title,
  message,
  result = null
) => {
  res.json({ status, statusCode, title, message, result });
};
