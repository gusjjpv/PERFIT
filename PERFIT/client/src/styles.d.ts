import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        orange: string;
        black: string;
        gray: string;
        yellow: string;
        white: string;
        red: string;
        blue: string;
        green: string;
      };
      background: {
        main: string;
      };
    };
  }
}
