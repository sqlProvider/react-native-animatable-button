import {
	ImageStyle,
	StyleSheet,
	TextStyle,
	ViewStyle
} from 'react-native';

export const ButtonSize = {
	height: 40
};

export const Styles = StyleSheet.create({
	buttonIconContainer_Icon: {
		flex: 1,
		resizeMode: 'contain'
	} as ImageStyle,

	textStyle: {
		paddingHorizontal: 5
	} as TextStyle
});
