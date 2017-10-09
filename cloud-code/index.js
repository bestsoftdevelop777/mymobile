Parse.Cloud.job("myJob", function(request, status) {
  // the params passed through the start request
  const params = request.params;
  // Headers from the request that triggered the job
  const headers = request.headers;

  // get the parse-server logger
  const log = request.log;

  // Update the Job status message
  status.message("I just started");
  doSomethingVeryLong()
    .then(function(result) {
      // Mark the job as successful
      // success and error only support string as parameters
      status.success("I just finished");
    })
    .catch(function(error) {
      // Mark the job as errored
      status.error("There was an error");
    });
});
