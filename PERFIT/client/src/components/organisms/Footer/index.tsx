import styled from 'styled-components'
import { MdHome } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import CreateStudent from '../../molecules/CreateStudent';
import { ModalContext } from '../../../context/ModalContext';
import CreateWorkout from '../../molecules/CreateWorkout';
import Workouts from '../../molecules/Workouts';

const Container = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 100%;
    background-color: white;
    border: 1px solid #00000029;
    border-radius: 5px;
    padding: .4rem;
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

        li {
            color: #333333;
            font-weight: 600;
        }
    }
`

export default function Footer() {
    const { isModal, setIsModal } = useContext(ModalContext)
    
    const [ isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen ] = useState<boolean>(false)
    const [ isViewWorkoutsModalOpen, setIsViewWorkoutsModalOpen ] = useState<boolean>(false)

    const [ workoutIdToEdit, setWorkoutIdToEdit ] = useState<number | undefined>(undefined)

    // Função para abrir o modal de cadastro de aluno
    const openModal = () => {
        setIsModal(true)
        setIsCreateWorkoutModalOpen(false) 
        setIsViewWorkoutsModalOpen(false) 
        setWorkoutIdToEdit(undefined) // Limpa o ID ao iniciar outro fluxo
    }

    // Função para abrir o modal de CRIAÇÃO de treino
    const openCreateWorkoutModal = () => {
        setIsCreateWorkoutModalOpen(true)
        setIsModal(false)
        setIsViewWorkoutsModalOpen(false) 
        setWorkoutIdToEdit(undefined) // Garante que está no modo de CRIAÇÃO
    }

    // Função para abrir o modal de VISUALIZAÇÃO/GERENCIAMENTO de treinos
    const openViewWorkoutsModal = () => {
        setIsViewWorkoutsModalOpen(true)
        setIsModal(false)
        setIsCreateWorkoutModalOpen(false)
        setWorkoutIdToEdit(undefined) // Limpa o ID ao iniciar a visualização
    }
 
  return (
    <>
        <Container>
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
        </Container>

        {isModal && (
            <CreateStudent />
        )}

        {/* 3. Renderiza o modal de CRIAÇÃO/EDIÇÃO (CreateWorkout) */}
        {isCreateWorkoutModalOpen && (
            <CreateWorkout 
                isModalWorkout={isCreateWorkoutModalOpen} 
                setIsModalWorkout={setIsCreateWorkoutModalOpen} 
                workoutId={workoutIdToEdit} 
            />
        )}

        {/* 4. Renderiza o modal de VISUALIZAÇÃO/GERENCIAMENTO (Workouts) */}
        {isViewWorkoutsModalOpen && (
            <Workouts 
                isModalWorkout={isViewWorkoutsModalOpen} 
                setIsModalWorkout={setIsViewWorkoutsModalOpen} 
                
                setIsCreateWorkoutModalOpen={setIsCreateWorkoutModalOpen}
                setWorkoutIdToEdit={setWorkoutIdToEdit}
            />
        )}
    </>
  )
}