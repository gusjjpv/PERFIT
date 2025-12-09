import styled from "styled-components";
import { FaEdit, FaInfoCircle, FaClipboardList, FaCog } from "react-icons/fa"; 
import { useContext, useEffect, useState } from "react";
import Footer from "../Footer";
import StudentInfo from "../../molecules/StudentInfo";
import { LoadingContext } from "../../../context/LoadingContext";
import Loading from "../../../animation/loading";
import Input from "../../atoms/Input";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessTokenInLocalStorage } from "../../../storage/LocalStorage";
import type { StudentData } from "../../../types";
import { success } from "../../../utils/toastfy";
import Button from "../../atoms/Button";
import { SignCreateStudentContext } from "../../../context/SignCreateStudentContext";
import { UserContext } from "../../../context/UserContext";
import { Logout } from "../../../auth/auth";
import { Container } from "../../../styles/styles";
import { OverlayContext } from "../../../context/OverlayContext";
import ConfirmModal from "../../molecules/ConfirmModal";
import MonitorHealth from "../../molecules/MonitorHealth";
import GenericPhoto from "/generic-photo.png";

interface StudentProps {
  weight: number, 
  height: number, 
  bmi: string, 
  idade: number,
  goal: string, 
  data_nascimento: string,
  profession: string, 
  healthProblem: string
}

interface StudentInfoStyle {
  $chosenSection: boolean
}

const ContainerSecond = styled.div`
  display: flex;
  flex-direction: column; 
  width: 95%;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  padding: 1rem; 
  margin: auto;
`;

const TopSection = styled.div`
  display: flex;
  align-items: flex-start; 
  gap: 1rem; 
  margin-bottom: 1rem; 
  position: relative; 
`;

const Avatar = styled.div`
  width: 80px; 
  height: 80px; 
  border-radius: 50%; 
  background-image: url(${GenericPhoto});
  background-size: contain;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column; 
  flex-grow: 1;
  min-width: 0; 
  gap: .5rem;
  
  h2 {
    font-size: 1.5rem;
    margin: 0 0 0.2rem 0;
    font-weight: bold;
    color: #333;
  }

  p {
    overflow-y: auto;
    max-height: 5rem;
    font-size: 0.95rem;
    margin: 0;
    color: #666;
    line-height: 1.3;
  }
`;

const EditIcon = styled.div`
  position: absolute; 
  top: 0; 
  right: 0; 
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
`;

const BottomIcons = styled.div`
  display: flex;
  justify-content: flex-start; 
  align-items: center;
  gap: 1.5rem;
  padding-top: 1rem; 
  border-top: 1px solid #eee; 
`;

const IconWrapper = styled.div<StudentInfoStyle>`
  font-size: 1.5rem; 
  color: ${({ theme, $chosenSection }) => $chosenSection ? `${theme.colors.primary.orange}` : '#888'};
  cursor: pointer;
`;

const ConfigContainer = styled.div`
  margin-left: auto;
`;

const ContainerBtns = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const WarmingSoon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
`


export default function Student() {
  const [chosenSection, setChosenSection] = useState<string>('info');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [goal, setGoal] = useState<string>('');
  const [student, setStudent] = useState<StudentData>();
  const [ name, setName ] = useState<string>('')
  const [ desactiveStudent, setDesactiveStudent ] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [reloadStudentInfo, setReloadStudentInfo] = useState(false); 

  
  const { id } = useParams<string>();
  const navigate = useNavigate();
  
  const { loading, setLoading } = useContext(LoadingContext);
  const { setSignStudent } = useContext(SignCreateStudentContext);
  const { user } = useContext(UserContext)
  const { isOverlay } = useContext(OverlayContext)

  //console.log("ID:", id)
  //console.log(user)

  const handleSection = (newSection: string) => {
    setChosenSection(newSection);
  };

  const toogleEdition = () => {
    setIsEdit((prev) => !prev);
  };

  const updateUser = async () => {
    const accessToken = getAccessTokenInLocalStorage()

      if(name) {
        try {
          const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ user: {
              first_name: name
            } }),
          });

          if(response.ok) {
            const data = await response.json()
            setName(data.data.user.first_name)
            //console.log('ESSE DATA:', data)
          } else {
            const data = await response.json()
            console.log("Error fetching", data)
          }
      } catch(err) {
        console.log("Internal error: ", err)
      }
    }
  }

  useEffect(() => {
    if (!id) return;

    const fetchStudentData = async () => {
      setLoading(true);
      const accessToken = getAccessTokenInLocalStorage();
      
      try {
        const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${accessToken}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudent(data);
          setName(data.user.first_name);
          //console.log("DATA REAL: ", data)
        } else {
          console.error("Falha ao buscar dados do aluno.");
        }
      } catch (error) {
        console.error("Erro interno ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, setLoading]);

  const getInfo = async () => {
    const accessToken = getAccessTokenInLocalStorage();

    try {
      const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/ficha/`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.log("Internal Error: ", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const patchStudent = async ({ weight, height, bmi, goal, idade, data_nascimento, profession, healthProblem }: StudentProps) => {
    const accessToken = getAccessTokenInLocalStorage();
    
    try {
      const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/ficha/`, {
        method: 'PATCH',
        headers: { 
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          peso: weight,
          altura: height,
          imc: bmi,
          idade,
          data_nascimento,
          objetivo: goal,
          profissao: profession,
          problema_saude: healthProblem
        }),
      });

      if (response.ok) {
        await response.json();
        success("Dados atualizados!");
      } else {
        const data = await response.json();
        console.error("Falha ao buscar dados do aluno.", data);
      }
    } catch (error) {
      console.error("Erro interno ao buscar dados:", error);
    }
  };

  const deleteStudent = async () => {
    const accessToken = getAccessTokenInLocalStorage()
    
    try {
      const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        success(data.message);
        setSignStudent(prev => !prev);
        navigate('/personal');
      } else {
        const data = await response.json();
        console.error("Falha ao deletar aluno.", data);
      }
    } catch (error) {
      console.error("Erro interno ao buscar dados:", error);
    }
  }

  const handleDesactiveStudent = async () => {
    const accessToken = getAccessTokenInLocalStorage()
    
    try {
      const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ativo: desactiveStudent})
      });

      if (response.ok) {
        const data = await response.json();
        success(data.message);
        setSignStudent(prev => !prev);
        setDesactiveStudent(prev => !prev)
      } else {
        const data = await response.json();
        console.error("Falha ao deletar aluno.", data);
      }
    } catch (error) {
      console.error("Erro interno ao buscar dados:", error);
    }
  };

/*   useEffect(() => {
    const reloadInfo = async () => {
      try {
        const response = await getInfo()
        console.log("RESPOSTA", response)
        setGoal(response.goal)
        

      } catch(err) {
        console.log("Internal error: ", err)
      }
    }

    reloadInfo()
  }, []) */

  return (
    <>
      <Container $overlay={isOverlay}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {student && (
              <ContainerSecond>
                <TopSection>
                  <Avatar />

                  <TextContent>
                    {isEdit ? (
                      <Input
                          id="1"
                          type="text"
                          placeholder="Nome do aluno"
                          value={name}
                          padding="1rem 0.5rem 3rem .5rem"
                          onChange={(e) => setName(e.target.value)} minLength={3} maxLength={20} required={false}                      />
                    ) : (
                      <h2>{name}</h2>
                    )}

                    {isEdit ? (
                      <Input
                        id="0"
                        type="textarea"
                        placeholder="Qual o objetivo?"
                        disabled={!isEdit}
                        padding="0.5rem 0.5rem 3rem .5rem"
                        isTextarea="textarea"
                        value={goal}
                        minLength={undefined} 
                        maxLength={50} 
                        required={false}
                        onChange={(e) => setGoal(e.target.value)}
                      />
                    ) : (
                      <p>{goal?.trim() ? goal : "Qual o objetivo?"}</p>
                    )}
                  </TextContent>
                  {user?.role === 'professor' && (
                    <EditIcon>
                      <FaEdit onClick={toogleEdition} />
                    </EditIcon>
                  )}
                </TopSection>

                <BottomIcons>
                  <IconWrapper $chosenSection={chosenSection === 'info'} onClick={() => handleSection('info')}>
                    <FaInfoCircle />
                  </IconWrapper>
                  {user?.role === 'professor' && (
                    <IconWrapper $chosenSection={chosenSection === 'a.v.'} onClick={() => handleSection('a.v.')}>
                      <FaClipboardList /> 
                    </IconWrapper>
                  )}

                  <ConfigContainer>
                    <IconWrapper $chosenSection={chosenSection === 'config'} onClick={() => handleSection('config')}>
                      <FaCog /> 
                    </IconWrapper>
                  </ConfigContainer>
                </BottomIcons>
              </ContainerSecond>
            )}
            
            {chosenSection === 'info' && (
              <StudentInfo
                goal={goal}
                setGoal={setGoal}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                disabled={!isEdit}
                patchUser={patchStudent}
                updateUser={updateUser}
                getInfo={getInfo}
                reloadStudentInfo={reloadStudentInfo}
                setReloadStudentInfo={setReloadStudentInfo}
              />
            )}

            {user?.role === 'professor' && chosenSection === 'a.v.' && (
              <MonitorHealth isEdit={isEdit} />
            )}

            {chosenSection === 'config' && (
              <ContainerBtns>
                {user?.role === 'professor' ? (
                  <>
                    <Button color="primary" width="10rem" onClick={() => setOpenDeleteModal(true)}>
                      Excluir
                    </Button>

                    <Button gradient={true} onClick={handleDesactiveStudent} width="10rem">
                      {desactiveStudent ? 'Desativado' : 'Ativo'}
                  </Button>
                  </>
                ) : (
                  <Button width="10rem" onClick={Logout}>
                    Logout
                  </Button>
                )}
              </ContainerBtns>
            )}
          </>
        )}
      </Container>

      {/* MODAL DE CONFIRMAÇÃO */}
      {openDeleteModal && (
        <ConfirmModal title="Excluir aluno?" text="Deseja realmente" strongText="excluir permanentemente" endText="este aluno?" setState={setOpenDeleteModal} func={deleteStudent} />
      )}

      <Footer />
    </>
  );
}
