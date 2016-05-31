import * as AppConstants from "../constants/AppConstants";

function sechema(event,params) {
  var params = params||["default"];
  return event + "://" + params.join("/");
}

export default {
  NotifyTokenInvalid: function() {
    window.location.href = sechema(AppConstants.TO_NATIVE_EVENT_TOKEN_INVALID);
  }
};
