import React from 'react'
import {Text, Container, Content} from 'native-base'
import styled from 'styled-components/native/dist/styled-components.native.esm'
import SubViewHeader from '../../../components/ViewHeaders/SubViewHeader'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

const OrderDetail = props => {
  const order = props.navigation.getParam('order', null)
  return (
    <StyledView>
      <Container>
        <SubViewHeader
          title={order.orderTime.format('L, LT')}
          onArrowBackPress={() => props.navigation.goBack()}
        />
        <Content>
          <Text>{order._id}</Text>
        </Content>
      </Container>
    </StyledView>
  )
}

export default OrderDetail
