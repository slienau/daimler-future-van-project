import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components/native'
import goldStatus from '../LeaderboardScreen/assets/gold.png'
import silverStatus from '../LeaderboardScreen/assets/silver.png'
import bronzeStatus from '../LeaderboardScreen/assets/bronze.png'
import _ from 'lodash'

import {
  Body,
  Container,
  Content,
  Icon,
  Left,
  List,
  Card,
  CardItem,
  ListItem,
  Right,
  Text,
  Thumbnail,
} from 'native-base'
import PropTypes from 'prop-types'
import {fetchAccountData, fetchLeaderBoardData} from '../../ducks/account'
import {logout} from '../../lib/api'
import CustomButton from '../../components/UI/CustomButton'

const StarIcon = styled(Icon)`
  color: gold;
`
const UnlockIcon = styled(Icon)`
  color: palegoldenrod;
`
const BusIcon = styled(Icon)`
  color: dodgerblue;
`
const PlanetIcon = styled(Icon)`
  color: gray;
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
    status: 'bronze',
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

  getLeaderBoardData = async () => {
    this.setState({
      loading: true,
      error: false,
    })

    try {
      await this.props.onFetchLeaderBoardData()
      const userLeader = _.filter(this.props.account.leaders, [
        'username',
        this.props.account.username,
      ])
      this.setState({
        status: userLeader[0].status,
      })
    } catch (error) {
      alert('Something went wrong while fetching LeaderBoard Data')
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

    let statusIcon = null
    if (this.state.status === 'gold') {
      statusIcon = goldStatus
    } else if (this.state.status === 'silver') {
      statusIcon = silverStatus
    } else {
      statusIcon = bronzeStatus
    }
    return (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail large source={{uri: uri}} />
                <Body>
                  <Text>{this.props.account.username}</Text>
                  <Text note>{this.props.account.email}</Text>
                </Body>
                <Right>
                  <Thumbnail source={statusIcon} medium />
                </Right>
              </Left>
            </CardItem>
          </Card>
          <List>
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
            <ListItem
              icon
              button
              onPress={() => this.props.navigation.push('PastOrders')}>
              <Left>
                <BusIcon name="bus" />
              </Left>
              <Body>
                <Text>Order History</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <PlanetIcon name="planet" />
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
            <ListItem>
              <Body>
                <CustomButton text="Log out" onPress={this.logout} fullWidth />
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
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
