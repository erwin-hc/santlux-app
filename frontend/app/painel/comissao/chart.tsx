"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Rectangle,
  YAxis,
  usePlotArea,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { useIsMobile } from "@/hooks/use-mobile";
import { DatePickerInput } from "@/components/data-picker-year";

type ChartDataType = {
  mes: number;
  especial: number | null;
  horizontal: number | null;
  vertical: number | null;
};

interface ChartBarInteractiveProps {
  chartDataCurrentYear: ChartDataType[];
  onYearChange: (ano: string) => Promise<void>;
}

const chartConfig = {
  especial: { label: "Especiais", color: "var(--chart-3)" },
  horizontal: { label: "Horizontais", color: "var(--chart-13)" },
  vertical: { label: "Verticais", color: "var(--chart-14)" },
} satisfies ChartConfig;

const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("pt-BR", { month: "long" });
};

export function ChartBarInteractive<charDataType>({
  chartDataCurrentYear,
  onYearChange,
}: ChartBarInteractiveProps) {
  const [selectedYear, setSelectedYear] = React.useState<Date | undefined>(
    new Date(),
  );
  const [activeMonth, setActiveMonth] = React.useState<number>(() => {
    return new Date().getMonth() + 1;
  });

  const isMobile = useIsMobile();

  const handleDateChange = async (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedYear(newDate);
      await onYearChange(String(newDate.getFullYear()));
    }
  };

  const selectedData = React.useMemo(() => {
    const found = chartDataCurrentYear.find((d) => d.mes === activeMonth);
    if (found) return found;

    if (chartDataCurrentYear.length > 0) return chartDataCurrentYear[0];

    return {
      mes: activeMonth,
      especial: 0,
      horizontal: 0,
      vertical: 0,
    };
  }, [activeMonth, chartDataCurrentYear]);

  const fullData = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const found = chartDataCurrentYear.find((d) => d.mes === i + 1);

      return (
        found || {
          mes: i + 1,
          especial: null,
          horizontal: null,
          vertical: null,
        }
      );
    });
  }, [chartDataCurrentYear]);

  const CustomCursor = (props: any) => {
    const payload = props.payload?.[0]?.payload;

    const isEmpty =
      payload?.especial == null &&
      payload?.horizontal == null &&
      payload?.vertical == null;

    if (isEmpty) return null;

    return <Rectangle {...props} fill="var(--muted)" opacity={1} />;
  };

  function ClickOverlay({
    data,
    onSelect,
  }: {
    data: ChartDataType[];
    onSelect: (mes: number) => void;
  }) {
    const plot = usePlotArea();
    if (!plot) return null;
    const columnWidth = plot.width / data.length;
    return (
      <>
        {data.map((item, index) => {
          const isEmpty =
            item.especial == null &&
            item.horizontal == null &&
            item.vertical == null;

          return (
            <rect
              key={item.mes}
              x={plot.x + index * columnWidth}
              y={plot.y}
              width={columnWidth}
              height={plot.height}
              fill="transparent"
              style={{
                pointerEvents: "all",
                cursor: isEmpty ? "default" : "pointer",
              }}
              onClick={() => {
                if (!isEmpty) {
                  onSelect(item.mes);
                }
              }}
            />
          );
        })}
      </>
    );
  }

  React.useEffect(() => {
    if (chartDataCurrentYear && chartDataCurrentYear.length > 0) {
      const mesesComDados = chartDataCurrentYear.filter(
        (d) =>
          (d.especial ?? 0) > 0 ||
          (d.horizontal ?? 0) > 0 ||
          (d.vertical ?? 0) > 0,
      );

      if (mesesComDados.length > 0) {
        const ultimoMesReal = Math.max(...mesesComDados.map((d) => d.mes));
        setActiveMonth(ultimoMesReal);
      } else {
        setActiveMonth(chartDataCurrentYear[0].mes);
      }
    }
  }, [chartDataCurrentYear]);

  return (
    <Card className="py-0 mb-4">
      <CardHeader className="pb-0! flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 p-4">
          <div className="flex items-center justify-start gap-4">
            <CardTitle>
              <DatePickerInput
                date={selectedYear}
                onDateChange={handleDateChange}
                
              />
            </CardTitle>
            <CardTitle className="uppercase text-2xl">
              {selectedData.mes && getMonthName(selectedData.mes)}
            </CardTitle>
          </div>
        </div>
        <div className="flex justify-center">
          {(["especial", "horizontal", "vertical"] as const).map((key) => (
            <div key={key} className={`relative z-30 py-4 px-2`}>
              <div
                style={{
                  backgroundColor: `hsl(from ${chartConfig[key].color} h s l / 0.20)`,
                  borderColor: `${chartConfig[key].color}`,
                }}
                className="flex flex-col 
                         justify-center items-start 
                         p-2
                         border-l-6 border rounded-md 
                         w-28
                         "
              >
                <span
                  className="text-xs text-muted-foreground uppercase font-bold"
                  style={{
                    color: `${chartConfig[key].color}`,
                  }}
                >
                  {chartConfig[key].label}
                </span>
                <span
                  className="fill-foreground text-4xl font-bold"
                  style={{
                    color: `${chartConfig[key].color}`,
                  }}
                >
                  {selectedData[key] && selectedData[key].toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 h-[calc(100svh-250px)] ">
        <div>
          <ChartContainer
            config={chartConfig}
            className="h-[calc(100svh-300px)] w-full"
          >
            <BarChart
              key={selectedYear?.getFullYear()}
              accessibilityLayer
              data={fullData}
              margin={{ top: 0, left: 0, right: 0 }}
              barCategoryGap="10%"
              barGap={0}
              style={{ cursor: "pointer" }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={true}
                axisLine={true}
                tickMargin={5}
                tickFormatter={(value) => getMonthName(value).substring(0, 3)}
                fontSize={isMobile ? 10 : 14}
              />

              {!isMobile && (
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  tickCount={6}
                />
              )}

              <ChartTooltip
                wrapperStyle={{ cursor: "pointer" }}
                cursor={<CustomCursor />}
                content={({ active, payload, label }) => {
                  const data = payload?.[0]?.payload;

                  const isEmpty =
                    data?.especial == null &&
                    data?.horizontal == null &&
                    data?.vertical == null;

                  if (!active || isEmpty) return null;

                  return (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={label}
                      indicator="dot"
                      hideLabel={false}
                      labelFormatter={(value, payload) => {
                        const monthNumber = payload?.[0]?.payload?.mes;
                        return getMonthName(monthNumber || value);
                      }}
                      className="w-62.5 text-lg uppercase"
                    />
                  );
                }}
              />

              <Bar
                dataKey="especial"
                fill={chartConfig.especial.color}
                radius={[4, 4, 0, 0]}
                onClick={(data: any) => {
                  setActiveMonth(data.payload.mes);
                }}
              ></Bar>

              <Bar
                dataKey="horizontal"
                fill={chartConfig.horizontal.color}
                radius={[4, 4, 0, 0]}
                onClick={(data: any) => {
                  setActiveMonth(data.payload.mes);
                }}
              ></Bar>

              <Bar
                dataKey="vertical"
                fill={chartConfig.vertical.color}
                radius={[4, 4, 0, 0]}
                onClick={(data: any) => {
                  setActiveMonth(data.payload.mes);
                }}
              ></Bar>

              <ClickOverlay
                data={fullData}
                onSelect={(mes) => setActiveMonth(mes)}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
