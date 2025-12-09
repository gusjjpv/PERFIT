import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'
import { getAccessTokenInLocalStorage } from '../../../storage/LocalStorage'
import { error, success } from '../../../utils/toastfy'

interface MonitorHealthProps {
    isEdit: boolean
}

interface MomentValues {
    paSistolica: number | null
    paDiastolica: number | null
    glicemia: number | null
}

interface DayRecord {
    id: number
    date?: string
    antes: MomentValues
    durante: MomentValues
    depois: MomentValues
    expanded: boolean
}

const Container = styled.div`
    max-width: 97%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    margin: 1rem .7rem 0 .5rem;
`
const ContainerButtonAddAndTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`
const ContainerList = styled.div`
    width: 100%;
    margin-top: 2rem;
    max-height: calc(100vh - 400px);
    overflow-y: auto;
    padding-right: .5rem;
`
const ToggleBox = styled.div`
    width: 100%;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: .5rem;
    padding: 1rem;
`
const ToggleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`
const ContainerScroll = styled.div`
    /* max-height: 200px;
    overflow-y: auto; */
    padding-right: .3rem;
    margin-top: 1rem;
`
const Section = styled.div`
    margin: 1rem 0;
    padding-right: .3rem;
`
const SectionItems = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
const SectionTitle = styled.h4`
    margin-bottom: .4rem;
    font-size: 1rem;
    font-weight: bold;
`

/* Modal */
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`
const ModalBox = styled.div`
    background: #fff;
    padding: 1.5rem;
    border-radius: .5rem;
    height: 70%;
    width: 90%;
    max-width: 450px;
    overflow-y: auto;
    position: relative;
`
const ModalTitle = styled.h3`
    margin-top: 1.2rem;
    margin-bottom: 3rem;
    text-align: left;
`
const CloseModal = styled.div`
    position: absolute;
    top: 0;
    right: 0;
`

export default function MonitorHealth({ isEdit }: MonitorHealthProps) {
    const { user } = useContext(UserContext)
    const { id } = useParams<string>()

    const [records, setRecords] = useState<DayRecord[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [isCreated, setIsCreated] = useState<boolean>(false)

    const today = new Date().toISOString().split("T")[0]

    const [newRecord, setNewRecord] = useState({
        antes: { paSistolica: "", paDiastolica: "", glicemia: "" },
        durante: { paSistolica: "", paDiastolica: "", glicemia: "" },
        depois: { paSistolica: "", paDiastolica: "", glicemia: "" }
    })

    const moments = [
        { key: "antes", label: "Antes do Treino" },
        { key: "durante", label: "Durante o Treino" },
        { key: "depois", label: "Depois do Treino" }
    ] as const

    const toggleRecord = (id: number) => {
        setRecords(prev =>
            prev.map(r => r.id === id ? { ...r, expanded: !r.expanded } : r)
        )
    }

    const createNewRecord = async () => {
        const accessToken = getAccessTokenInLocalStorage()

        const allFields = [
            newRecord.antes.paSistolica,
            newRecord.antes.paDiastolica,
            newRecord.antes.glicemia,
            newRecord.durante.paSistolica,
            newRecord.durante.paDiastolica,
            newRecord.durante.glicemia,
            newRecord.depois.paSistolica,
            newRecord.depois.paDiastolica,
            newRecord.depois.glicemia,
        ]

            const hasEmpty = allFields.some(field => !field.trim())

            if (hasEmpty) {
                error("Preencha todos os campos!")
                return
            }


        const payload  = {
            antes: {
                paSistolica: Number(newRecord.antes.paSistolica),
                paDiastolica: Number(newRecord.antes.paDiastolica),
                glicemia: Number(newRecord.antes.glicemia)
            },
            durante: {
                paSistolica: Number(newRecord.durante.paSistolica),
                paDiastolica: Number(newRecord.durante.paDiastolica),
                glicemia: Number(newRecord.antes.glicemia)
            },
            depois: {
                paSistolica: Number(newRecord.depois.paSistolica),
                paDiastolica: Number(newRecord.depois.paDiastolica),
                glicemia: Number(newRecord.depois.glicemia)
            }
        }

        try {
            const response = await fetch(`https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/avaliacoes-pa/multipla/`, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json", 
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload),
            })

            if(response.ok) {
                const data = await response.json()
                success("Registro cadastrado!")
                setIsCreated(prev => !prev)
                setShowModal(false)
                //console.log("DATA POST: ", data)
            } else {
                const data = await response.json()
                console.log("DATA POST: ", data)
            }

        } catch(err) {
            console.log("Internal error: ", err)
        }
    }

    useEffect(() => {
        const getRecords = async () => {
            const accessToken = getAccessTokenInLocalStorage()

            try {
                const response = await fetch(
                    `https://api.joaogustavo.grupo-03.sd.ufersa.dev.br/api/v1/alunos/${id}/avaliacoes-pa/`,
                    {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }
                )

                if (!response.ok) {
                    console.log("Erro:", await response.json())
                    return
                }

                const data: any[] = await response.json() // Tipagem como array de 'any'
                //console.log("DATA GET:", data)

                // 1. Agrupar os registros por data
                const groupedByDate = data.reduce((acc, currentItem) => {
                    // Extrai a data sem o timestamp
                    const dateKey = currentItem.data.split("T")[0]

                    // Inicializa o registro do dia se ainda não existir
                    if (!acc[dateKey]) {
                        acc[dateKey] = {
                            date: dateKey,
                            antes: { paSistolica: null, paDiastolica: null, glicemia: null },
                            durante: { paSistolica: null, paDiastolica: null, glicemia: null },
                            depois: { paSistolica: null, paDiastolica: null, glicemia: null },
                        }
                    }

                    // Preenche o momento (ANTES, DURANTE, DEPOIS) com os dados
                    const momento = currentItem.momento.toLowerCase() // "antes", "durante", "depois"
                    
                    if (acc[dateKey][momento]) {
                        acc[dateKey][momento].paSistolica = currentItem.paSistolica
                        acc[dateKey][momento].paDiastolica = currentItem.paDiastolica
                        acc[dateKey][momento].glicemia = currentItem.glicemia
                    }


                    return acc
                }, {} as { [key: string]: Omit<DayRecord, 'id' | 'expanded'> })

                // 2. Mapear o objeto agrupado para a lista de DayRecord
                const formattedRecords: DayRecord[] = Object.values(groupedByDate).map((dayRecord, index) => ({
                    id: index + 1, // Adiciona um ID sequencial para o React
                    ...dayRecord,
                    expanded: false, // Define o estado inicial de expansão
                }))

                setRecords(formattedRecords.reverse()) // Inverte a ordem para mostrar o mais recente primeiro, se desejar

            } catch (err) {
                console.log("Internal Error: ", err)
            }
        }

        getRecords()
    }, [id, isCreated])



    return (
        <Container>
            <ContainerButtonAddAndTitle>
                <h2>P.A. e Glicemia</h2>

                {user?.role === "professor" && (
                    <Button width="8rem" onClick={() => setShowModal(true)}>
                        Novo registro
                    </Button>
                )}
            </ContainerButtonAddAndTitle>

            <ContainerList>
                {records.map(record => (
                    <ToggleBox key={record.id}>
                        <ToggleHeader onClick={() => toggleRecord(record.id)}>
                            <h3>{record.date}</h3>
                            <span>{record.expanded ? "▲" : "▼"}</span>
                        </ToggleHeader>
                        
                        {record.expanded && (
                            <ContainerScroll>
                                <SectionItems>
                                    {moments.map(m => (
                                        <Section key={m.key}>
                                            <SectionTitle>{m.label}</SectionTitle>

                                            <Input
                                                type="number"
                                                width={100}
                                                disabled={!isEdit}
                                                placeholder="PA Sistólica"
                                                value={record[m.key].paSistolica ?? ""}
                                                padding='0.75rem 0.75rem 0.75rem 1rem'
                                                marginBottom={.6}
                                                required={false}
                                            />

                                            <Input
                                                type="number"
                                                width={100}
                                                disabled={!isEdit}
                                                placeholder="PA Diastólica"
                                                value={record[m.key].paDiastolica ?? ""}
                                                padding='0.75rem 0.75rem 0.75rem 1rem'
                                                marginBottom={.6}
                                                required={false}
                                            />

                                            <Input
                                                type="number"
                                                width={100}
                                                disabled={!isEdit}
                                                placeholder="Glicemia"
                                                value={record[m.key].glicemia ?? ""}
                                                padding='0.75rem 0.75rem 0.75rem 1rem'
                                                marginBottom={.6}
                                                required={false}
                                            />
                                        </Section>
                                    ))}
                                </SectionItems>
                            </ContainerScroll>
                        )}
                    </ToggleBox>
                ))}
            </ContainerList>

            {showModal && (
                <Overlay>
                    <ModalBox>
                        <ModalTitle>Novo Registro - {today}</ModalTitle>

                        <CloseModal onClick={() => setShowModal(false)}>
                            <Button color='primary'>X</Button>
                        </CloseModal>

                        {moments.map(m => (
                            <Section key={m.key}>
                                <SectionTitle>{m.label}</SectionTitle>

                                <Input
                                    type="number"
                                    placeholder="PA Sistólica"
                                    width={100}
                                    value={newRecord[m.key].paSistolica}
                                    padding='0.75rem 0.75rem 0.75rem 1rem'
                                    marginBottom={.6}
                                    onChange={e =>
                                        setNewRecord(prev => ({
                                            ...prev,
                                            [m.key]: { ...prev[m.key], paSistolica: e.target.value }
                                        }))
                                    }
                                    required={true}
                                />

                                <Input
                                    type="number"
                                    placeholder="PA Diastólica"
                                    width={100}
                                    value={newRecord[m.key].paDiastolica}
                                    padding='0.75rem 0.75rem 0.75rem 1rem'
                                    marginBottom={.6}
                                    onChange={e =>
                                        setNewRecord(prev => ({
                                            ...prev,
                                            [m.key]: { ...prev[m.key], paDiastolica: e.target.value }
                                        }))
                                    }
                                    required={true}
                                />

                                <Input
                                    type="number"
                                    placeholder="Glicemia"
                                    width={100}
                                    value={newRecord[m.key].glicemia}
                                    padding='0.75rem 0.75rem 0.75rem 1rem'
                                    marginBottom={.6}
                                    onChange={e =>
                                        setNewRecord(prev => ({
                                            ...prev,
                                            [m.key]: { ...prev[m.key], glicemia: e.target.value }
                                        }))
                                    }
                                    required={true}
                                />
                            </Section>
                        ))}

                        <Button type='submit' gradient width="100%" onClick={createNewRecord}>
                            Salvar
                        </Button>
                    </ModalBox>
                </Overlay>
            )}
        </Container>
    )
}
