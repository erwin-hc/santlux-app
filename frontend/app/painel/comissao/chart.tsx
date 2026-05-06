"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

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
  { mes: 1, especial: 222, horizontal: 150, vertical: 150 },
  { mes: 2, especial: 242, horizontal: 260, vertical: 150 },
  { mes: 3, especial: 245, horizontal: 180, vertical: 150 },
  { mes: 4, especial: 261, horizontal: 190, vertical: 150 },
  { mes: 5, especial: 342, horizontal: 380, vertical: 150 },
  { mes: 6, especial: 138, horizontal: 190, vertical: 150 },
  { mes: 7, especial: 222, horizontal: 150, vertical: 150 },
  { mes: 8, especial: 242, horizontal: 260, vertical: 150 },
  { mes: 9, especial: 245, horizontal: 180, vertical: 150 },
  { mes: 10, especial: 261, horizontal: 190, vertical: 150 },
  { mes: 11, especial: 342, horizontal: 380, vertical: 150 },
  { mes: 0, especial: 600, horizontal: 190, vertical: 150 },
];

const chartConfig = {
  especial: { label: "Especiais", color: "var(--chart-1)" },
  horizontal: { label: "Horizontais", color: "var(--chart-2)" },
  vertical: { label: "Verticais", color: "var(--chart-3)" },
} satisfies ChartConfig;

const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("pt-BR", { month: "long" });
};

export function ChartBarInteractive() {
  const [activeMonth, setActiveMonth] = React.useState<number>(() => {
    return new Date().getMonth() + 1;
  });

  const isMobile = useIsMobile();

  const selectedData = React.useMemo(() => {
    return chartData.find((d) => d.mes === activeMonth) || chartData[0];
  }, [activeMonth]);

  return (
    <Card className="py-0 mb-4">
      <CardHeader className="pb-0! flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:py-6">
          <CardTitle className="uppercase text-2xl text-muted-foreground">
            {getMonthName(selectedData.mes)}
          </CardTitle>
        </div>
        <div className="flex">
          {(["especial", "horizontal", "vertical"] as const).map((key) => (
            <div
              key={key}
              className={`relative z-30 
              flex flex-1 flex-col
              justify-center 
              gap-1 
              px-6 py-4 
              text-left 
              border
              border-y-0
              border-r-0
              border-t
              sm:px-8 sm:py-6 sm:border-t-0              
              `}
            >
              <span className="text-xs text-muted-foreground uppercase">
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl text-center p-2">
                {selectedData[key].toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 h-[calc(100svh-250px)] ">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[calc(100svh-300px)] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 0, left: 2, right: 2 }}
            onClick={(state: any) => {
              if (state?.activePayload?.[0]?.payload) {
                setActiveMonth(state.activePayload[0].payload.mes);
              }
            }}
            barCategoryGap="10%"
            barGap={0}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={true}
              axisLine={false}
              tickMargin={5}
              tickFormatter={(value) => getMonthName(value).substring(0, 3)}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.9 }}
              content={
                <ChartTooltipContent hideLabel className="w-[250px] text-lg" />
              }
            />

            <Bar
              dataKey="especial"
              fill={chartConfig.especial.color}
              radius={[4, 4, 0, 0]}
              style={{ cursor: "pointer" }}
              onClick={(data: any) => setActiveMonth(data.payload.mes)}
            >
              {/* {!isMobile && (
                <LabelList
                  dataKey="especial"
                  position="top"
                  offset={10}
                  fontSize={12}
                  className="fill-foreground"
                />
              )} */}
            </Bar>
            <Bar
              dataKey="horizontal"
              fill={chartConfig.horizontal.color}
              radius={[4, 4, 0, 0]}
              style={{ cursor: "pointer" }}
              onClick={(data: any) => setActiveMonth(data.payload.mes)}
            ></Bar>
            <Bar
              dataKey="vertical"
              fill={chartConfig.vertical.color}
              radius={[4, 4, 0, 0]}
              style={{ cursor: "pointer" }}
              onClick={(data: any) => setActiveMonth(data.payload.mes)}
            ></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
