import React, {Component} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components/native/dist/styled-components.native.esm'
import ViewHeader from '../../components/ViewHeader'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

class Orders extends Component {
  state = {
    loading: false,
    error: false,
  }

  render() {
    return (
      <StyledView>
        <ViewHeader
          title="Orders"
          onMenuPress={() => this.props.navigation.openDrawer()}
        />
      </StyledView>
    )
  }
}

export default connect(
  null,
  null
)(Orders)
