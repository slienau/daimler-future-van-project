import {Body, Button, Header, Icon, Left, Title} from 'native-base'
import React from 'react'
import {StyleSheet, StatusBar} from 'react-native'
import PropTypes from 'prop-types'
import {DARK_COLOR, LIGHT_COLOR} from './colors'

const CustomScreenHeader = props => {
  const styles = StyleSheet.create({
    header: {
      backgroundColor: DARK_COLOR,
    },
    title: {
      color: LIGHT_COLOR,
      fontWeight: 'bold',
    },
    body: {
      alignItems: props.onPress ? 'flex-start' : 'center',
    },
  })

  let leftContent = null
  if (props.onPress) {
    leftContent = (
      <Left>
        <Button transparent>
          <Icon
            style={styles.icon}
            name={props.icon || 'arrow-back'}
            onPress={props.onPress}
          />
        </Button>
      </Left>
    )
  }

  return (
    <Header style={styles.header}>
      <StatusBar
        style={styles.StatusBar}
        barStyle="light-content"
        hidden={false}
        backgroundColor="#000000"
      />
      {leftContent}
      <Body style={styles.body}>
        <Title style={styles.title}>{props.title}</Title>
      </Body>
    </Header>
  )
}

CustomScreenHeader.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func,
  title: PropTypes.string,
}

export default CustomScreenHeader
