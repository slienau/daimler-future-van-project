import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import goldStatus from '../LeaderboardScreen/assets/gold.png'
import silverStatus from '../LeaderboardScreen/assets/silver.png'
import bronzeStatus from '../LeaderboardScreen/assets/bronze.png'
import {
  Body,
  Container,
  Content,
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
import {
  CO2SavingsIcon,
  LoyaltyPointsIcon,
  OrderHistoryIcon,
  LeaderboardIcon,
  RewardsIcon,
  NameIcon,
  MailIcon,
  PaymentIcon,
  DistanceIcon,
} from '../../components/UI/defaultIcons'
import {defaultDangerToast} from '../../lib/toasts'
import {firstLetterToUppercase} from '../../lib/utils'
import DefaultListItem from '../../components/UI/DefaultListItem'

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
      Toast.show(
        defaultDangerToast("Couldn't get account data. " + error.message)
      )
    }
  }

  logout = async () => {
    await logout()
    this.props.navigation.navigate('Login')
  }

  render() {
    const uri =
      'https://www.thehindu.com/sci-tech/technology/internet/article17759222.ece/alternates/FREE_660/02th-egg-person'

    const loyaltyStatus = _.get(this.props.account, 'loyaltyStatus')
    let statusIcon = bronzeStatus
    switch (loyaltyStatus) {
      case 'gold':
        statusIcon = goldStatus
        break
      case 'silver':
        statusIcon = silverStatus
        break
    }

    let loyaltyStatusText = ''
    if (_.isString(loyaltyStatus))
      loyaltyStatusText = firstLetterToUppercase(loyaltyStatus)
    return (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail large source={{uri: uri}} />
                <Body>
                  <Text>{_.get(this.props.account, 'username')}</Text>
                  <Text note>{_.get(this.props.account, 'name')}</Text>
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
            <DefaultListItem
              iconElement={<LoyaltyPointsIcon />}
              bodyText="Loyalty Points"
              rightText={_.get(this.props.account, 'loyaltyPoints')}
            />
            <DefaultListItem
              iconElement={<RewardsIcon />}
              bodyText="Rewards"
              onPress={() => {}}
            />
            <DefaultListItem
              iconElement={<LeaderboardIcon />}
              bodyText="Leaderboard"
              onPress={() => this.props.navigation.push('Leaderboard')}
            />

            <ListItem itemDivider>
              <Text>Order Overview</Text>
            </ListItem>
            <DefaultListItem
              iconElement={<OrderHistoryIcon />}
              bodyText="Order History"
              onPress={() => this.props.navigation.push('OrderHistory')}
            />
            <DefaultListItem
              iconElement={<DistanceIcon />}
              bodyText="Total Driven Kilometers"
              rightText={_.get(this.props.account, 'distance') + ' km'}
            />
            <DefaultListItem
              iconElement={<CO2SavingsIcon />}
              bodyText="Total CO2 savings"
              rightText={_.get(this.props.account, 'co2savings') + ' kg'}
            />

            <ListItem itemDivider>
              <Text>Account Details</Text>
            </ListItem>
            <DefaultListItem
              iconElement={<NameIcon />}
              bodyText="Name"
              rightText={_.get(this.props.account, 'name')}
            />
            <DefaultListItem
              iconElement={<MailIcon />}
              bodyText="E-Mail"
              rightText={_.get(this.props.account, 'email')}
            />
            <DefaultListItem
              iconElement={<PaymentIcon />}
              bodyText="Payment Information"
              onPress={() => {}}
            />

            <ListItem itemDivider>
              <Text>Address Information</Text>
            </ListItem>

            <DefaultListItem
              leftText="Street"
              rightText={_.get(this.props.account, 'address.street')}
            />
            <DefaultListItem
              leftText="Zip Code"
              rightText={_.get(this.props.account, 'address.zipcode')}
            />
            <DefaultListItem
              leftText="City"
              rightText={_.get(this.props.account, 'address.city')}
            />

            <DefaultListItem
              bodyElement={
                <CustomButton text="Log out" onPress={this.logout} fullWidth />
              }
            />
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
