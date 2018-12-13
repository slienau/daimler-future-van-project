import React from 'react'

import styled from 'styled-components/native'
import {Container} from 'native-base'
import ViewHeader from '../../components/ViewHeader'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

const Games = props => {
  return (
    <StyledView>
      <Container>
        <ViewHeader
          title="Games"
          onMenuPress={() => props.navigation.openDrawer()}
        />
      </Container>
    </StyledView>
  )
}

export default Games
