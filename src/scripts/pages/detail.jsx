import React from "react";
import Letters from "./components/Letters.jsx";
import AppStore from "../stores/AppStore";
import AppAction from "../actions/AppAction";

function getData() {
  return {
    letters: AppStore.getLetters(),
    author: AppStore.getAuthor(),
    admin: AppStore.getAdmin()
  }
}

export default class App extends React.Component {
  constructor() {
    super();
    this.state = getData();
    this.mailboxId = "";
  }

  componentDidUpdate(prevProps) {
    let oldId = prevProps.params.id;
    let newId = this.props.params.id;

    if (oldId !== newId) {
      AppAction.getLetters(newId);
    }
  }

  componentDidMount() {
    AppStore.addChangeListener(this.onChange.bind(this));
    AppAction.getLetters(this.props.params.id);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onChange.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.letters.length != prevState.letters.length) {
      setTimeout(() => {
        var appDom = document.getElementById("app");
        document.domain = 'vocinno.com';
        window.parent && window.parent.resizeParentConHeight && window.parent.resizeParentConHeight(appDom.scrollHeight);
      },30);
    }
  }

  onChange() {
    this.setState(getData());
  }

  render() {
    var style ={

    };

    return (
      <div className="">
        <div className="content">
          <Letters
            letters={this.state.letters}
            author={this.state.author}
            admin={this.state.admin}/>
        </div>
      </div>
    );
  }
}
