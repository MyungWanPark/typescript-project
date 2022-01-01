import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loading = styled.span`
  text-align: center;
  display: block;
`;

interface RouteState {
  name: string;
}

function Coin() {
  const { coinId } = useParams();
  const [loading, setLoading] = useState(true);

  // Link to의 state를 받아오는 방법
  const state = useLocation().state as RouteState;

  return (
    <Container>
      <Header>
        {/* state가 존재한다면 state.name을 보여주고 아니면
        (index페이지를 통해 state값을 전달받지 않고 한번에 url을 입력하여 들어간다면) 
        Loading을 보여준다. */}
        <Title>{state?.name || "Loading..."}</Title>
      </Header>
      {loading ? <Loading>loading ...</Loading> : null}
    </Container>
  );
}

export default Coin;
