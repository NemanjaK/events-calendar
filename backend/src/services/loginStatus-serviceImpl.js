module.exports = function(context, input, callback) {
	var hasSession = context;
	var response = {
		authenticated : hasSession ? true : false
	};
	if (hasSession) {
		response.userId = context;
	}
	callback(null, response);
};