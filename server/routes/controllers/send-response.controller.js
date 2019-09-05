class SendResponseController {

   /**
    * Send the response
    */
   sendResponse(status, message, results) {
      return {
         status: status,
         results: results,
         message: message
      }
   }
}

module.exports = SendResponseController