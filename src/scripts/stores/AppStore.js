import AppDispatcher from "../dispatcher/AppDispatcher";
import { EventEmitter } from "events";
import * as AppConstants from "../constants/AppConstants";

class AppStore extends EventEmitter {

  /**
   * Our constructor
   */

  constructor() {
    super();
    this.letters = [];
    this.author = null;
    this.admin = null;
  }

  /**
   * Emit change to listeners
   */
  emitChange() {
    this.emit(AppConstants.CHANGE);
  }

  /**
   * Adds the change listener
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(AppConstants.CHANGE, callback);
  }

  /**
   * Removes the change listener
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(AppConstants.CHANGE, callback);
  }

  /**
   * Adds the listener to eventName list
   * @param {function} callback
   */
  addEventListener(eventName, callback){
    this.on(eventName, callback);
  }

  /**
   * Removes the listener from eventName list
   * @param {function} callback
   */
  removeEventListener(eventName, callback) {
    this.removeListener(eventName, callback);
  }

  getLetters() {
    return this.letters;
  }

  setLetters(letters) {
    this.letters = letters;
    this.emitChange();
  }

  setData(data) {
    this.amount = data.amount;
    this.letters = data.list;
    this.emitChange();
  }

  getAuthor() {
    return this.author;
  }

  setAuthor(author) {
    this.author = author;
    this.emitChange();
  }

  getAdmin() {
    return this.admin;
  }

  setAdmin(admin) {
    this.admin = admin;
    this.emitChange();
  }
}

let store = new AppStore();

AppDispatcher.register((action) => {
  switch (action.actionType) {
    case AppConstants.GET_LETTERS_SUC:
      store.setData(action.data);
      break;
    default:
      break;
  }
});

export default store;
