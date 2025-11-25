import styled from "styled-components"
import { IoPeople } from "react-icons/io5";
import Input from "../../atoms/Input";
import { IoSearchSharp } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../../context/LoadingContext";
import Loading from "../../../animation/loading";
import type { HomePersonalProps } from "../../../types";
import { useNavigate } from "react-router-dom";


const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const WrapperTitle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: .5rem;
    width: 100%;
    padding-left: 1rem;
    margin-bottom: 1.5rem;

    svg {
        height: 34px;
        width: 34px;
    }

    h2 {
        font-size: 1.8rem;
    }
`

const WrapperStudents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 1rem;
    max-height: calc(100vh - 260px); 
    overflow-y: scroll;
    margin-top: 3rem;
    margin-bottom: 2rem; 
    padding-bottom: 1rem; 
`

const ContainerStudents = styled.div`
    display: flex; 
    justify-content: flex-start; 
    align-items: center;
    width: 90%;
    padding: .5rem 1rem;
    height: 60px; 
    position: relative; 
    border: 1px solid #00000030;
    border-radius: 8px;
    box-shadow: 0px 0px 1px 1px #00000030;
    cursor: pointer;
`

const ImageWrapper = styled.div`
    max-width: 60px; 
    height: 100%;
    display: flex;
    align-items: center;
    z-index: 2; 

    img {
        width: 100%;
        height: auto;
    }
`

const WrapperName = styled.p`
    position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    font-weight: bold;
    margin: 0; 
    white-space: nowrap;
    font-size: 1.1rem;
    font-weight: 600;
    z-index: 1; 
`

export default function HomePersonal({ students } : HomePersonalProps) {
    const { loading, setLoading } = useContext(LoadingContext)
    const [ filterByName, setFilterByName ] = useState<string>('')
    const navigate = useNavigate()

    const filteredStudent = students?.filter((el) => el.user.first_name.toLowerCase().includes(filterByName.toLowerCase()) ?? students)

    const handleStudentClick = (studentId: number) => {
        navigate(`/aluno-info/${studentId}`); 
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <Container>
        <WrapperTitle>
            <IoPeople />
            <h2>Alunos(a)</h2>
        </WrapperTitle>

        <Input id="0" type="text" placeholder="Pesquise pelo nome" width={90} icon={<IoSearchSharp />} onChange={(e) => setFilterByName(e.target.value)} />
        {loading ? (
            <Loading />
        ) : (
            <>
                <WrapperStudents>
                    {students && filteredStudent && Array.isArray(filteredStudent) && filteredStudent.map(( item, index ) => (
                        <ContainerStudents key={index} onClick={() => handleStudentClick(item.user.id)}>
                            <ImageWrapper>
                                {/* <img loading="lazy" src={item.image} alt={item.name} /> */}
                            </ImageWrapper>
                            
                            <WrapperName>{item.user.first_name}</WrapperName>
                            
                        </ContainerStudents>
                    ))}

                    {students?.length === 0 && (
                        <h2>Não há alunos(a)</h2>
                    )}
                </WrapperStudents>
            </>
        )}

    </Container>
  )
}