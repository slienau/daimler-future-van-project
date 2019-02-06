# app

[![Build Status](https://travis-ci.com/christophwitzko/pasws18-app.svg?token=UdnpNRsQPVxpTPh6DNqo&branch=develop)](https://travis-ci.com/christophwitzko/pasws18-app)

## Setup

### Requirements

- `npm` package manager (included in [Node.js](https://nodejs.org/en/))
- React Native, install via `npm install -g react-native-cli`
- Android SDK (included in [Android Studio](https://developer.android.com/studio/)). React Native requires `Android 8.1 (Oreo)` in particular which can be installed through the SDK Manager in Android Studio. For more information on how to setup the Android development environment on your system, see the official [React Native Getting Started Page](https://facebook.github.io/react-native/docs/getting-started.html)

#### Set environment variables

On unix systems, the variables can be set in the file `.bash_profile`

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Development environment

`cd` into the project folder, then

1. Install dependencies via `npm install`.
2. Run an Android Virtual Device via the AVD Manager. If you haven't created a device yet, see the official Android Studio User Guide: [Create and manage virtual devices](https://developer.android.com/studio/run/managing-avds)
3. Start the application via `react-native run-android`. If the application doesn't start on the virtual device, make sure that you set the environment variables correctly.

## Tools

### Vans Viewer

To see all vans in a map in your browser, execute `npm run vansviewer` from the project root folder. Afterwards you can access the map at [http://localhost:5000](http://localhost:5000)

## Folder Structure
| Folder| Description |
|--- |--- |
|`/android` | Android native project (Java) which compiles the code into a android native application |
|`/ios` | iOS native project (Objective-C) which compiles the code into a iOS native application |
|`/src` | JavaScript source files |
|`/src/components` | React Native components which are neither Views nor sub-components of views |
|`/src/ducks` | Redux action creators and reducers |
|`/src/init` | Application initialization |
|`/src/lib` | Library functions which are needed in different parts of the application |
|`/src/views` | Different App Views ("Screens"), e.g. Login |

### Views and Components

For every react native compoment (`views` or `components`), a seperate folder is created. Inside of that folder, a file called `index.js` contains the code of that component. For instance, the Account-View resides in `/src/views/Account/index.js` which contains and exports the `Account` component:

```jsx
class Account extends React.Component { ... }

export default Account
```

#### Sub-Components

Sub-Components which are only used by a Parent-Component reside in a subfolder of the Parent-Component. For instance, the compoment `DestinationMarker` is only used by the `Map` component. Thus, the `Map` component is inside `/src/views/Map/index.js` and the `DestinationMarker` compoment is inside `/src/views/Map/DestinationMarker/index.js`.

If a component is used by multiple, indepentend components, this component should reside inside the folder `/src/components/<ComponentName>`.

## State management

Since React provides just the view layer (the `V` of the `MVC` pattern) for our application, we need some data storage. In this project, we use redux to provide this store. Redux provides a central data store (the `M` of the `MVC` pattern) which can be used in _any_ component. The only thing we have to do is to _connect_ a component which relies on a global application state to the redux store. If we would not use redux and manage the state just using react instead, the whole state must be maintained in the root-component and passed down the component-tree. E.g. if a component on the 5th hierarchy level depends on a global application state, we would have to pass down the data from the 1st through the 2nd, 3rd, 4th and finally to the 5th component, even though components on hierarchy level 1 till 4 don't need that data for themselves. Because this is very inconvenient and error-prone, redux helps us to write cleaner code.

### Actions and Reducers

Actions and Reducers are created for different functionalities of the application, e.g. one for managing the account data, another one for managing the orders. I will explain how actions and reducers are used in our application by looking at the account actions and reducers, but it is used in the other reducers just the same way.  

The `account` reducer and actions are placed in `/src/ducks/account.js`. First of all, some ACTIONS have to be defined. In our case, these actions are `SET_ACCOUNT_DATA` and `SET_ERROR`.

```javascript
export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'
export const SET_ERROR = 'account/SET_ERROR'
```

Next, we define an __initial state__, which is used when no reducers modified the state. In this case, the initial state looks as follows:

```javascript
const initialState = {
  accountData: {}
  error: false,
}
```

`error` will be set to `true` if an error occured while fetching data from the backend. `accountData` holds account data information like username, email, address, ...

#### Actions

TODO

#### Reducers

Reducers are pure functions (they produce no side-effects), which modify the state accorting to the incoming action.

### Use redux state in components

TODO
