import React, { Component } from 'react';
import {
	ActivityIndicator,
	Animated,
	Easing,
	GestureResponderEvent,
	Image,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from 'react-native';

import tinycolor from 'tinycolor2';

import { IButton, RecursiveArray } from './IButton';
import { ButtonSize, Styles } from './Styles';

export class Button extends Component<IButton.IProps, IButton.IState> {
	private buttonSize: { height: number };
	private prevState: IButton.IButtonState;
	private nextState: IButton.IButtonState;
	private stateLength: number;
	constructor(props: IButton.IProps) {
		super(props);

		this.buttonSize = ButtonSize;

		const {
			defaultButtonState,
			defaultProps
		} = this.serializeProps();

		this.state = {
			...defaultProps,
			...props,
			buttonContainerStyle: {
				...defaultProps.buttonContainerStyle,
				...props.buttonContainerStyle
			}
		} as IButton.IState;

		if (this.state.states.default && this.state.states.default.text === '___MUSTBEINITALIZE___')
			this.state.states.default = this.state;

		const height = (this.state.buttonContainerStyle.height || this.buttonSize.height).toString();
		this.buttonSize.height = !isNaN(parseInt(height.toString(), 0)) ?
			parseInt(height.toString(), 0) : this.buttonSize.height;

		const StateAnimates: { [stateName: string]: Animated.Value } = {};
		let index = 1;
		for (const stateName in this.state.states) {
			if (this.state.states.hasOwnProperty(stateName)) {
				const state = this.state.states[stateName];
				if (!this.state.states[this.state.selectedState])
					this.state = {
						...this.state,
						selectedState: stateName
					};

				if (stateName === this.state.selectedState)
					StateAnimates[stateName] = this.state.startAnimationEnable ?
						new Animated.Value(-this.buttonSize.height * index) : new Animated.Value(-this.buttonSize.height * (index - 1));
				else
					StateAnimates[stateName] = new Animated.Value(-this.buttonSize.height * index);

				this.state.states[stateName] = {
					...defaultButtonState,
					...this.state.states[stateName],
					_index: index,
					buttonInsideContainerStyle: {
						...defaultButtonState.buttonInsideContainerStyle,
						...this.state.states[stateName].buttonInsideContainerStyle
					}
				};

				if (this.state.backgroundAnimation === 'animated')
					this.state.states[stateName]._backgroundColor =
						this.state.states[stateName].buttonInsideContainerStyle.backgroundColor ||
						this.state.buttonInsideContainerStyle.backgroundColor;
				else
					this.state.states[stateName]._backgroundColor = 'rgba(0,0,0,0)';

				index++;
			}
		}

		this.stateLength = index - 1;

		this.state = {
			...this.state,
			onPressAnimate: new Animated.Value(1),
			stateAnimates: StateAnimates
		};
	}

	public componentWillMount(): void {
		this.prevState = this.state.states[this.state.selectedState];
		this.nextState = this.state.states[this.state.selectedState];
	}

	public componentDidMount(): void {
		if (this.state.startAnimationEnable) {
			const keys = Object.keys(this.state.states);
			const index = keys.lastIndexOf(this.state.selectedState);
			Animated.timing(
				this.state.stateAnimates[this.state.selectedState],
				{
					delay: this.state.startAnimationDelay,
					duration: this.state.startAnimationDuration,
					easing: this.state.animationEasing,
					toValue: - this.buttonSize.height * index
				}
			).start();
		}
	}

	public componentWillReceiveProps(nextProps: IButton.IProps): void {
		if (nextProps.selectedState && this.state.selectedState !== nextProps.selectedState) {
			const keys = Object.keys(this.state.states);
			let oneState = false;
			if (keys.lastIndexOf(nextProps.selectedState) < 0) oneState = true;

			const prevStateName = this.state.selectedState;
			const nextStateName = oneState ? this.state.selectedState : nextProps.selectedState;
			this.setState({
				selectedState: nextStateName
			});

			const prevState = this.state.states[prevStateName];
			const nextState = this.state.states[nextStateName];

			this.prevState = prevState;
			this.nextState = nextState;

			if (oneState) {
				if (this.state.onPressAnimationEnable)
					return;
			}
			else
				Animated.sequence([
					Animated.parallel([
						Animated.timing(
							this.state.stateAnimates[prevStateName],
							{
								delay: this.state.animationDelay,
								duration: this.state.animationDuration,
								easing: this.state.animationEasing,
								toValue: prevState._index === 1 ?
									this.buttonSize.height :
									prevState._index === 2 ?
									0 :
									- this.buttonSize.height * (prevState._index - 2)
							}
						),
						Animated.timing(
							this.state.stateAnimates[nextProps.selectedState],
							{
								delay: this.state.animationDelay,
								duration: this.state.animationDuration,
								easing: this.state.animationEasing,
								toValue: - this.buttonSize.height * (nextState._index - 1)
							}
						)
					]),
					Animated.timing(
						this.state.stateAnimates[prevStateName],
						{
							delay: 0,
							duration: 0,
							easing: this.state.animationEasing,
							toValue: - this.buttonSize.height * prevState._index
						}
					)
				]).start();
		}
	}

	public shouldComponentUpdate(nextProps: IButton.IProps): boolean {
		if (nextProps.selectedState && this.state.selectedState !== nextProps.selectedState)
			return true;

		return false;
	}

	public render(): JSX.Element {
		this.serializeProps(true);

		const backgroundAnimation = this.state.stateAnimates[this.state.selectedState].interpolate({
			inputRange: [-this.buttonSize.height * this.nextState._index, -this.buttonSize.height * (this.nextState._index - 1)],
			outputRange: [
				this.state.backgroundAnimation === 'animated' ?
					this.getHexColor(this.nextState._backgroundColor) :
					this.getHexColor(this.prevState._backgroundColor),
				this.getHexColor(this.nextState._backgroundColor)
			]
		});

		return this.renderTouchable(
			<Animated.View
				style={[
					this.state.buttonContainerStyle,
					{
						backgroundColor: backgroundAnimation,
						height: this.buttonSize.height
					},
					this.state.onPressAnimationType === 'button' ? {
						transform: [{
							scale: this.state.onPressAnimate
						}]
					} : {}
				]}
			>
				{this.renderButtonContainer()}
			</Animated.View>
		);
	}

	private renderTouchable(children: JSX.Element): JSX.Element {
		if (this.state.touchFeedback)
			return (
				<TouchableOpacity
					accessibilityLabel={this.state.accessibilityLabel}
					onPress={this.onPressButton.bind(this)}
					delayPressIn={this.state.touchFeedbackDelay}
				>
					{children}
				</TouchableOpacity>
			);

		return (
			<TouchableWithoutFeedback
				accessibilityLabel={this.state.accessibilityLabel}
				onPress={this.onPressButton.bind(this)}
			>
				{children}
			</TouchableWithoutFeedback>
		);
	}

	private renderButtonContainer(): Array<JSX.Element> {
		const containers: Array<JSX.Element> = [];

		for (const stateName in this.state.states) {
			if (this.state.states.hasOwnProperty(stateName)) {
				const state = this.state.states[stateName];

				containers.push(
					<Animated.View
						key={`ReactNativeAnimetableButtonInsideContainer_${stateName}`}
						style={[
							this.state.buttonInsideContainerStyle,
							state.buttonInsideContainerStyle,
							{ height: this.buttonSize.height },
							{
								transform: [
									{
										translateY: this.state.stateAnimates[stateName]
									},
									this.state.onPressAnimationType === 'inside' ? {
										scale: this.state.onPressAnimate
									} : {
										scale: 1
									}
								]
							},
							this.state.backgroundAnimation === 'animated' ?
								{
									backgroundColor: 'rgba(0,0,0,0)'
								} :
								{}
						]}
					>
						{this.state.renderButtonInside(state)}
					</Animated.View>
				);
			}
		}

		return containers;
	}

	private renderButtonInside(state: IButton.IButtonState): Array<JSX.Element> {
		const activeState = state || this.state.states[this.state.selectedState];
		const buttonInside: Array<JSX.Element> = [];

		if (activeState.iconPosition === 'left')
			buttonInside.push(activeState.renderIcon(activeState));

		buttonInside.push(activeState.renderText(activeState));

		if (activeState.iconPosition === 'right')
			buttonInside.push(activeState.renderIcon(activeState));

		return buttonInside;
	}

	private renderIcon(activeState: IButton.IButtonState): JSX.Element {
		if (activeState.icon === undefined) return;

		const {
			buttonIconContainer_Icon
		} = Styles;

		const iconAnimation = this.state.stateAnimates[this.state.selectedState].interpolate({
			inputRange: [-this.buttonSize.height * activeState._index, -this.buttonSize.height * (activeState._index - 1)],
			outputRange: [
				activeState.syncIconAndTextAnimation || activeState._index !== this.nextState._index ?
					0 :
					(this.buttonSize.height / 100) * - activeState.asyncIconAndTextAnimationDiff,
				0
			]
		});

		if (activeState.spinner)

			return activeState.renderSpinner(activeState);

		else
			return (
				<Animated.Image
					key="reactNativeAnimetableButton_Icon"
					style={[
						buttonIconContainer_Icon,
						this.state.iconStyle,
						activeState.iconStyle,
						{
							transform: [{
								translateY: iconAnimation
							}]
						}
					]}
					source={activeState.icon}
				/>
			);
	}

	private renderText(activeState: IButton.IButtonState): JSX.Element {
		return (
			<Text style={[
				Styles.textStyle,
				this.state.textStyle,
				activeState.textStyle
			]}
				key="reactNativeAnimetableButton_Text"
			>
				{activeState.text}
			</Text>
		);
	}

	private renderSpinner(state: IButton.IButtonState): JSX.Element {
		return (
			<ActivityIndicator
				key={`reactNativeAnimetableButton_Spinner_${state._index}`}
				{...this.state.spinnerProps}
				{...state.spinnerProps}
			/>
		);
	}

	private onPressButton(event: GestureResponderEvent): void {
		if (this.state.disabled) return;
		const activeState = this.state.states[this.state.selectedState];

		let couldCallMasterPress = true;
		if (typeof activeState.onPress === 'function')
			couldCallMasterPress = activeState.onPress(event, activeState) as boolean;

		if (couldCallMasterPress && this.state.onPress)
			this.state.onPress(event, activeState);

		Animated.sequence([
			Animated.timing(
				this.state.onPressAnimate,
				{
					delay: this.state.animationDelay,
					duration: this.state.animationDuration / 4,
					easing: this.state.animationEasing,
					toValue: this.state.onPressAnimationScaleValue
				}
			),
			Animated.timing(
				this.state.onPressAnimate,
				{
					delay: this.state.animationDelay,
					duration: this.state.animationDuration / 4,
					easing: this.state.animationEasing,
					toValue: 1
				}
			)
		]).start();
	}

	private onLongPressButton(event: GestureResponderEvent): void {
		if (this.state.disabled) return;
		const activeState = this.state.states[this.state.selectedState];

		let couldCallMasterPress = true;
		if (typeof activeState.onLongPress === 'function')
			couldCallMasterPress = activeState.onLongPress(event, activeState) as boolean;

		if (couldCallMasterPress && this.state.onLongPress)
			this.state.onLongPress(event, activeState);
	}

	private serializeProps(callFromRender: boolean = false): { defaultProps: IButton.IProps, defaultButtonState: IButton.IButtonState } {
		const defaultButtonState: IButton.IButtonState = {
			buttonInsideContainerStyle: {
				alignItems: 'center',
				backgroundColor: 'rgba(0,0,0,0)',
				flexDirection: 'row',
				height: ButtonSize.height,
				justifyContent: 'center',
				overflow: 'hidden',
				paddingHorizontal: 10
			},

			icon: undefined,
			iconPosition: 'left',
			iconStyle: {},

			text: '',
			textStyle: {},

			spinner: false,
			spinnerProps: {},

			renderButtonInside: this.renderButtonInside.bind(this),
			renderIcon: this.renderIcon.bind(this),
			renderSpinner: this.renderSpinner.bind(this),
			renderText: this.renderText.bind(this),

			onLongPress: () => true,
			onPress: () => true,

			asyncIconAndTextAnimationDiff: 50,
			syncIconAndTextAnimation: false

		};

		const defaultProps: IButton.IProps = {
			...defaultButtonState,
			accessibilityLabel: 'reactNativeAnimetableButton',
			buttonContainerStyle: {
				backgroundColor: 'rgba(0,0,0,0)',
				borderRadius: 5,
				borderWidth: 1,
				height: ButtonSize.height,
				overflow: 'hidden'
			},

			disabled: false,
			touchFeedback: true,
			touchFeedbackDelay: 0,

			selectedState: 'default',
			states: {
				default: {
					text: '___MUSTBEINITALIZE___'
				} as IButton.IProps
			},

			animationDelay: 0,
			animationDuration: 400,
			animationEasing: Easing.bezier(0.4, 0.2, 0.4, 1.3),
			onPressAnimationEnable: true,
			onPressAnimationScaleValue: 1.05,
			onPressAnimationType: 'button',

			startAnimationDelay: 0,
			startAnimationDuration: 300,
			startAnimationEnable: true,

			backgroundAnimation: 'animated'
		};

		return {
			defaultButtonState,
			defaultProps
		};
	}

	private getHexColor(willConvert: string): string {
		const color = tinycolor(willConvert);

		return color.toRgbString();
	}
}
