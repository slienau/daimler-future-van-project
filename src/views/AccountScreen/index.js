import React from 'react'
import {TouchableWithoutFeedback, Image} from 'react-native'
import {connect} from 'react-redux'
import styled from 'styled-components/native'
import {
  Body,
  Button,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Text,
  Thumbnail,
} from 'native-base'
import Dialog, {DialogContent, ScaleAnimation} from 'react-native-popup-dialog'
import PropTypes from 'prop-types'
import {fetchAccountData, fetchLeaderBoardData} from '../../ducks/account'
import {logout} from '../../lib/api'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

const RightColumn = styled(Right)`
  flex-direction: column;
`
const DialogImage = styled(Image)`
  width: 500;
  flex: 1;
  resizemode: contain;
`
const StarIcon = styled(Icon)`
  color: gold;
`
const UnlockIcon = styled(Icon)`
  color: palegoldenrod;
`
const BusIcon = styled(Icon)`
  color: dodgerblue;
`

const LeaderBoardIcon = styled(Icon)`
  color: darkblue;
`
const TreesIcon = styled(Icon)`
  color: darkgreen;
`

class Account extends React.Component {
  static propTypes = {
    account: PropTypes.object,
    onFetchAccountData: PropTypes.func,
    onFetchLeaderBoardData: PropTypes.func,
  }

  state = {
    avatarVisible: false,
    loading: false,
    error: false,
  }

  componentDidMount() {
    this.fetchAccountData()
    this.getLeaderBoardData()
  }

  fetchAccountData = async () => {
    this.setState({
      loading: true,
      error: false,
    })

    try {
      await this.props.onFetchAccountData()
    } catch (error) {
      alert('Something went wrong while fetching account data')
      console.log(error)
      this.setState({
        error: true,
      })
    }

    this.setState({
      loading: false,
    })
  }

  async getLeaderBoardData() {
    this.setState({
      loading: true,
      error: false,
    })

    try {
      await this.props.onFetchLeaderBoardData()
    } catch (error) {
      alert('Something went wrong while fetching order data')
      console.log(error)
      this.setState({
        error: true,
      })
    }

    this.setState({
      loading: false,
    })
  }

  logout = async () => {
    await logout()
    this.props.navigation.navigate('Login')
  }

  render() {
    const uri =
      'https://www.thehindu.com/sci-tech/technology/internet/article17759222.ece/alternates/FREE_660/02th-egg-person'
    return (
      <StyledView>
        <Container>
          <Content>
            <Dialog
              height={0.5}
              visible={this.state.avatarVisible}
              onTouchOutside={() => {
                this.setState({
                  avatarVisible: false,
                })
              }}
              dialogAnimation={new ScaleAnimation({})}>
              <DialogContent>
                <DialogImage source={{uri: uri}} />
              </DialogContent>
            </Dialog>

            <List>
              <ListItem>
                <Left>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({
                        avatarVisible: true,
                      })
                    }}>
                    <Thumbnail large source={{uri: uri}} />
                  </TouchableWithoutFeedback>
                </Left>
                <RightColumn>
                  <Text>{this.props.account.username}</Text>
                  <Button onPress={this.logout}>
                    <Text>Log out</Text>
                  </Button>
                </RightColumn>
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
                  <Text>{this.props.account.name}</Text>
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
                  <Text>{this.props.account.email}</Text>
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
                  <Text>{this.props.account.address.street}</Text>
                </Right>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Text>Zip Code</Text>
                </Left>
                <Body />
                <Right>
                  <Text>{this.props.account.address.zipcode}</Text>
                </Right>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Text>City</Text>
                </Left>
                <Body />
                <Right>
                  <Text>{this.props.account.address.city}</Text>
                </Right>
              </ListItem>

              <ListItem itemDivider>
                <Text>Loyalty Program</Text>
              </ListItem>
              <ListItem icon>
                <Left>
                  <StarIcon active name="star" />
                </Left>
                <Body>
                  <Text>Loyalty Points</Text>
                </Body>
                <Right>
                  <Text>{this.props.account.loyaltyPoints}</Text>
                </Right>
              </ListItem>
              <ListItem icon button onPress={() => {}}>
                <Left>
                  <UnlockIcon name="unlock" />
                </Left>
                <Body>
                  <Text>Rewards</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
              <ListItem
                icon
                button
                onPress={() => this.props.navigation.push('Leaderboard')}>
                <Left>
                  <LeaderBoardIcon name="people" />
                </Left>
                <Body>
                  <Text>Leaderboard</Text>
                </Body>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
              <ListItem itemDivider>
                <Text>Overall Overview</Text>
              </ListItem>
              <ListItem icon>
                <Left>
                  <BusIcon name="bus" />
                </Left>
                <Body>
                  <Text>Driven Kilometers</Text>
                </Body>
                <Right>
                  <Text>{this.props.account.distance + ' km'}</Text>
                </Right>
              </ListItem>
              <ListItem icon>
                <Left>
                  <TreesIcon name="trees" type="Foundation" />
                </Left>
                <Body>
                  <Text>CO2 savings</Text>
                </Body>
                <Right>
                  <Text>{this.props.account.co2savings + ' kg'}</Text>
                </Right>
              </ListItem>
            </List>
          </Content>
        </Container>
      </StyledView>
    )
  }
}

export default connect(
  state => ({
    account: state.account,
  }),
  dispatch => ({
    onFetchAccountData: () => dispatch(fetchAccountData()),
    onFetchLeaderBoardData: () => dispatch(fetchLeaderBoardData()),
  })
)(Account)
