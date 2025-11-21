import { useContext } from "react";
import { LifeLine } from "react-loading-indicators";
import styled from "styled-components";
import { LoadingContext } from "../context/LoadingContext";


const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 10rem 0;
`

const Loading = () => {
    const { loading } = useContext(LoadingContext)

    return (
        <>
            {loading && (
                <Container>
                    <LifeLine color={["#000000", "#b60404" ]} size="large" text="Carregando..." textColor="#000000" />
                </Container> 
            )}
        </>
    )   
}


export default Loading;