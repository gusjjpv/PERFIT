import styled from "styled-components";

interface ContainerStyleConfig {
    $overlay: boolean
}

export const Container = styled.div<ContainerStyleConfig>`
  position: absolute;
  height: 100%;
  width: 95%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ $overlay }) => $overlay ? '#ffffff5b' : '#ffffff'};
  border: 1px solid black;
  border-radius: 10px;
  padding: 2.5rem 0;
  pointer-events: ${({ $overlay }) => $overlay ? 'none' : 'auto'};

  @media (min-width: 768px) {
    max-width: 50%;
  }
`