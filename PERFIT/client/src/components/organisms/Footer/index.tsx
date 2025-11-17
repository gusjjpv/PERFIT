import styled from 'styled-components'
import { MdHome } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";

const Container = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 100%;
    background-color: white;
    border: 1px solid black;
    border-radius: 5px;
    padding: .6rem;
    z-index: 999;

    ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        list-style: none;
        gap: .2rem;

        svg {
            height: 34px;
            width: 34px;
        }
    }
`

export default function Footer() {
  return (
    <Container>
        <ul>
            <MdHome />
            <li>Início</li>
        </ul>

        <ul>
            <FaPlusCircle />
            <li>Novo aluno(a)</li>
        </ul>

        <ul>
            <GiWeightLiftingUp />
            <li>Treinos</li>
        </ul>
    </Container>
  )
}