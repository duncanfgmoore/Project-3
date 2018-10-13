import React, { Component } from "react";
import axios from "axios";
import stateData from "./States.json";

class Polling extends Component {
  constructor(props) {
    super(props);
    this.state = { pollingLocations: [] };
    this.retrieveCandadites = this.retrieveCandadites.bind(this);
  }

 returnAddress(){

    var addressDetails = {
     houseNumber : "1112",
     address :"W25th",
     addressType : "st",
     city : "Minneapolis",
     yourState : "MN"

    }
    return addressDetails;
 }

  retrieveCandadites() {
 
    console.log(this.returnAddress().houseNumber);

    var queryURL =
      "https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyCXwoG3eT07HmPYzM402gKblv-_KJWL3jo&address=" +
      this.returnAddress().houseNumber +
      "%20" +
      this.returnAddress().address +
      "%20" +
      this.returnAddress().addressType +
      "S%20City%20" +
      this.returnAddress().city +
      "%20" +
      this.returnAddress().yourState +
      "&electionId=2000";

    const self = this;
    axios
      .get(queryURL)
      .then(function(response) {
        //console.log(response.data);
        self.setState({ pollingLocations: response.data.pollingLocations });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.retrieveCandadites();
  }

  render() {
    //console.log(stateData[5].name)

    return (
      <div className="col-sm-8"style={{ textAlign:"center"}}>
        <h3> Your Local Polling Location<br></br><br></br></h3>

        {this.state.pollingLocations
          ? this.state.pollingLocations.map(polling => {
              //console.log(this.state);

              return (
                <div id="pole"
                  style={{
                   
                    borderRadius: 10,
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  <p id="locationName">{polling.address.locationName}</p>
                  <p id="line1">{polling.address.line1}</p>
                  <p id="cityStateZip">
                    {polling.address.city}, {polling.address.state}{" "}
                    {polling.address.zip}
                  </p>
                </div>
              );
            })
          : stateData.map(abbreviation => {
              let stateWebsite = "";
              if (abbreviation.abbreviation === this.returnAddress().yourState) {
                stateWebsite = abbreviation.website;
                return (
                  <div
                    style={{
                      backgroundColor: "#D3D3D3",
                      borderRadius: 10,
                      width: 500,
                      textAlign: "center"
                    }}
                  >
                    <p>
                      Please visit state website to find closest polling
                      locations at:{" "}
                    </p>
                    <p>{stateWebsite}</p>
                  </div>
                );
              } else {
                return;
              }
              return <div />;
            })}
      </div>
    );
  }
}
export default Polling;