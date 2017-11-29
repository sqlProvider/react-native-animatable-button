import { IButton } from './IButton';
import * as React from 'react';	
import * as RN from 'react-native';

declare module "react-native-animatable-button" {
	export interface ButtonStatic extends RN.NativeMethodsMixin, React.ComponentClass<IButton.IProps> { }
	
	var Button: ButtonStatic;
	type Button = ButtonStatic;

	export default Button;
}
