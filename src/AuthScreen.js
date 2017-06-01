import uuid from "uuid";
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Button,
  Picker,
  ScrollView
} from "react-native";
import { NavigationActions } from "react-navigation";
import VectorDrawableView from "react-native-vectordrawable-android";
import t from "tcomb-form-native";
const Form = t.form.Form;

import colors from "./colors";
import { Text } from "./defaultComponents";

let formStyles = Object.assign({}, t.form.Form.stylesheet);
formStyles.controlLabel.normal.color = "white";
formStyles.textbox.normal.borderColor = "white";
formStyles.textbox.normal.color = "white";
formStyles.fieldset.marginTop = 20;
formStyles.fieldset.marginBottom = 10;

const resetToDrawerAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Drawer" })]
});

const UserSignUp = t.struct({
  email: t.String,
  fullName: t.String,
  telephone: t.String,
  password: t.String,
  confirmPassword: t.String,
  readAgreement: t.Boolean
});
const userSignUpOptions = {
  auto: "placeholders",
  fields: {
    email: {
      placeholderTextColor: "white",
      keyboardType: "email-address"
    },
    fullName: {
      placeholderTextColor: "white"
    },
    telephone: {
      placeholderTextColor: "white",
      keyboardType: "phone-pad"
    },
    password: {
      secureTextEntry: true,
      placeholderTextColor: "white"
    },
    confirmPassword: {
      secureTextEntry: true,
      placeholderTextColor: "white"
    },
    readAgreement: {
      label: "I have read, understood and agreed to the Terms of Use and Privacy Policy"
    }
  }
};

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp() {
    const formValues = this.refs.form.getValue();
    if (formValues) {
      this.props.navigation.dispatch(resetToDrawerAction);
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.signUpHeader}>Sign up for microAssure</Text>
            <Form ref="form" type={UserSignUp} options={userSignUpOptions} />
            <Button
              onPress={() => this.handleSignUp}
              title="Sign Up"
              color="#EF6C00"
              style={styles.signinButton}
            />
            <TouchableOpacity
              onPress={this.props.onNavigateToLogin}
              style={{ marginTop: 20 }}
              activeOpacity={0.5}
            >
              <Text style={styles.bottomBtn}>Already a member? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const UserLogin = t.struct({
  email: t.String,
  password: t.String
});
const userLoginOptions = {
  fields: {
    email: {
      keyboardType: "email-address"
    },
    password: {
      secureTextEntry: true
    }
  }
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const formValues = this.refs.form.getValue();
    if (formValues) {
      this.props.navigation.dispatch(resetToDrawerAction);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <VectorDrawableView
          resourceName="ic_microassure_white"
          style={styles.logo}
        />
        <Form ref="form" type={UserLogin} options={userLoginOptions} />
        <Button
          onPress={this.handleLogin}
          title="Login"
          color="#EF6C00"
          style={styles.signinButton}
        />
        <TouchableOpacity
          onPress={this.props.onNavigateToSignUp}
          style={{ marginVertical: 20 }}
          activeOpacity={0.5}
        >
          <Text style={styles.bottomBtn}>New member? Sign Up.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.onNavigateToForgotPassword}
          activeOpacity={0.5}
        >
          <Text style={styles.bottomBtn}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Login"
    };
    this.handleNavigateToLogin = this.handleNavigateToLogin.bind(this);
    this.handleNavigateToSignUp = this.handleNavigateToSignUp.bind(this);
    this.handleNavigateToForgotPassword = this.handleNavigateToForgotPassword.bind(
      this
    );
  }

  handleNavigateToLogin() {
    this.setState({ screen: "Login" });
  }

  handleNavigateToSignUp() {
    this.setState({ screen: "SignUp" });
  }

  handleNavigateToForgotPassword() {
    this.setState({ screen: "ForgotPassword" });
  }

  render() {
    let screen;
    switch (this.state.screen) {
      case "Login":
        page = (
          <LoginScreen
            navigation={this.props.navigation}
            onNavigateToSignUp={this.handleNavigateToSignUp}
            onNavigateToForgotPassword={this.handleNavigateToForgotPassword}
          />
        );
        break;
      case "SignUp":
        page = (
          <SignUpScreen
            navigation={this.props.navigation}
            onNavigateToLogin={this.handleNavigateToLogin}
          />
        );
        break;
      case "ForgotPassword":
        page = null;
        break;
      default:
        break;
    }
    return (
      <Image
        source={require("../images/background.png")}
        style={styles.backgroundImage}
      >
        {page}
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  signUpHeader: {
    marginBottom: 20,
    fontSize: 26,
    textAlign: "center",
    color: "white"
  },
  bottomBtn: {
    textAlign: "center",
    color: "white",
    fontSize: 17
  },
  textinput: {
    height: 50
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30
  },
  logo: {
    height: 40,
    color: "white"
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: "center",
    resizeMode: "cover",
    backgroundColor: colors.primaryOrange
  }
});
