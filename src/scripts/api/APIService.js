import request from "superagent";
import cookie from "react-cookie";
import * as AppConstants from "../constants/AppConstants";

// let token = cookie.load('token');

export default {
  getLetters: function(id,cb) {
    var req = request.get(AppConstants.GET_LETTERS_URL+"?token="+window.token+"&userId="+id+"&skip=0&limit=99999");
    req.end(cb);
  }
}
