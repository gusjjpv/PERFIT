import { createGlobalStyle } from "styled-components";

interface ContainerStyleConfig {
    $overlay: boolean
}


export const GlobalStyles = createGlobalStyle<ContainerStyleConfig>`
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    body {
        background-image: url(/bg.png);
        background-size: fill;
        background-color: ${({ $overlay }) => $overlay ? '#ffffff5b' : '#ffffff'};
    }

    a {
        text-decoration: none;
        color: unset;
    }
`