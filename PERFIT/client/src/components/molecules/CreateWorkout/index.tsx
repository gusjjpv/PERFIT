import { useEffect, useState, type ChangeEvent, type MouseEvent, type FormEvent, useContext } from 'react';
import styled, { css, keyframes } from 'styled-components'
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import { getAccessTokenInLocalStorage } from '../../../storage/LocalStorage'; 
import type { StudentData } from '../../../types'; 
import { error, success } from '../../../utils/toastfy';
import { OverlayContext } from '../../../context/OverlayContext';

interface ExerciseApi {
  id?: number; 
  nome: string;
  series: number;
  repeticoes: string;
  descanso: string;
  observacao: string;
}

interface DailyWorkoutApi {
  id?: number; 
  dia_semana: string; 
  titulo: string;
  descricao: string;
  ordem: number;
  exercicios: ExerciseApi[];
}

interface WorkoutPlanApi { 
  id: number; 
  aluno: number; 
  nome: string;
  data_fim: string; 
  ativa: boolean;
  observacoes: string;
  treinos: DailyWorkoutApi[];
}

interface SelectedStudent {
  id: number;
  name: string;
}

interface WorkoutPlanState {
    alunoId: number | null; 
    workoutName: string;
    endDate: string;
    isActive: boolean;
    obs: string;
    dailyWorkouts: DailyWorkoutApi[]; 
}

interface NewDayState {
    dia_semana: string,
    titulo: string,
    descricao: string,
    isAddingExercise: boolean, 
}

interface WorkoutProps {
    isModalWorkout: boolean,
    setIsModalWorkout: React.Dispatch<React.SetStateAction<boolean>>,
    workoutId?: number; 
}
 
const slideUp = keyframes`
  from {
    transform: translate(-50%, 100vh); 
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0%); 
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translate(-50%, 0%); 
    opacity: 1;
  }
  to {
    transform: translate(-50%, 100vh); 
    opacity: 0;
  }
`;

interface CreateStudentStyleProps { $isModal: boolean, $offAnimation: boolean }

const Container = styled.div<CreateStudentStyleProps>`
  position: fixed; 
  height: 85%; 
  overflow-y: auto; 
  will-change: transform;
  top: 10%; 
  left: 50%;    
  transform: translate(-50%, 0%); 
  width: 95%;
  background-image: linear-gradient(292deg, #ffffff, #e1e1e1);
  border: 1px solid #0000003d;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  z-index: 10;
  padding-bottom: 2rem;

${({ $isModal, $offAnimation }) => {
  if ($offAnimation) {
    return css`
      animation: ${slideDown} 0.3s ease-in forwards;
      opacity: 1;
      pointer-events: auto;
    `;
  } 
  else if ($isModal) { 
    return css`
      animation: ${slideUp} 0.3s ease-out forwards;
      opacity: 1;
      pointer-events: auto;
    `;
  }
  return '';
}}

  h2 {
    font-weight: 700;
    padding: 1rem 0 0 0.5rem;
  }
  h3 {
    padding-left: 0.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: #1E90FF;
  }

  @media (min-width: 768px) {
    max-width: 50%;
  }
`

const ContainerCloseModalBtn = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const ContainerForm = styled.form` 
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 1rem;

  div {
    margin-bottom: .5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`
const ContainerFields = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
`

const ContainerDailyWorkout = styled(ContainerFields)`
  padding: 1rem 0.5rem;
  border: 1px dashed #1E90FF;
  margin-bottom: 1.5rem;
  
  h4 {
    margin-bottom: 0.5rem;
    color: #32CD32;
    padding-left: 0.5rem;
  }
`

const StyledLabel = styled.label`
  background-image: linear-gradient(to bottom, #1E90FF, #32CD32);
  -webkit-background-clip: text; 
  background-clip: text;
  font-weight: 700;
  color: transparent;
  width: 90%;
  text-align: left;
  margin: 0 auto .3rem auto;
`
const StyledSelect = styled.select`
  width: 90%;
  padding: 0.5rem 0.5rem .6rem .5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`
const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto 1.2rem auto;

  & > * {
    width: 100%; 
  }
`
const StudentModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  max-height: 80%;
  padding: 1rem;
  background: white;
  border: 1px solid #1E90FF;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 15;
  overflow-y: auto;
`;

const StudentItem = styled.div`
  padding: 0.75rem 0 3rem 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 5px;
  right: 10px;
`


export default function CreateWorkout({ isModalWorkout, setIsModalWorkout, workoutId } : WorkoutProps) {
  const [offAnimation, setOffAnimation] = useState<boolean>(false);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false); 
  const [isWorkoutLoading, setIsWorkoutLoading] = useState(!!workoutId); 
  
  const [workoutData, setWorkoutData] = useState<WorkoutPlanState>({
    alunoId: null, 
    workoutName: '', 
    endDate: '', 
    isActive: true, 
    obs: '', 
    dailyWorkouts: [] 
  });

  const [newDay, setNewDay] = useState<NewDayState>({
      dia_semana: '',
      titulo: '',
      descricao: '',
      isAddingExercise: false, 
  });

  const [newExercise, setNewExercise] = useState<ExerciseApi>({
    nome: '',
    series: 0,
    repeticoes: '',
    descanso: '',
    observacao: ''
  });

  const [students, setStudents] = useState<StudentData[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<SelectedStudent | null>(null);

  const { setIsOverlay } = useContext(OverlayContext)

  const closeModal = () => {
    setOffAnimation(true);
    setIsOverlay(false)
  }

  // Efeito para fechar o modal após a animação de slideDown
  useEffect(() => {
    const timer = setTimeout(() => {
      if(offAnimation) {
        setIsModalWorkout(false);
        setOffAnimation(false);
      }
    }, 300); 

    return () => clearTimeout(timer);
  }, [offAnimation, setIsModalWorkout]);
  
  useEffect(() => {
    const getStudents = async () => {
      setIsStudentsLoading(true); 
      const accessToken = getAccessTokenInLocalStorage();
      if (!accessToken) {
          setIsStudentsLoading(false);
          return;
      }
      
      try {
        const response = await fetch('https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${accessToken}`
          },
        });
  
        if(response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          const data = await response.json();
          console.error("Erro ao listar alunos:", data);
          error(`Erro ao carregar alunos: ${JSON.stringify(data)}`);
        }
      } catch(err) {
        console.error("Erro interno na listagem de alunos:", err);
        error("Erro interno ao tentar carregar a lista de alunos.");
      } finally {
          setIsStudentsLoading(false); 
      }
    };

    if (isStudentModalOpen) {
        getStudents();
    }
  }, [isStudentModalOpen]); 

  // Efeito para carregar a ficha de treino se estiver em modo de edição
  useEffect(() => {
    if (!workoutId) return; 

    const loadWorkoutData = async () => {
        setIsWorkoutLoading(true);
        const accessToken = getAccessTokenInLocalStorage();
        if (!accessToken) {
            setIsWorkoutLoading(false);
            error("Token de acesso não encontrado. Não é possível carregar a ficha.");
            return;
        }

        try {
            const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/fichasTreino/${workoutId}/`, {
                method: 'GET',
                headers: { 
                  'Authorization': `Bearer ${accessToken}`
                },
            });

            if(response.ok) {
                const data: WorkoutPlanApi = await response.json();
                
                const formattedDate = data.data_fim.split('T')[0];

                const getAlunos = await fetch('https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/', {
                  method: 'GET',
                  headers: { 
                    'Authorization': `Bearer ${accessToken}`
                  },
                });

                if(getAlunos.ok) {
                  const dataAlunos = await getAlunos.json()

                  const filterAlunoByWorkout = dataAlunos.filter((item) => item.user.id === data.aluno)

                  // Mapeia os dados da API para o estado do componente
                  setWorkoutData({
                      alunoId: data.aluno, 
                      workoutName: data.nome,
                      endDate: formattedDate, 
                      isActive: data.ativa,
                      obs: data.observacoes,
                      dailyWorkouts: data.treinos,
                  });
                  
                  // Define o aluno selecionado
                  setSelectedStudent({ 
                      id: data.aluno, 
                      name: `${filterAlunoByWorkout[0].user.first_name}` 
                  }); 

                  //console.log(filterAlunoByWorkout)
                }

        
            } else {
                const errorData = await response.json();
                console.error("Erro ao carregar ficha de treino:", errorData);
                error("Erro ao carregar ficha de treino.");
            }
        } catch(err) {
            console.error("Erro interno ao carregar ficha de treino:", err);
            error("Erro interno ao tentar carregar a ficha de treino.");
        } finally {
            setIsWorkoutLoading(false);
        }
    };

    loadWorkoutData();
  }, [workoutId]); 


  const handleWorkoutChange = <K extends keyof WorkoutPlanState>(key: K, value: WorkoutPlanState[K]) => {
    setWorkoutData(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectStudent = (studentData: StudentData) => {
    const studentId = studentData.user.id;
    const studentName = studentData.user.first_name || studentData.user.username || 'Nome não disponível';

    setSelectedStudent({ id: studentId, name: studentName });
    handleWorkoutChange('alunoId', studentId);
    setIsStudentModalOpen(false);
  };
  
  const handleRemoveStudent = () => {
      setSelectedStudent(null);
      handleWorkoutChange('alunoId', null);
  }

  const clearNewDayForm = () => {
    setNewDay({ dia_semana: '', titulo: '', descricao: '', isAddingExercise: false });
  };
  
  const clearNewExerciseForm = () => {
    setNewExercise({ nome: '', series: 0, repeticoes: '', descanso: '', observacao: '' });
  };


  const handleAddDailyWorkout = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    if (!newDay.dia_semana || !newDay.titulo) return; 

    const newDailyWorkout: DailyWorkoutApi = {
        dia_semana: newDay.dia_semana,
        titulo: newDay.titulo,
        descricao: newDay.descricao,
        ordem: workoutData.dailyWorkouts.length + 1,
        exercicios: [],
    };

    setWorkoutData(prev => ({
        ...prev,
        dailyWorkouts: [...prev.dailyWorkouts, newDailyWorkout]
    }));

    clearNewDayForm();
  };

  const handleAddExercise = (e: MouseEvent<HTMLButtonElement>, dailyWorkoutIndex: number) => {
    e.preventDefault();
    if (!newExercise.nome || newExercise.series <= 0 || !newExercise.repeticoes) error("Informe todos os campos dos exercícios para salvar!"); 

    const exerciseToAdd: ExerciseApi = {
      ...newExercise,
      series: Number(newExercise.series) 
    };

    const updatedWorkouts = workoutData.dailyWorkouts.map((day, index) => {
      if (index === dailyWorkoutIndex) {
        return {
          ...day,
          exercicios: [...day.exercicios, exerciseToAdd]
        };
      }
      return day;
    });

    setWorkoutData(prev => ({
      ...prev,
      dailyWorkouts: updatedWorkouts
    }));
    
    setNewDay(prev => ({ ...prev, isAddingExercise: false }));
    clearNewExerciseForm();
  };
  
  // Função para editar o dia de treino existente
  const handleEditDailyWorkout = (dailyIndex: number, key: keyof DailyWorkoutApi, value: string | number) => {
    setWorkoutData(prev => ({
        ...prev,
        dailyWorkouts: prev.dailyWorkouts.map((day, index) => {
            if (index === dailyIndex) {
                return { ...day, [key]: value };
            }
            return day;
        })
    }));
  };

  // Função para editar o exercício existente
  const handleEditExercise = (dailyIndex: number, exerciseIndex: number, key: keyof ExerciseApi, value: string | number) => {
    setWorkoutData(prev => ({
        ...prev,
        dailyWorkouts: prev.dailyWorkouts.map((day, dIndex) => {
            if (dIndex === dailyIndex) {
                return {
                    ...day,
                    exercicios: day.exercicios.map((ex, eIndex) => {
                        if (eIndex === exerciseIndex) {
                            // Converte 'series' para Number, caso contrário, usa o valor
                            const updatedValue = key === 'series' ? Number(value) : value;
                            return { ...ex, [key]: updatedValue };
                        }
                        return ex;
                    })
                };
            }
            return day;
        })
    }));
  };


  const handleCreateWorkout = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = getAccessTokenInLocalStorage();
    
     if (!workoutData.alunoId) {
        error("Selecione um aluno para cadastrar/atualizar o treino.");
        return;
    }
    if (!workoutData.workoutName || !workoutData.endDate) {
        error("Preencha Nome do Treino e Data Fim.");
        return;
    }
    if (!workoutData.dailyWorkouts.length) {
        error("Adicione pelo menos um dia de treino.");
        return;
    }
    if (!accessToken) {
        error("Token de acesso não encontrado. Não é possível processar.");
        return;
    } 

    const isEditing = !!workoutId; 
    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing 
        ? `https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/fichasTreino/${workoutId}/` 
        : 'https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/fichasTreino/'; 

    const payload = {
      aluno: workoutData.alunoId, 
      nome: workoutData.workoutName,
      data_fim: workoutData.endDate,
      ativa: workoutData.isActive,
      observacoes: workoutData.obs,
      treinos: workoutData.dailyWorkouts.map(day => ({
          id: day.id, 
          dia_semana: day.dia_semana,
          titulo: day.titulo,
          descricao: day.descricao,
          ordem: day.ordem,
          exercicios: day.exercicios.map(ex => ({
             id: ex.id, 
             nome: ex.nome,
             series: ex.series,
             repeticoes: ex.repeticoes,
             descanso: ex.descanso,
             observacao: ex.observacao
          }))
      }))
    };

    try {
      const response = await fetch(url, {
        method: method, 
        headers: { 
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload),
      });

      if(response.ok) {
        const actionMessage = isEditing ? 'atualizada' : 'cadastrada';
        success(`Ficha de Treino ${actionMessage} com sucesso para ${selectedStudent?.name}!`);
        //console.log("Payload enviado:", payload);
        closeModal();
      } else {
        const data = await response.json();
        console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} treino:`, data);
        error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} treino. Verifique o console.`);
      }

    } catch(err) {
      console.error("Internal Error:", err); 
      error("Erro interno ao tentar processar o treino.");
    }
  };


  return (
    <Container $isModal={isModalWorkout} $offAnimation={offAnimation}>
      
      {isWorkoutLoading && (
        <StudentModal style={{ zIndex: 20 }}>
            <h3 style={{color: '#1E90FF', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginTop: '0'}}>
                Carregando Ficha...
            </h3>
            <p>Aguarde enquanto carregamos os dados do treino...</p>
        </StudentModal>
      )}

      {isStudentModalOpen && (
        <StudentModal>
            <h3 style={{color: '#1E90FF', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginTop: '0'}}>
                Selecione o Aluno
            </h3>
            <div style={{ maxHeight: 'calc(100% - 4rem)', overflowY: 'auto', position: 'relative'}}>
                {isStudentsLoading ? ( 
                    <p>Carregando alunos...</p>
                ) : students.length === 0 ? (
                    <p>Nenhum aluno encontrado.</p>
                ) : (
                    students.map(student => {
                        const studentName = student.user.first_name || student.user.username || 'Nome não disponível'; 
                        return (
                            <StudentItem 
                                key={student.user.id} 
                                onClick={() => handleSelectStudent(student)} 
                            >
                              {studentName}
                            </StudentItem>
                        );
                    })
                )}
            </div>
            <ButtonContainer>
              <Button onClick={() => setIsStudentModalOpen(false)}>
                  Fechar
              </Button>
            </ButtonContainer>
        </StudentModal>
      )}

      <h2>{workoutId ? 'Editar Ficha de Treino' : 'Cadastrar Novo Treino'}</h2>
      <ContainerCloseModalBtn>
        <Button onClick={closeModal}>X</Button>
      </ContainerCloseModalBtn>

      {!isWorkoutLoading && (
        <ContainerForm onSubmit={handleCreateWorkout}>
            {/* --- 1. DADOS PRINCIPAIS DO TREINO --- */}
            <ContainerFields>
                <StyledLabel>Aluno</StyledLabel>
                <div style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', border: 'none', boxShadow: 'none' }}>
                    <p>
                        {selectedStudent ? 
                            `Aluno Selecionado: ${selectedStudent.name}` : 
                            `Nenhum aluno selecionado.`
                        }
                    </p>
                    
                    {selectedStudent ? (
                        <Button type='button' width='5rem' onClick={handleRemoveStudent}>Remover</Button>
                    ) : (
                        <Button type='button' width='5rem' onClick={() => setIsStudentModalOpen(true)}>Buscar</Button> 
                    )}
                </div>

                <StyledLabel>Nome do treino</StyledLabel>
                <Input id='1' type='text' placeholder='Digite o nome do treino' width={90} variantPlaceholder='tertiary' padding="0.5rem 0.5rem .6rem .5rem" value={workoutData.workoutName} minLength={5} maxLength={30} required={true} onChange={(e) => handleWorkoutChange('workoutName', e.target.value)} />

                {/* Edição da Data Fim */}
                <StyledLabel>Data fim</StyledLabel>
                <Input id='2' type='date' placeholder='' width={90} padding="0.5rem 0.5rem .6rem .5rem" variantPlaceholder='tertiary' value={workoutData.endDate} minLength={undefined} maxLength={undefined} required={true} onChange={(e) => handleWorkoutChange('endDate', e.target.value)} />

                <StyledLabel>Observações</StyledLabel>
                <Input id='3' type='textarea' isTextarea='textarea' placeholder='Observações gerais do treino' width={90} padding="0.5rem 0.5rem .6rem .5rem" variantPlaceholder='tertiary' value={workoutData.obs} minLength={undefined} maxLength={100} required={false} onChange={(e) => handleWorkoutChange('obs', e.target.value)} />
            </ContainerFields>

            {/* --- 2. ADICIONAR NOVO DIA DE TREINO --- */}
            <h3>Novo Dia de Treino</h3>
            <ContainerFields>
                <StyledLabel>Dia da Semana</StyledLabel>
                <StyledSelect value={newDay.dia_semana} onChange={(e) => setNewDay(prev => ({ ...prev, dia_semana: e.target.value }))}>
                    <option value="">Selecione o Dia</option>
                    <option value="SEG">Segunda-feira</option>
                    <option value="TER">Terça-feira</option>
                    <option value="QUA">Quarta-feira</option>
                    <option value="QUI">Quinta-feira</option>
                    <option value="SEX">Sexta-feira</option>
                    <option value="SAB">Sábado</option>
                    <option value="DOM">Domingo</option>
                </StyledSelect>

                <StyledLabel>Título Diário</StyledLabel>
                <Input type='text' placeholder='Ex: Treino A - Peito e Tríceps' width={90} value={newDay.titulo} padding='0.5rem 0.5rem .6rem .5rem' minLength={undefined} maxLength={20} required={false} onChange={(e) => setNewDay(prev => ({ ...prev, titulo: e.target.value }))} />
                
                <StyledLabel>Descrição do Dia</StyledLabel>
                <Input type='textarea' isTextarea='textarea' placeholder='Foco em força, etc.' width={90} value={newDay.descricao} padding='0.5rem 0.5rem .6rem .5rem' minLength={undefined} maxLength={20} required={false} onChange={(e) => setNewDay(prev => ({ ...prev, descricao: e.target.value }))} />

                <Button type='button' width='10rem' onClick={handleAddDailyWorkout}>Adicionar Dia</Button>
            </ContainerFields>


            {/* --- 3. LISTA DE TREINOS DIÁRIOS CADASTRADOS (EDITÁVEL) --- */}
            <h3>Dias de Treino Cadastrados ({workoutData.dailyWorkouts.length})</h3>
            
            {workoutData.dailyWorkouts.map((day, dailyIndex) => (
                <ContainerDailyWorkout key={day.id || dailyIndex}> 
                    
                    {/* EDIÇÃO DOS DADOS DO DIA DE TREINO */}
                    <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                        {day.ordem}º - Treino {day.dia_semana}
                    </h4>

                    <StyledLabel style={{ width: '95%' }}>Dia da Semana</StyledLabel>
                    <StyledSelect 
                        value={day.dia_semana} 
                        onChange={(e) => handleEditDailyWorkout(dailyIndex, 'dia_semana', e.target.value)}
                        style={{ width: '90%', marginBottom: '1rem' }}
                    >
                        <option value="SEG">Segunda-feira</option>
                        <option value="TER">Terça-feira</option>
                        <option value="QUA">Quarta-feira</option>
                        <option value="QUI">Quinta-feira</option>
                        <option value="SEX">Sexta-feira</option>
                        <option value="SAB">Sábado</option>
                        <option value="DOM">Domingo</option>
                    </StyledSelect>
                    
                    <StyledLabel style={{ width: '95%' }}>Título Diário</StyledLabel>
                    <Input 
                        type='text' 
                        placeholder='Ex: Treino A' 
                        width={90} 
                        value={day.titulo} 
                        padding='0.5rem 0.5rem .6rem .5rem' 
                        minLength={undefined} 
                        maxLength={20}
                        required={false}
                        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleEditDailyWorkout(dailyIndex, 'titulo', e.target.value)}
                    />
                    
                    <StyledLabel style={{ width: '95%' }}>Descrição</StyledLabel>
                    <Input 
                        type='textarea' 
                        isTextarea='textarea' 
                        placeholder='Foco em força, etc.' 
                        width={90} 
                        value={day.descricao} 
                        padding='0.5rem 0.5rem .6rem .5rem' 
                        minLength={undefined} 
                        maxLength={30} 
                        required={false}
                        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleEditDailyWorkout(dailyIndex, 'descricao', e.target.value)}
                    />

                    {/* Lista de Exercícios para este dia (Editável) */}
                    <h5 style={{ paddingLeft: '0.5rem', color: '#1E90FF', marginTop: '1.5rem', borderTop: '1px dotted #ccc', paddingTop: '1rem' }}>Exercícios ({day.exercicios.length}):</h5>
                    {day.exercicios.length === 0 ? (
                        <p style={{ paddingLeft: '0.5rem', fontSize: '0.9rem' }}>Nenhum exercício adicionado.</p>
                    ) : (
                        day.exercicios.map((ex, exIndex) => (
                            <ContainerFields key={ex.id || exIndex} style={{ border: '1px dashed #ccc', background: '#fff', padding: '0.5rem', marginBottom: '1rem' }}>
                                <h6 style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem', color: '#FF4500' }}>{ex.nome || 'Exercício sem nome'}</h6>
                                
                                <FormRow>
                                  <StyledLabel>Nome do Exercício</StyledLabel>
                                  <Input type='text' width={90} value={ex.nome} padding='.4rem .4rem .4rem 1rem' minLength={undefined} maxLength={30} required={false} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleEditExercise(dailyIndex, exIndex, 'nome', e.target.value)} />
                                
                                </FormRow>
                                
                                <FormRow>
                                    <div>
                                        <StyledLabel>Séries</StyledLabel>
                                        <Input type='number' width={90} value={ex.series || ''} padding='.4rem .4rem .4rem 1rem' minLength={undefined} maxLength={20} required={false} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleEditExercise(dailyIndex, exIndex, 'series', e.target.value)} />
                                    </div>
                                    <div>
                                        <StyledLabel>Repetições</StyledLabel>
                                        <Input type='text' width={90} value={ex.repeticoes} padding='.4rem .4rem .4rem 1rem' minLength={undefined} maxLength={10} required={false} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleEditExercise(dailyIndex, exIndex, 'repeticoes', e.target.value)} />
                                    </div>
                                </FormRow>

                                <FormRow>
                                    <div>
                                        <StyledLabel>Descanso</StyledLabel>
                                        <Input type='text' width={90} value={ex.descanso} padding='.4rem .4rem .4rem 1rem' minLength={undefined} maxLength={10} required={false} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleEditExercise(dailyIndex, exIndex, 'descanso', e.target.value)} />
                                    </div>
                                    <div>
                                        <StyledLabel>Observação</StyledLabel>
                                        <Input type='text' width={90} minLength={undefined} maxLength={100} required={false} value={ex.observacao} padding='.4rem .4rem .4rem 1rem' onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleEditExercise(dailyIndex, exIndex, 'observacao', e.target.value)} />
                                    </div>
                                </FormRow>

                            </ContainerFields>
                        ))
                    )}
                    
                    <div style={{ marginTop: '1rem' }}>
                        <Button 
                            type='button'
                            onClick={() => {
                                clearNewExerciseForm(); 
                                setNewDay(prev => ({ ...prev, isAddingExercise: !prev.isAddingExercise }));
                            }} 
                            width='10rem'
                        >
                            {/* BOTÃO PARA ADICIONAR NOVO EXERCÍCIO */}
                            {newDay.isAddingExercise ? 'Ocultar Form' : 'Adicionar Exercício'}
                        </Button>
                    </div>

                    {/* FORMULÁRIO PARA ADICIONAR NOVO EXERCÍCIO */}
                    {newDay.isAddingExercise && (
                        <ContainerFields style={{ border: 'none', background: '#f0f0f0', marginTop: '1rem' }}>
                            <h4 style={{ paddingLeft: '0.5rem', color: '#1E90FF', marginBottom: '1rem' }}>Adicionar a {day.dia_semana}</h4>
                            
                            <StyledLabel>Nome do Exercício</StyledLabel>
                            <Input type='text' width={90} minLength={undefined} maxLength={20} required={false} placeholder='Ex: Supino Reto' width={90} padding='.4rem .4rem .4rem 1rem' value={newExercise.nome} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewExercise(prev => ({ ...prev, nome: e.target.value }))} />
                            
                            <FormRow>
                              
                              <StyledLabel>Séries</StyledLabel>
                              <Input type='number' width={90} padding='.4rem .4rem .4rem 1rem' minLength={undefined} maxLength={20} required={false} placeholder='Ex: 3' value={newExercise.series || ''} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewExercise(prev => ({ ...prev, series: Number(e.target.value) }))} />
                          
                          
                              <StyledLabel>Repetições</StyledLabel>
                              <Input type='text' width={90} padding='.4rem .4rem .4rem 1rem' minLength={undefined} maxLength={20} required={false} placeholder='Ex: 8-12' value={newExercise.repeticoes} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewExercise(prev => ({ ...prev, repeticoes: e.target.value }))} />
                                
                            </FormRow>

                            <FormRow>
                            
                              <StyledLabel>Descanso</StyledLabel>
                              <Input type='text' width={90} padding='.4rem .4rem .4rem 1rem' placeholder='Ex: 60s' value={newExercise.descanso} minLength={undefined} maxLength={20} required={false} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewExercise(prev => ({ ...prev, descanso: e.target.value }))} />
                          
                              <StyledLabel>Observação</StyledLabel>
                              <Input type='textarea' width={90} isTextarea='textarea' padding='.4rem .4rem .4rem 1rem' placeholder='Ex: Drop-set na última' value={newExercise.observacao} minLength={undefined} maxLength={100} required={false} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewExercise(prev => ({ ...prev, observacao: e.target.value }))} />
                            
                            </FormRow>

                            <Button onClick={(e: MouseEvent<HTMLButtonElement>) => handleAddExercise(e, dailyIndex)} width='10rem'>Salvar Exercício</Button>
                        </ContainerFields>
                    )}
                </ContainerDailyWorkout>
            ))}

            <div style={{ padding: '2rem 0', width: '90%', margin: '0 auto' }}>
                <Button width='100%'>{workoutId ? 'Salvar Alterações' : 'Cadastrar Ficha de Treino Completa'}</Button> 
            </div>
        </ContainerForm>
      )}

    </Container>
  )
}