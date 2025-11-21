import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    body {
        background-image: url(/bg.png);
        background-size: fill;
    }

    a {
        text-decoration: none;
        color: unset;
    }
`