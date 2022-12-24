import React from "react";
import {
  Container,
  Title
} from "./styles";
import { TouchableOpacityProps } from "react-native";
import { RectButtonProps } from "react-native-gesture-handler";


interface Props extends RectButtonProps {
  title: string;
}

export function Button({ title, ...rest }: Props) {
  return (
    <Container {...rest} >
      <Title>{title}</Title>
    </Container>
  )
}