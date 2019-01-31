import React from 'react'
import {Container, Content, Form, Item, Input, Label} from 'native-base'
import _ from 'lodash'
import {View, AsyncStorage, StyleSheet, ImageBackground} from 'react-native'
import {login} from '../../lib/api'
import CustomButton from '../../components/UI/CustomButton'
import HeadingText from '../../components/UI/HeadingText'
import backgroundImage from './assets/login_background.jpg'
import {DARK_COLOR, GREY_COLOR} from '../../components/UI/colors'

export default class LoginScreen extends React.Component {
  state = {
    username: '',
    password: '',
  }

  async componentDidMount() {
    this.setState({
      username: await AsyncStorage.getItem('username'),
    })
  }

  login = async () => {
    try {
      await login(this.state)
      this.props.navigation.navigate('MainAppStack')
    } catch (err) {
      if (_.get(err, 'response.status') !== 400) throw err
      alert('Invalid username or password!')
    }
  }

  onChangePassword = password => {
    this.setState({password})
  }

  onChangeUsername = username => {
    this.setState({username})
  }

  render() {
    return (
      <Container>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImageContainer}
          imageStyle={styles.backgroundImage}>
          <Content contentContainerStyle={styles.contentContainer}>
            <HeadingText>Please Log In</HeadingText>
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
            <View style={styles.buttonContainer}>
              <CustomButton text="Login" onPress={this.login} />
            </View>
          </Content>
        </ImageBackground>
      </Container>
    )
  }
}

const TRANSPARENT_WHITE_BACKGROUND = 'rgba(255, 255, 255, 0.8)'

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
    marginTop: 30,
  },
  label: {
    color: DARK_COLOR,
    fontSize: 20,
  },
  itemContainer: {
    backgroundColor: TRANSPARENT_WHITE_BACKGROUND,
    marginTop: 5,
    marginBottom: 5,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: GREY_COLOR,
  },
  input: {
    color: DARK_COLOR,
    fontSize: 20,
  },
})
