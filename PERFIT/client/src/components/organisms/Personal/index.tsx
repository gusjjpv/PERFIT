import HomePersonal from "../../molecules/HomePersonal";
import Footer from "../Footer";
import { useContext, useEffect, useState } from "react";
import { cleanLocalStorage, getAccessTokenInLocalStorage } from "../../../storage/LocalStorage";
import type { StudentData } from "../../../types";
import { SignCreateStudentContext } from "../../../context/SignCreateStudentContext";
import { Container } from "../../../styles/styles";
import { OverlayContext } from "../../../context/OverlayContext";


export default function Personal() {
  const [ students, setStudents ] = useState<StudentData[] | null>(null)
  const { signStudent } = useContext(SignCreateStudentContext)
  const { isOverlay } = useContext(OverlayContext)

  useEffect(() => {
    const getStudents = async () => {
      const accessToken = getAccessTokenInLocalStorage()
      try {
        const response = await fetch('https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/', {
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
      <Container $overlay={isOverlay}>
        <HomePersonal students={students} />
      </Container>

      <Footer />
    </>
  )
}

