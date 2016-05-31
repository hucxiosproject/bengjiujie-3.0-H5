import AppDispatcher from "../dispatcher/AppDispatcher";
import APIService from "../api/APIService";
import cookie from "react-cookie";
import Bridge from "../utils/JStoNativeBridge";
import AppStore from "../stores/AppStore";

import * as AppConstants from "../constants/AppConstants";

let token = cookie.load('token');

export default {
  getLetters: function(id) {
    APIService.getLetters(id,function(err, res) {
      if (res.ok && res.body) {
        AppDispatcher.dispatch({
          actionType: AppConstants.GET_LETTERS_SUC,
          data: res.body
        });
      }
    });
  }

}
