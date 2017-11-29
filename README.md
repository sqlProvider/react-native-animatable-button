## react-native-animatable-button
[![npm version](https://badge.fury.io/js/react-native-animatable-button.svg)](https://badge.fury.io/js/react-native-animatable-button)
## Installation
```
npm install react-native-animatable-button --save
```

## Overview

- [x] States
- [x] Opacity animation 
- [x] Tap animations
- [x] Fully customizable

## Props

### Button Props

| Props                | Type                        | Description                        | Required     | Default                     |
|:---------------------|:----------------------------|:-----------------------------------|:-------------|:----------------------------|
| accessibilityLabel   | string                      | custom access label                | not required | reactNativeAnimetableButton
| buttonContainerStyle | Object<ViewSyle>            | must be provided Object not STYLE  | not required | see below
| selectedState        | string                      | selected id of provided states     | not required | default
| states               | [key: string]: IButtonState | state object                       | not required | default state
| disabled             | boolean                     | enable/disable button              | not required | false
| touchFeedbaack       | boolean                     | enable/disable tap opacity animate | not required | true
| touchFeedbaackDelay  | boolean                     | set delayPressIn prop of TOpacity  | not required | 0

### Button Animation Props

| Props                      | Type                        | Description                        | Required     | Default                           |
|:---------------------------|:----------------------------|:-----------------------------------|:-------------|:----------------------------------|
| animationDelay             | number                      | delay of animations                | not required | 0
| animationDuration          | number                      | animation duration time            | not required | 400
| animationEasing            | EasingFunction              | easing options                     | not required | Easing.bezier(0.4, 0.2, 0.4, 1.3)
| onPressAnimationEnable     | boolean                     | tap animation config               | not required | true
| onPressAnimationScaleValue | number                      | number of scale to                 | not required | 1.05
| onPressAnimationType       | button - inside             | scale all button or inside         | not required | button
| startAnimationDelay        | number                      | delay of start animation           | not required | 0
| startAnimationDuration     | number                      | animation duration time for start  | not required | 400
| startAnimationEnable       | boolean                     | enable/disable start animation     | not required | true
| backgroundAnimation        | animated - slide            | set background option              | not required | animated


### Button State Props

| Props                         | Type                        | Description                        | Required     | Default                           |
|:------------------------------|:----------------------------|:-----------------------------------|:-------------|:----------------------------------|
| buttonInsideContainerStyle    | Object<ViewSyle>            | must be provided Object not STYLE  | not required | see below
| icon                          | ImageURISource - any        | icon uri or source                 | not required | -
| iconStyle                     | ImageStyle                  | icon style                         | not required | see below
| iconPosition                  | left - right                | position of icon                   | not required | left
| text                          | string                      | button text                        | not required | -
| textStyle                     | TextStyle                   | text style                         | not required | see below
| spinner                       | boolean                     | enable/disable spinner             | not required | false
| spinnerProps                  | ActivityIndicatorProperties | spinner Props                      | not required | -
| syncIconAndTextAnimation      | boolean                     | enable/disable animation diff      | not required | false
| asyncIconAndTextAnimationDiff | number [0 - 100]            | percent of diff                    | not required | 50



#### buttonContainerStyle
```javascript
{
  backgroundColor: 'rgba(0,0,0,0)',
  borderRadius: 5,
  borderWidth: 1,
  height: ButtonSize.height,
  overflow: 'hidden'
}
```

#### buttonInsideContainerStyle
```javascript
{
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0)',
  flexDirection: 'row',
  height: ButtonSize.height,
  justifyContent: 'center',
  overflow: 'hidden',
  paddingHorizontal: 10
}
```

#### textStyle
```javascript
{
  paddingHorizontal: 5
}
```

#### iconStyle
```javascript
{
  flex: 1,
  resizeMode: 'contain'
}
```

## Note
  Master props and state props are combined when provided.

## Usage example
```javascript
constructor() {
  super();

  this.state = {
  activeState: 'idle2'
  }
}

render () {
  <Button	
    touchFeedback={false}
    onPress={this.onPress.bind(this)}
    selectedState={this.state.activeState}
    buttonContainerStyle={{
      height: 40
    }}
    buttonInsideContainerStyle={{
      backgroundColor: 'rgba(100,100,100,0.5)'
    }}
    onPress={() => { 
      console.log('master pressed');
      if (this.state.activeState === 'idle2') this.setState({ activeState: 'idle' });	
    }}
    states={{
      laodList: {
        text:"Load List",
        buttonInsideContainerStyle:{
          backgroundColor: 'rgba(255,0,0,0.5)'
        },
        onPress: () => { 
          console.log('loadList pressed'); 
          this.setState({ activeState: 'loading' })
          
          return false; 
        }
      },
      // when tap laodList logs => loadList pressed; master pressed

      loading: {
        text:"loading",
        buttonInsideContainerStyle:{
          backgroundColor: 'rgba(0,255,0,0.5)'
        },
        spinner: true,
        onPress: () => { console.log('loading pressed'); return true; }
      },
      // when tap loading logs => loading pressed;

      idle: {
        text:"idle",
        onPress: () => { 
          console.log('idle pressed');
          this.setState({ activeState: 'loadList' })
        }
      },
      // when tap idle logs => idle pressed; master pressed

      idle2: {
        text:"idle2",
      }
      // when tap idle2 logs => master pressed
    }}
  />
}
```

### Description
if you are return `false` or `undefined` in sub onPress functions when call master onPress function.

