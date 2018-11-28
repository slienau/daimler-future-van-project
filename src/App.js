import {createSwitchNavigator, createAppContainer} from 'react-navigation'

import LoadingScreen from './views/LoadingScreen'
import Login from './views/Login'
import Welcome from './views/Welcome'
import Account from './views/Account'
import Games from './views/Games'
import Information from './views/Information'

const MainView = createSwitchNavigator(
  {
    Account,
    Welcome,
    Games,
    Information,
  },
  {
    initialRouteName: 'Welcome',
  }
)

const App = createAppContainer(
  createSwitchNavigator(
    {
      LoadingScreen,
      Login,
      MainView,
    },
    {
      initialRouteName: 'LoadingScreen',
    }
  )
)

export default App
