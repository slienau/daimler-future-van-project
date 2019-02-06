import React from 'react'
import {Container, Content, Form, Item, Input, Label, Toast} from 'native-base'
import _ from 'lodash'
import {
  View,
  AsyncStorage,
  StyleSheet,
  ImageBackground,
  Animated,
} from 'react-native'
import {login} from '../../lib/api'
import CustomButton from '../../components/UI/CustomButton'
import HeadingText from '../../components/UI/HeadingText'
import backgroundImage from './assets/login_background.jpg'
import {DARK_COLOR, GREY_COLOR} from '../../components/UI/colors'
import {NETWORK_TIMEOUT_TOAST, WRONG_PASSWORD_TOAST} from '../../lib/toasts'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

class LoginScreen extends React.Component {
  state = {
    username: '',
    password: '',
    wrongPassword: false,
    loginAnimation: new Animated.Value(1), // start value
  }

  async componentDidMount() {
    this.setState({
      username: await AsyncStorage.getItem('username'),
    })
  }

  login = async () => {
    try {
      await login(this.state)
      Animated.timing(this.state.loginAnimation, {
        toValue: 0,
        duration: 500, // milliseconds
        useNativeDriver: true, // for better performance
      }).start(() => {
        this.props.navigation.navigate('MainAppStack')
      })
    } catch (err) {
      if (_.get(err, 'response.status') !== 400) throw err
      this.setState({wrongPassword: true})
    }
  }

  onChangePassword = password => {
    this.setState({password})
  }

  onChangeUsername = username => {
    this.setState({username})
  }

  render() {
    if (this.props.networkTimeoutError) {
      Toast.show(NETWORK_TIMEOUT_TOAST)
    }
    if (this.state.wrongPassword) {
      Toast.show(WRONG_PASSWORD_TOAST)
      // this.setState({wrongPassword: false})
    }
    return (
      <Container>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImageContainer}
          imageStyle={styles.backgroundImage}>
          <Content
            contentContainerStyle={[
              styles.contentContainer,
              // styles.transformTest,
            ]}>
            <Animated.View
              style={{
                opacity: this.state.loginAnimation,
                transform: [
                  {
                    scale: this.state.loginAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 1],
                    }),
                  },
                ],
              }}>
              <HeadingText>Please Log In</HeadingText>
            </Animated.View>
            <Form style={styles.form}>
              <View style={styles.itemContainer}>
                <Item floatingLabel>
                  <Label style={styles.label}>Username</Label>
                  <Input
                    style={styles.input}
                    value={this.state.username}
                    onChangeText={this.onChangeUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </Item>
              </View>
              <View style={styles.itemContainer}>
                <Item floatingLabel last>
                  <Label style={styles.label}>Password</Label>
                  <Input
                    style={styles.input}
                    secureTextEntry
                    value={this.state.password}
                    onChangeText={this.onChangePassword}
                  />
                </Item>
              </View>
            </Form>
            <Animated.View
              style={{
                opacity: this.state.loginAnimation,
                transform: [
                  {
                    scale: this.state.loginAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 1],
                    }),
                  },
                ],
              }}>
              <View style={styles.buttonContainer}>
                <CustomButton text="Login" onPress={this.login} />
              </View>
            </Animated.View>
          </Content>
        </ImageBackground>
      </Container>
    )
  }
}

LoginScreen.propTypes = {
  networkTimeoutError: PropTypes.bool,
}

const TRANSPARENT_WHITE_BACKGROUND = 'rgba(255, 255, 255, 0.7)'

const styles = StyleSheet.create({
  backgroundImageContainer: {
    width: '100%',
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.6,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', // centers the content according to flexDirection. because flexDirection is 'column', it will VERTICALLY be centered
    flexDirection: 'column', // not needed here, because 'column' is default
    alignItems: 'center', // horizontal center
  },
  form: {
    justifyContent: 'space-around',
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  label: {
    color: DARK_COLOR,
    fontSize: 20,
  },
  itemContainer: {
    backgroundColor: TRANSPARENT_WHITE_BACKGROUND,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 20,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: GREY_COLOR,
  },
  input: {
    color: DARK_COLOR,
    fontSize: 20,
  },
})

export default connect(state => ({
  networkTimeoutError: state.errors.networkTimeout,
}))(LoginScreen)
