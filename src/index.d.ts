import { IButton } from './IButton';
import * as React from 'react';	
import * as RN from 'react-native';

declare module "react-native-animatable-button" {
	export interface ButtonStatic extends RN.NativeMethodsMixin, React.ComponentClass<IButton.IProps> { }
	
	export var Button: ButtonStatic;
	export type Button = ButtonStatic;
}
