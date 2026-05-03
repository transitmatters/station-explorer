declare module 'react-toggle-dark-mode' {
  import type { CSSProperties, FunctionComponent } from 'react';

  export interface DarkModeSwitchProps {
    onChange: (checked: boolean) => void;
    checked: boolean;
    size?: number | string;
    style?: CSSProperties;
    animationProperties?: unknown;
    moonColor?: string;
    sunColor?: string;
    className?: string;
  }

  export const DarkModeSwitch: FunctionComponent<DarkModeSwitchProps>;
}
