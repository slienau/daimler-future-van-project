import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components/native'
import _ from 'lodash'
import goldStatus from '../LeaderboardScreen/assets/gold.png'
import silverStatus from '../LeaderboardScreen/assets/silver.png'
import bronzeStatus from '../LeaderboardScreen/assets/bronze.png'
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
  Toast,
} from 'native-base'
import PropTypes from 'prop-types'
import {fetchAccountData} from '../../ducks/account'
import {logout} from '../../lib/api'
import CustomButton from '../../components/UI/CustomButton'
import {DEFAULT_REQUEST_ERROR_TOAST} from '../../lib/toasts'
import {firstLetterToUppercase} from '../../lib/utils'

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
  }

  state = {
    avatarVisible: false,
  }

  componentDidMount() {
    this.fetchAccountData()
  }

  fetchAccountData = async () => {
    try {
      await this.props.onFetchAccountData()
    } catch (error) {
      Toast.show(DEFAULT_REQUEST_ERROR_TOAST)
      console.log(error)
    }
  }

  logout = async () => {
    await logout()
    this.props.navigation.navigate('Login')
  }

  render() {
    const uri =
      'https://www.thehindu.com/sci-tech/technology/internet/article17759222.ece/alternates/FREE_660/02th-egg-person'

    let statusIcon = bronzeStatus
    switch (this.props.account.status) {
      case 'gold':
        statusIcon = goldStatus
        break
      case 'silver':
        statusIcon = silverStatus
        break
    }

    let loyaltyStatusText = _.get(this.props.account, 'status')
    if (_.isString(loyaltyStatusText))
      loyaltyStatusText = firstLetterToUppercase(loyaltyStatusText)
    return (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail large source={{uri: uri}} />
                <Body>
                  <Text>{_.get(this.props.account, 'username')}</Text>
                  <Text note>{_.get(this.props.account, 'email')}</Text>
                </Body>
                <Right>
                  <Thumbnail source={statusIcon} medium />
                  <Text note>Status: {loyaltyStatusText}</Text>
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
                <Text>{_.get(this.props.account, 'loyaltyPoints')}</Text>
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
                <Text>{_.get(this.props.account, 'distance') + ' km'}</Text>
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
                <Text>{_.get(this.props.account, 'co2savings') + ' kg'}</Text>
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
                <Text>{_.get(this.props.account, 'name')}</Text>
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
                <Text>{_.get(this.props.account, 'email')}</Text>
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
                <Text>{_.get(this.props.account, 'address.street')}</Text>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Text>Zip Code</Text>
              </Left>
              <Body />
              <Right>
                <Text>{_.get(this.props.account, 'address.zipcode')}</Text>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Text>City</Text>
              </Left>
              <Body />
              <Right>
                <Text>{_.get(this.props.account, 'address.city')}</Text>
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
  })
)(Account)
