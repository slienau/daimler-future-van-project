import React from 'react'
import {
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base'
import {StyleSheet, Image} from 'react-native'

const images = {
  tictactoe: require('./assets/tic-tac-toe.png'),
}

const SightsScreen = props => {
  return (
    <Container>
      <Content>
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={{uri: 'Image URL'}} />
              <Body>
                <Text>NativeBase</Text>
                <Text note>GeekyAnts</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image source={{uri: images[0]}} style={styles.cardImage} />
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent>
                <Icon active name="thumbs-up" />
                <Text>12 Likes</Text>
              </Button>
            </Left>
            <Body>
              <Button transparent>
                <Icon active name="chatbubbles" />
                <Text>4 Comments</Text>
              </Button>
            </Body>
            <Right>
              <Text>11h ago</Text>
            </Right>
          </CardItem>
        </Card>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  cardImage: {
    height: 200,
    width: null,
    flex: 1,
  },
})

export default SightsScreen
