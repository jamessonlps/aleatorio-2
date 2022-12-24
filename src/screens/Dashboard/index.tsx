import React from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from "./styles";


export interface DataListProps extends TransactionCardProps {
  id: string;
}


export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: "1",
      type: "positive",
      title: "Desenvolvimento",
      amount: "R$ 12.000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign",
      },
      date: "13/04/2022",
    },
    {
      id: "2",
      type: "negative",
      title: "Desenvolvimento",
      amount: "R$ 100,00",
      category: {
        name: "Alimentação",
        icon: "coffee",
      },
      date: "10/04/2022",
    },
    {
      id: "3",
      type: "negative",
      title: "Aluguel Apartamento",
      amount: "R$ 1.600,00",
      category: {
        name: "Casa",
        icon: "shopping-bag",
      },
      date: "13/04/2022",
    },
  ]


  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: "http://github.com/jamessonlps.png" }} />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Jamesson</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => { }}>
            <Icon name="power" />
          </LogoutButton>

        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.500,00"
          lastTransaction="Última entrada dia 13 de Maio"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 10.500,00"
          lastTransaction="Última saída dia 13 de Maio"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 17.500,00"
          lastTransaction="01 à 16 de maio"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

      </Transactions>
    </Container>
  )
}
