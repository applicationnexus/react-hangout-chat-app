/**
 * Send HTTP success and error response from server to client
 * @param {Object} resp
 * @param {Number} code
 * @param {Object} data
 * @param {String} message
 */
function sendResponse(resp, code, data, message) {
   var output = {
      code: code,
      message: message,
      data: data
   };
   resp.status(200).send(output);
}

module.exports = sendResponse;