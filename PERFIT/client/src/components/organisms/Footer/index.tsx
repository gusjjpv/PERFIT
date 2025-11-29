import styled from 'styled-components'
import { MdHome } from "react-icons/md";
import { FaPlusCircle, FaUser } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { TbLogout2 } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import CreateStudent from '../../molecules/CreateStudent';
import { ModalContext } from '../../../context/ModalContext';
import CreateWorkout from '../../molecules/CreateWorkout';
import Workouts from '../../molecules/Workouts';
import { UserContext } from '../../../context/UserContext';
import { OverlayContext } from '../../../context/OverlayContext';
import ConfirmModal from '../../molecules/ConfirmModal';
import { Logout } from '../../../auth/auth';

const Container = styled.div`
    position: fixed; 
    bottom: 0; 
    left: 50%;
    transform: translateX(-50%); 
    width: 100%; 
    
    @media (min-width: 768px) {
        max-width: 46%; 
    }

    background-color: #ffffff; 
    border-top: 1px solid #e0e0e0; 
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08); 
    display: flex;
    justify-content: space-around; 
    align-items: center;
    padding: 0.5rem 0; 
    z-index: 1000; 

    ul { 
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        list-style: none;
        padding: 0; 
        margin: 0;
        cursor: pointer; 
        transition: color 0.3s ease; 
        min-width: 60px; 
        
        &:hover {
            color: #007bff; 
        }

        svg {
            height: 24px; 
            width: 24px;
            color: #6c757d; 
            margin-bottom: 2px;
            transition: color 0.3s ease;
        }

        li {
            color: #6c757d; 
            font-size: 0.75rem; 
            font-weight: 500;
            text-align: center;
            line-height: 1.2;
        }

        &:hover svg, &:hover li {
            color: #007bff; 
        }
    }

    a {
        text-decoration: none; 
        color: inherit;
        
        ul {
            &:hover svg, &:hover li {
                color: #28a745; 
            }
        }
    }
`;

export default function Footer() {
    const { isModal, setIsModal } = useContext(ModalContext)
    const { user } = useContext(UserContext)
    const { setIsOverlay } = useContext(OverlayContext)

    const [ isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen ] = useState<boolean>(false)
    const [ isViewWorkoutsModalOpen, setIsViewWorkoutsModalOpen ] = useState<boolean>(false)

    const [ workoutIdToEdit, setWorkoutIdToEdit ] = useState<number | undefined>(undefined)
    const [ isLogoutProfessor, setIsLogoutProfessor ] = useState<boolean>(false)

    const navigate = useNavigate()

    // Função para abrir o modal de cadastro de aluno
    const openModal = () => {
        setIsModal(true)
        setIsCreateWorkoutModalOpen(false) 
        setIsViewWorkoutsModalOpen(false) 
        setWorkoutIdToEdit(undefined) 

        setTimeout(() => {
            setIsOverlay(true)
        }, 100)
    }

    // Função para abrir o modal de CRIAÇÃO de treino
    const openCreateWorkoutModal = () => {
        setIsCreateWorkoutModalOpen(true)
        setIsModal(false)
        setIsViewWorkoutsModalOpen(false) 
        setWorkoutIdToEdit(undefined) 

        setTimeout(() => {
            setIsOverlay(true)
        }, 100)
    }

    // Função para abrir o modal de EXIBIÇÃO de treino
    const openViewWorkoutsModal = () => {
        setIsViewWorkoutsModalOpen(true)
        setIsModal(false)
        setIsCreateWorkoutModalOpen(false)
        setWorkoutIdToEdit(undefined) 

        setTimeout(() => {
            setIsOverlay(true)
        }, 100)
    }

    const navigateStudentInfo = () => {
        if (!user?.user_id) {
            navigate('/');
            return;
        }
        navigate(`/aluno-info/${user.user_id}`);
    }

 
  return (
    <>
        <Container>

            {user?.role === 'professor' ? (
                <>
                    <Link to='/personal'>
                        <ul>
                            <MdHome />
                            <li>Início</li>
                        </ul>
                    </Link>

                    <ul onClick={openModal}>
                        <FaPlusCircle />
                        <li>Novo aluno(a)</li>
                    </ul>

                    <ul onClick={openCreateWorkoutModal}>
                        <FaPlusCircle /> 
                        <li>Novo Treino</li>
                    </ul>

                    <ul onClick={openViewWorkoutsModal}>
                        <GiWeightLiftingUp />
                        <li>Meus Treinos</li>
                    </ul>

                    <ul onClick={() => setIsLogoutProfessor(true)}>
                        <TbLogout2 />
                        <li>Logout</li>
                    </ul>
                </>
            ) : (
                <>
                    <Link to='/aluno'>
                        <ul>
                            <MdHome />
                            <li>Início</li>
                        </ul>
                    </Link>
                     
                    <ul onClick={navigateStudentInfo}>
                        <FaUser />
                        <li>Meu perfil</li>
                    </ul>
                    
                </>
            )}
        </Container>

        {user?.role === 'professor' && isModal && (
            <CreateStudent />
        )}

        {user?.role === 'professor' && isCreateWorkoutModalOpen && (
            <CreateWorkout 
                isModalWorkout={isCreateWorkoutModalOpen} 
                setIsModalWorkout={setIsCreateWorkoutModalOpen} 
                workoutId={workoutIdToEdit} 
            />
        )}

        {user?.role === 'professor' && isViewWorkoutsModalOpen && (
            <Workouts 
                isModalWorkout={isViewWorkoutsModalOpen} 
                setIsModalWorkout={setIsViewWorkoutsModalOpen} 
                
                setIsCreateWorkoutModalOpen={setIsCreateWorkoutModalOpen}
                setWorkoutIdToEdit={setWorkoutIdToEdit}
            />
        )}

        {user?.role === 'professor' && isLogoutProfessor && (
            <ConfirmModal title='Logout' text='Deseja realmente' strongText='sair' endText='?' setState={setIsLogoutProfessor} func={Logout} />
        )}
    </>
  )
}