import React, {Component} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components/native'
import {Container, Content, List, ListItem, Text} from 'native-base'
import PropTypes from 'prop-types'
import LeaderListItem from './LeaderListItem'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

class Leaderboard extends Component {
  state = {
    loading: false,
    error: false,
  }

  render() {
    console.log('Leaderboard')
    console.log(this.props.leaders)
    return (
      <StyledView>
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
                  />
                )}
              />
            </List>
          </Content>
        </Container>
      </StyledView>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: state.acount,
    leaders: state.account.leaders,
  }
}

Leaderboard.propTypes = {
  leaders: PropTypes.array,
}

export default connect(mapStateToProps)(Leaderboard)
