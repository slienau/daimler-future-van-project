import React, {Component} from 'react'
import {
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native'
import {
  Container,
  List,
  ListItem,
  Text,
  Thumbnail,
  Content,
  Right,
  Icon,
  Left,
  Body,
} from 'native-base'
import Dialog, {DialogContent, ScaleAnimation} from 'react-native-popup-dialog'

export default class AccountDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.name = 'Harald Töpfer'
    this.state.email = 'der.töpfer@hw.co.uk'
    this.state.username = 'MrPotter'
    this.state.points = 768
    this.state.miles = 46
    this.state.visible = false
    // state = this.state.bind(this)
  }

  // componentDidMount () {
  //   this.fetchData();
  // }

  render() {
    const uri =
      'http://radiohamburg.de/var/ezflow_site/storage/images/media/images/profilbild-symbolbild-maennlich-standard-blau-weiss/52195901-1-ger-DE/Profilbild-Symbolbild-maennlich-Standard-blau-weiss_image_1200.jpg'
    return (
      <Container>
        <Dialog
          height={0.5}
          visible={this.state.visible}
          onTouchOutside={() => {
            this.setState({visible: false})
          }}
          dialogAnimation={new ScaleAnimation({})}>
          <DialogContent>
            <Image style={styles.dialogImage} source={{uri: uri}} />
            {/* <Button style={{flex: 1, width: '30%'}}><Text>Edit</Text></Button> */}
          </DialogContent>
        </Dialog>
        <Content>
          <List>
            <ListItem>
              <Left>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.setState({visible: true})
                  }}>
                  <Thumbnail large source={{uri: uri}} />
                </TouchableWithoutFeedback>
              </Left>
              <Text>{this.state.username}</Text>
            </ListItem>

            <ListItem itemDivider>
              <Text>Details</Text>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon name="person" />
              </Left>
              <Body>
                <Text>Name</Text>
              </Body>
              <Right>
                <Text>{this.state.name}</Text>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon name="mail" />
              </Left>
              <Body>
                <Text>E-Mail</Text>
              </Body>
              <Right>
                <Text>{this.state.email}</Text>
              </Right>
            </ListItem>
            <ListItem icon button onPress={() => {}}>
              <Left>
                <Icon name="card" />
              </Left>
              <Body>
                <Text>Payment Information</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem itemDivider>
              <Text>Address information</Text>
            </ListItem>
            <ListItem icon>
              <Left>
                <Text>Street</Text>
              </Left>
              <Body />
              <Right>
                <Text>Ligusterweg 12</Text>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Text>Zip Code</Text>
              </Left>
              <Body />
              <Right>
                <Text>12345</Text>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Text>City</Text>
              </Left>
              <Body />
              <Right>
                <Text>Berlin</Text>
              </Right>
            </ListItem>

            <ListItem itemDivider>
              <Text>Loyalty Program</Text>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon active name="star" style={styles.starIcon} />
              </Left>
              <Body>
                <Text>Loyalty Points</Text>
              </Body>
              <Right>
                <Text>{this.state.points}</Text>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon name="bus" style={styles.busIcon} />
              </Left>
              <Body>
                <Text>Driven Kilometers</Text>
              </Body>
              <Right>
                <Text>{this.state.miles}</Text>
              </Right>
            </ListItem>
            <ListItem
              icon
              button
              onPress={() => {
                alert('name: ' + this.state.name)
              }}>
              <Left>
                <Icon name="unlock" style={styles.unlockIcon} />
              </Left>
              <Body>
                <Text>Rewards</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}

const palegoldenrod = 'palegoldenrod'
const dodgerblue = 'dodgerblue'
const gold = 'gold'

const styles = StyleSheet.create({
  unlockIcon: {
    color: palegoldenrod,
  },
  busIcon: {
    color: dodgerblue,
  },
  starIcon: {
    color: gold,
  },
  dialogImage: {
    width: Dimensions.get('window').width,
    flex: 5,
    resizeMode: 'contain',
  },
})
