import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Container, Content, List, ListItem, Text, Toast} from 'native-base'
import PropTypes from 'prop-types'
import LeaderListItem from './components/LeaderListItem'
import {fetchLeaderBoardData} from '../../ducks/account'
import {DEFAULT_REQUEST_ERROR_TOAST} from '../../lib/toasts'

class LeaderboardScreen extends Component {
  // TODO: data (List) is not shown the first time LeaderboardScreen is opened, only the following times
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.getLeaderBoardData()
    })
  }

  async getLeaderBoardData() {
    try {
      await this.props.onFetchLeaderBoardData()
    } catch (error) {
      Toast.show(DEFAULT_REQUEST_ERROR_TOAST)
      console.log(error)
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>Top 10</Text>
            </ListItem>
            <List
              dataArray={this.props.leaders}
              renderRow={(item, _, index) => (
                <LeaderListItem
                  place={index}
                  loyaltyPoints={item.loyaltyPoints}
                  username={item.username}
                  leaderStatus={item.status}
                />
              )}
            />
          </List>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    leaders: state.account.leaders,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onFetchLeaderBoardData: () => dispatch(fetchLeaderBoardData()),
  }
}

LeaderboardScreen.propTypes = {
  leaders: PropTypes.array,
  onFetchLeaderBoardData: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeaderboardScreen)
