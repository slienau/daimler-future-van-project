import React from 'react'
import {
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Right,
  Body,
} from 'native-base'

const GamesScreen = props => {
  return (
    <Container>
      <Content>
        {/* Tic Tac Toe */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/tic-tac-toe.png')} />
              <Body>
                <Text>Tic-Tac-Toe</Text>
                <Text note>Strategy Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        {/* Four Wins */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/4wins.png')} />
              <Body>
                <Text>Four Wins</Text>
                <Text note>Strategy Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        {/* Asphalt 8: Airborne */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/airborne8.png')} />
              <Body>
                <Text>Asphalt 8: Airborne</Text>
                <Text note>Racing Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        {/* Chess */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/chess.png')} />
              <Body>
                <Text>Chess</Text>
                <Text note>Strategy Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        {/* tetris */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/tetris.png')} />
              <Body>
                <Text>Tetris</Text>
                <Text note>Strategy Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        {/* Snake */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/snake.png')} />
              <Body>
                <Text>Snake</Text>
                <Text note>Arcarde Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        {/* Worms */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/worms.png')} />
              <Body>
                <Text>Worms 3</Text>
                <Text note>Strategy Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        {/* 8 Ball Pool */}
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={require('./assets/8ballpool.png')} />
              <Body>
                <Text>8 Ball Pool</Text>
                <Text note>Multiplayer Game</Text>
              </Body>
            </Left>
            <Right>
              <Button>
                <Text>Play Now</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </Content>
    </Container>
  )
}

export default GamesScreen
