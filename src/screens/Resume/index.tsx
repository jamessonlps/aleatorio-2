import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components/native";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadingContainer,
} from "./styles";


interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalString: string;
  color: string;
  percent: string;
}


export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoriesTotal, setCategoriesTotal] = useState<CategoryData[]>([]);
  const theme = useTheme();

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);

    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions: TransactionData[] = response ? JSON.parse(response) : [] as TransactionData[];

    const outcomes = transactions
      .filter((outcome) => outcome.type === "negative" &&
        new Date(outcome.date).getMonth() === selectedDate.getMonth() &&
        new Date(outcome.date).getFullYear() === selectedDate.getFullYear()
      );

    const outcomesTotal = outcomes
      .reduce((acc, outcome) => {
        return acc + Number(outcome.amount)
      }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      outcomes.forEach((outcome) => {
        if (outcome.category === category.key) {
          categorySum += Number(outcome.amount);
        }
      })

      if (categorySum > 0) {
        const total = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${(categorySum / outcomesTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          totalString: total,
          total: categorySum,
          color: category.color,
          percent
        })
      }
    })

    setCategoriesTotal(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {
        isLoading ?
          <LoadingContainer>
            <ActivityIndicator
              size={56}
              color={theme.colors.secondary}
            />
          </LoadingContainer> :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight()
            }}
          >

            <MonthSelect>
              <MonthSelectButton
                onPress={() => handleChangeDate("prev")}
              >
                <MonthSelectIcon
                  name="chevron-left"
                />
              </MonthSelectButton>

              <Month>{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}</Month>

              <MonthSelectButton
                onPress={() => handleChangeDate("next")}
              >
                <MonthSelectIcon
                  name="chevron-right"
                />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={categoriesTotal}
                colorScale={categoriesTotal.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fill: theme.colors.shape
                  },
                }}
                labelRadius={100}
                x="percent"
                y="total"
              />
            </ChartContainer>
            {
              categoriesTotal.map(item => (
                <HistoryCard
                  key={item.key}
                  color={item.color}
                  amount={item.totalString}
                  title={item.name}
                />
              ))
            }
          </Content>
      }
    </Container>
  );
}