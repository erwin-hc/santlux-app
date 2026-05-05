"use client";

import { useState } from "react"; // 1. Importar useState
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "Janeiro", ESPECIAIS: 250, HORIZONTAIS: 30, VERTICAIS: 5 },
  { month: "Fevereiro", ESPECIAIS: 305, HORIZONTAIS: 50, VERTICAIS: 4 },
  { month: "Março", ESPECIAIS: 237, HORIZONTAIS: 70, VERTICAIS: 10 },
  { month: "Abril", ESPECIAIS: 325, HORIZONTAIS: 50, VERTICAIS: 2 },
  { month: "Maio", ESPECIAIS: 209, HORIZONTAIS: 65, VERTICAIS: 4 },
];

const chartConfig = {
  ESPECIAIS: { label: "Especiais", color: "var(--chart-1)" },
  HORIZONTAIS: { label: "Horizontais", color: "var(--chart-2)" },
  VERTICAIS: { label: "Verticais", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ChartAreaGradient() {
  const [selectedMonth, setSelectedMonth] = useState("Março");
  const detailData = chartData.find((d) => d.month === selectedMonth);

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="col-span-2 p-3 py-6 shadow-none">
        <CardHeader>
          <CardDescription>Comissão Anual</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
              // 3. Captura o clique no gráfico
              onClick={(state) => {
                // Verifica se existe um rótulo ativo (mês) antes de atualizar
                if (state && state.activeLabel) {
                  setSelectedMonth(state.activeLabel);
                }
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              {/* 4. Hover Horizontal (Linha Vertical) */}
              <ChartTooltip
                cursor={{
                  stroke: "rgba(0,0,0,0.1)",
                  strokeWidth: 25,
                  opacity: 0.35,
                  cursor: "pointer",
                }} // Ativa a linha vertical
                content={<ChartTooltipContent indicator="dot" />}
              />
              <defs>
                {Object.keys(chartConfig).map((key) => (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${key})`}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>

              <Area
                dataKey="VERTICAIS"
                type="natural"
                fill="url(#fillVERTICAIS)"
                stroke="var(--color-VERTICAIS)"
                stackId="a"
              />

              <Area
                dataKey="ESPECIAIS"
                type="natural"
                fill="url(#fillESPECIAIS)"
                stroke="var(--color-ESPECIAIS)"
                stackId="a"
              />

              <Area
                dataKey="HORIZONTAIS"
                type="natural"
                fill="url(#fillHORIZONTAIS)"
                stroke="var(--color-HORIZONTAIS)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 5. Gráfico Lateral Detalhado */}
      <Card className="shadow-none p-4">
        <CardHeader>
          <CardTitle className="text-sm">Detalhes: {selectedMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          {detailData ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Especiais:</span>
                <span className="font-bold">{detailData.ESPECIAIS}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Horizontais:</span>
                <span className="font-bold">{detailData.HORIZONTAIS}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Verticais:</span>
                <span className="font-bold">{detailData.VERTICAIS}</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              Clique no gráfico para ver detalhes
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
