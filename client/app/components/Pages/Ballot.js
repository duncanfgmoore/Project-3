import React, { Component } from "react";
import "whatwg-fetch";
import Header from "../Header/Header";
import Api from "../Api/Api";
import OpenSecretsAPI from "../../utils/OpenSecrets/OpenSecretsAPI"

import { getFromStorage, setInStorage } from "../../utils/storage";

class Ballot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Header />
        {/* <div style={{ backgroundColor: "#5781F6", paddingTop: 30, paddingBottom: 30 }}>
          <div style={{backgroundColor: "white", width:700, marginLeft: "auto", marginRight: "auto", paddingBottom: 20, borderRadius: 10}}> */}
            <Api />
            <OpenSecretsAPI />

          </div>
    //     </div>
    //   </div>
    );
  }
}

export default Ballot;