import React, { Component } from 'react';
import 'whatwg-fetch';
import Home from './Home';
import Header from '../Header/Header';

import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

class Login extends Component {
  constructor(props) {
    super(props);
// state.signedUp is used to toggle between signing up and signing in
// state.token is used to determine if user is signed in
    this.state = {
      isLoading: true,
      signedUp: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      firstName: '',
      lastName: '',
      signUpEmail: '',
      signUpHomeAddress: '',
      signUpPassword: '',
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);

    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpHomeAddress = this.onTextboxChangeSignUpHomeAddress.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('Electioneer');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      firstName: event.target.value,
    });
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      lastName: event.target.value,
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpHomeAddress(event) {
    this.setState({
      signUpHomeAddress: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onSignUp() {
    // Grab state
    const {
      firstName,
      lastName,
      signUpEmail,
      signUpHomeAddress,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: signUpEmail,
        homeAddress: signUpHomeAddress,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            // firstName: '',
            // lastName: '',
            // signUpEmail: '',
            // signUpHomeAddress: '',
            // signUpPassword: '',
          });
        } else {
          console.log(user);
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      }).then(
        // sign the user in
        fetch('/api/account/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: signUpEmail,
            password: signUpPassword,
          }),
        }).then(res => res.json())
          .then(json => {
            console.log('json :' + json);
            if (json.success) {
              setInStorage('Electioneer', { 
                token: json.token,
                name: json.firstName
              });
              this.setState({
                // firstName: json.firstName,
                // lastName: '',
                signInError: json.message,
                isLoading: false,
                // signInPassword: '',
                // signInEmail: '',
                token: json.token,
              });
            } else {
              this.setState({
                signInError: json.message,
                isLoading: false,
              });
            }
          })
      )
  }

  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage('Electioneer', { 
            token: json.token,
            name: json.firstName
          });
          this.setState({
            firstName: json.firstName,
            lastName: '',
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('Electioneer');
    if (obj && obj.token) {
      
      // Verify token
      fetch('/api/account/logout?token=' + obj.token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            localStorage.clear();
            this.setState({
              token: '',
              isLoading: false,
              firstName: ''
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  toggleSignUp() {
    if(this.state.signedUp){
      this.setState({
        signedUp: false
      })
    } else if (!this.state.signedUp){
        this.setState({
          signedUp: true
        })
      } 
    }

  render() {
    const {
      isLoading,
      signedUp,
      token,
      signInError,
      signInEmail,
      signInPassword,
      firstName,
      lastName,
      signUpEmail,
      signUpHomeAddress,
      signUpPassword,
      signUpError,
    } = this.state;

    const centerStyle = {
      textAlign: 'center',
    }
    const borderBox = {
      border: '2px solid black',
      padding: '10px'
    }
    const styleToggleSignUp = {
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer'
    }
    const blueSignUp = {
      color: 'blue',
      display: 'inline'
    }

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        
        <div style={centerStyle}>
        <p>Welcome to Electioneer!</p>
          {
            (signedUp) ? (
              <div style={borderBox}>
                {
                  (signInError) ? (
                    <p>{signInError}</p>
                  ) : (null)
                }
                <p>Sign In</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={signInEmail}
                  onChange={this.onTextboxChangeSignInEmail}
                />
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  value={signInPassword}
                  onChange={this.onTextboxChangeSignInPassword}
                />
                <br />
                <br />
                <button onClick={this.onSignIn}>Sign In</button>
              <br />
              <br />
                <button onClick={this.toggleSignUp} style={styleToggleSignUp}>Click Here to <p style={blueSignUp}>Sign Up!</p></button>
              </div>

          ):(

          <div className="signUpDiv">
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }
            <p>Sign Up</p>
            <input
              type="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            /><br />
            <input
              type="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={this.onTextboxChangeSignUpLastName}
            /><br />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            /><br />
            <input
              type="homeAddress"
              placeholder="Home Address"
              value={signUpHomeAddress}
              onChange={this.onTextboxChangeSignUpHomeAddress}
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            /><br />
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
            <br />
            <br />
            <button onClick={this.toggleSignUp} style={styleToggleSignUp}>Click Here to <p style={blueSignUp}>Sign In!</p></button>
          </div>
            )}
        </div>
      );
    }

    return (
      <div>
        <Header 
        firstName={this.state.firstName}
        token={this.state.token}
        logout={this.logout}
        />
        <Home 

        />
      </div>
    );
  }
}

export default Login;