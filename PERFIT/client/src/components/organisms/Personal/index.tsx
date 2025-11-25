import styled from "styled-components";
import HomePersonal from "../../molecules/HomePersonal";
import Footer from "../Footer";
import { useContext, useEffect, useState } from "react";
import { getAccessTokenInLocalStorage } from "../../../storage/LocalStorage";
import type { StudentData } from "../../../types";
import { SignCreateStudentContext } from "../../../context/SignCreateStudentContext";

const Container = styled.div`
  position: absolute;
  //height: 650px;
  height: 95%;
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
  const [ students, setStudents ] = useState<StudentData[] | null>(null)
  const { signStudent } = useContext(SignCreateStudentContext)

  useEffect(() => {
    const getStudents = async () => {
      const accessToken = getAccessTokenInLocalStorage()
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/alunos/', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${accessToken}`
          },
        })
  
        if(response.ok) {
          const data = await response.json()
          console.log(data)
          setStudents(data)
        } else {
          const data = await response.json()
          console.log(data)
        }
      } catch(error) {
        console.log("Internal Error: " + error)
      }
    }

    getStudents()
  }, [signStudent])

  return (
    <>
      <Container>
        <HomePersonal students={students} />
      </Container>

      <Footer />
    </>
  )
}

