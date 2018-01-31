import {
	ActivityIndicatorProperties,
	Animated,
	EasingFunction,
	GestureResponderEvent,
	ImageStyle,
	ImageURISource,
	ViewStyle,
	TextStyle
} from 'react-native';

export module IButton {
	export interface IProps extends IButtonState {
		// Container Settings
		accessibilityLabel?: string;
		buttonContainerStyle?: ViewStyle & Array<ViewStyle>;
		
		// State Settings
		selectedState?: string;
		states?: {
			[key: string]: IButtonStateWithPrivate;
		};

		// Touchable Settings
		disabled?: boolean;
		touchFeedback?: boolean;
		touchFeedbackDelay?: number;

		// Global Animation Settings
		animationDelay?: number;
		animationDuration?: number;
		animationEasing?: EasingFunction;
		onPressAnimationEnable?: boolean;
		onPressAnimationScaleValue?: number;
		onPressAnimationType?: 'button' | 'inside';
		
		// Start Animation Settings
		startAnimationDelay?: number;
		startAnimationDuration?: number;
		startAnimationEnable?: boolean;

		// Background Animation Settings
		backgroundAnimation?: 'animated' | 'slide';
	}

	export interface IState extends IProps {
		onPressAnimate?: Animated.Value;
		stateAnimates?: {
			[key: string]: Animated.Value;
		}
	}

	export interface IButtonState {
		// Container Settings
		buttonInsideContainerStyle?: ViewStyle & Array<ViewStyle>;

		// Icon Settings
		icon?: ImageURISource | any;
		iconStyle?: Array<ImageStyle> | ImageStyle;
		iconPosition?: 'left' | 'right'; 
		
		// Text Settings
		text: string;
		textStyle?: Array<TextStyle> | TextStyle;
		
		// Spinner Settings
		spinner?: boolean;
		spinnerProps?: ActivityIndicatorProperties;

		// Icon & Text Animation Diff
		syncIconAndTextAnimation?: boolean;
		asyncIconAndTextAnimationDiff?: number;

		// Renderers
		renderButtonInside?(state: IButtonState): JSX.Element;
		renderIcon?(state: IButtonState): JSX.Element;
		renderSpinner?(state: IButtonState): JSX.Element;
		renderText?(state: IButtonState): JSX.Element;

		// Events
		onLongPress?(event?: GestureResponderEvent, activeState?: IButtonState): boolean | void;
		onPress?(event?: GestureResponderEvent, activeState?: IButtonState): boolean | void;
	}

	export interface IButtonStateWithPrivate extends IButtonState {
		// Private
		_index?: number;
		_backgroundColor?: string;
	}

	export interface ISerializeProps {
		defaultProps: IProps;
		defaultButtonState: IButtonStateWithPrivate;
	}
}