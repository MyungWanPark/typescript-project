import { useEffect, useState } from "react";
import {
  useLocation,
  useParams,
  Outlet,
  Link,
  useMatch,
} from "react-router-dom";
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

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

// isActive 란 Props 를 받는다.
const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  /* props.isActive가 true이면 accentColor로 표시한다. */
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteState {
  name: string;
}

declare module InfoData {
  export interface Tag {
    id: string;
    name: string;
    coin_counter: number;
    ico_counter: number;
  }

  export interface Team {
    id: string;
    name: string;
    position: string;
  }

  export interface Links {
    explorer: string[];
    facebook: string[];
    reddit: string[];
    source_code: string[];
    website: string[];
    youtube: string[];
  }

  export interface Stats {
    subscribers: number;
    contributors?: number;
    stars?: number;
    followers?: number;
  }

  export interface LinksExtended {
    url: string;
    type: string;
    stats: Stats;
  }

  export interface Whitepaper {
    link: string;
    thumbnail: string;
  }

  export interface RootObject {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    tags: Tag[];
    team: Team[];
    description: string;
    message: string;
    open_source: boolean;
    started_at: Date;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    links: Links;
    links_extended: LinksExtended[];
    whitepaper: Whitepaper;
    first_data_at: Date;
    last_data_at: Date;
  }
}

declare module PriceData {
  export interface USD {
    price: number;
    volume_24h: number;
    volume_24h_change_24h: number;
    market_cap: number;
    market_cap_change_24h: number;
    percent_change_15m: number;
    percent_change_30m: number;
    percent_change_1h: number;
    percent_change_6h: number;
    percent_change_12h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    percent_change_1y: number;
    ath_price: number;
    ath_date: Date;
    percent_from_price_ath: number;
  }

  export interface Quotes {
    USD: USD;
  }

  export interface RootObject {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: Date;
    last_updated: Date;
    quotes: Quotes;
  }
}

function Coin() {
  // url 의 coinID를 가져오는 방법
  const { coinId } = useParams();
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoData.RootObject>();
  const [priceInfo, setPriceInfo] = useState<PriceData.RootObject>();

  // Link to의 state를 받아오는 방법
  const state = useLocation().state as RouteState;

  useEffect(() => {
    (async () => {
      const infoResponse = await fetch(
        `https://api.coinpaprika.com/v1/coins/${coinId}`
      );
      const infoJson = await infoResponse.json();
      const priceResponse = await fetch(
        `https://api.coinpaprika.com/v1/tickers/${coinId}`
      );
      const priceJson = await priceResponse.json();

      setInfo(infoJson);
      setPriceInfo(priceJson);
      setLoading(false);
    })();
    // useEffect Hook 의 최적화를 위해 의존성을 가지는 값을 하나 넣어야 함. 다행히 coinID는 url이라 변하지 않아서
    // 의도한 대로 1번만 실행 시킬 수 있다.
  }, [coinId]);

  return (
    <Container>
      <Header>
        {/* state가 존재한다면 state.name을 보여주고 아니면
        (index페이지를 통해 state값을 전달받지 않고 한번에 url을 입력하여 들어간다면) 
        Loading을 보여준다. */}
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{info?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Supply:</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
        </>
      )}
      {/* nested route에서 부모의 component에서 render 된다는 뜻으로 
      부모component에서 outlet을 써준다. */}
      <Outlet />
    </Container>
  );
}

export default Coin;
