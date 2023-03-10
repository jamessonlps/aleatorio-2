import {
  Container,
  Title,
  Amount
} from "./styles";


interface Props {
  color: string;
  title: string;
  amount: string;
}


export function HistoryCard({
  amount,
  color,
  title
}: Props) {
  return (
    <Container
      color={color}
    >
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  )
}