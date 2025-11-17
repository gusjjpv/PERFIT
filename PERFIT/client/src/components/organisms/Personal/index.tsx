import styled from "styled-components";
import HomePersonal from "../../molecules/HomePersonal";
import Footer from "../Footer";

const Container = styled.div`
  position: absolute;
  height: 650px;
  width: 95%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border: 1px solid black;
  border-radius: 10px;
  padding: 2.5rem 0;

  @media (min-width: 768px) {
    max-width: 50%;
  }
`

export default function Personal() {

  const students = [
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'},
    {image: '/logo.png', name: 'Fulano'}
  ]

  return (
    <>
      <Container>
        <HomePersonal students={students} />
      </Container>

      <Footer />
    </>
  )
}

