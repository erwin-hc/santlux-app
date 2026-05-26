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
  ReferenceArea,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { useIsMobile } from "@/hooks/use-mobile";
import { DatePickerInput } from "@/components/data-picker-year";
import { Spinner } from "@/components/ui/spinner";

import { Sparkles, AlignEndVertical, AlignStartHorizontal } from "lucide-react";
import { ChartBarHorizontal } from "./chart-mobile";

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
  especial: { label: "Especiais", color: "var(--chart-12)" },
  horizontal: { label: "Horizontais", color: "var(--chart-13)" },
  vertical: { label: "Verticais", color: "var(--chart-14)" },
} satisfies ChartConfig;

const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("pt-BR", { month: "long" });
};

export function ChartBarInteractive({
  chartDataCurrentYear,
  onYearChange,
}: ChartBarInteractiveProps) {
  const [selectedYear, setSelectedYear] = React.useState<Date | undefined>(
    new Date(),
  );
  const [activeMonth, setActiveMonth] = React.useState<number>(
    () => new Date().getMonth() + 1,
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const isMobile = useIsMobile();

  const handleDateChange = async (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedYear(newDate);
      setIsLoading(true);
      try {
        await onYearChange(String(newDate.getFullYear()));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const selectedData = React.useMemo(() => {
    const found = chartDataCurrentYear.find((d) => d.mes === activeMonth);
    if (found) return found;
    if (chartDataCurrentYear.length > 0) return chartDataCurrentYear[0];
    return { mes: activeMonth, especial: 0, horizontal: 0, vertical: 0 };
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
    return (
      <Rectangle {...props} fill="var(--muted-foreground)" opacity={0.01} />
    );
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
                if (!isEmpty) onSelect(item.mes);
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

  const cardKeys = [
    { key: "especial" as const, icon: Sparkles },
    { key: "horizontal" as const, icon: AlignEndVertical },
    { key: "vertical" as const, icon: AlignStartHorizontal },
  ];

  return (
    <Card className="p-4">
      <div className="relative">
        {/* Loading */}
        <div className="flex  flex-col gap-2 sm:flex-row sm:items-start max-w-7xl m-auto mb-4">
          {/* Card Especial */}
          <div
            style={{
              backgroundColor: `hsl(from ${chartConfig.especial.color} h s l / 0.20)`,
              borderColor: `hsl(from ${chartConfig.especial.color} h s l / 0.50)`,
            }}
            className="rounded-lg border p-2 shadow-sm backdrop-blur-sm sm:w-1/3 "
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm"
                style={{
                  backgroundColor: `hsl(from ${chartConfig.especial.color} h s l / 0.25)`,
                  color: chartConfig.especial.color,
                }}
              >
                <Sparkles className="h-6 w-6 stroke-2" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs uppercase font-bold"
                  style={{ color: chartConfig.especial.color }}
                >
                  {chartConfig.especial.label}
                </span>
                <div
                  className="text-5xl font-black leading-none tracking-tight mt-1"
                  style={{ color: chartConfig.especial.color }}
                >
                  {selectedData.especial?.toLocaleString() ?? 0}
                </div>
                <div
                  className="text-[12px] pt-1"
                  style={{ color: chartConfig.especial.color }}
                >
                  <span className="capitalize">
                    {getMonthName(activeMonth)}/
                  </span>
                  <span>{selectedYear?.getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Horizontal */}
          <div
            style={{
              backgroundColor: `hsl(from ${chartConfig.horizontal.color} h s l / 0.20)`,
              borderColor: `hsl(from ${chartConfig.horizontal.color} h s l / 0.50)`,
            }}
            className="rounded-lg border p-2 shadow-sm backdrop-blur-sm sm:w-1/3 "
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm"
                style={{
                  backgroundColor: `hsl(from ${chartConfig.horizontal.color} h s l / 0.25)`,
                  color: chartConfig.horizontal.color,
                }}
              >
                <AlignEndVertical className="h-6 w-6 stroke-2" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs uppercase font-bold"
                  style={{ color: chartConfig.horizontal.color }}
                >
                  {chartConfig.horizontal.label}
                </span>
                <div
                  className="text-5xl font-black leading-none tracking-tight mt-1"
                  style={{ color: chartConfig.horizontal.color }}
                >
                  {selectedData.horizontal?.toLocaleString() ?? 0}
                </div>
                <div
                  className="text-[12px] pt-1"
                  style={{ color: chartConfig.horizontal.color }}
                >
                  <span className="capitalize">
                    {getMonthName(activeMonth)}/
                  </span>
                  <span>{selectedYear?.getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Vertical */}
          <div
            style={{
              backgroundColor: `hsl(from ${chartConfig.vertical.color} h s l / 0.20)`,
              borderColor: `hsl(from ${chartConfig.vertical.color} h s l / 0.50)`,
            }}
            className="rounded-lg border p-2 shadow-sm backdrop-blur-sm sm:w-1/3 "
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm"
                style={{
                  backgroundColor: `hsl(from ${chartConfig.vertical.color} h s l / 0.25)`,
                  color: chartConfig.vertical.color,
                }}
              >
                <AlignStartHorizontal className="h-6 w-6 stroke-2" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs uppercase font-bold"
                  style={{ color: chartConfig.vertical.color }}
                >
                  {chartConfig.vertical.label}
                </span>
                <div
                  className="text-5xl font-black leading-none tracking-tight mt-1"
                  style={{ color: chartConfig.vertical.color }}
                >
                  {selectedData.vertical?.toLocaleString() ?? 0}
                </div>
                <div
                  className="text-[12px] pt-1"
                  style={{ color: chartConfig.vertical.color }}
                >
                  <span className="capitalize">
                    {getMonthName(activeMonth)}/
                  </span>
                  <span>{selectedYear?.getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* DataPicker */}
        <div className="pb-4">
          <DatePickerInput
            month={activeMonth && getMonthName(activeMonth)}
            date={selectedYear}
            onDateChange={handleDateChange}
          />
        </div>
        {/* Gráfico */}

        <CardContent className="p-0 h-[calc(100svh-315px)]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
              <Spinner className="size-10" />
            </div>
          )}
          <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
            <ChartContainer
              config={chartConfig}
              className="h-[calc(100svh-300px)] w-full max-w-6xl mx-auto"
            >
              <BarChart
                key={selectedYear?.getFullYear()}
                accessibilityLayer
                data={fullData}
                margin={{ top: 0, left: -25, right: 0 }}
                barGap={-1}
                style={{ cursor: "pointer" }}
              >
                <ReferenceArea
                  x1={activeMonth}
                  x2={activeMonth}
                  fill={`hsl(from var(--muted-foreground) h s l / 0.25)`}
                  stroke="none"
                  fillOpacity={1}
                  ifOverflow="hidden"
                />
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="mes"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={0}
                  tickFormatter={(value) => getMonthName(value).substring(0, 3)}
                  fontSize={isMobile ? 10 : 14}
                />
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={0}
                  tickCount={6}
                />
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
                          return (
                            getMonthName(monthNumber || value) +
                            "/" +
                            selectedYear?.getFullYear()
                          );
                        }}
                        className="w-62.5 text-[14px] uppercase"
                      />
                    );
                  }}
                />
                <Bar
                  dataKey="especial"
                  fill={chartConfig.especial.color}
                  radius={[0, 0, 0, 0]}
                  onClick={(data: any) => setActiveMonth(data.payload.mes)}
                  // barSize={15}
                />
                <Bar
                  dataKey="horizontal"
                  fill={chartConfig.horizontal.color}
                  radius={[0, 0, 0, 0]}
                  onClick={(data: any) => setActiveMonth(data.payload.mes)}
                  // barSize={15}
                />
                <Bar
                  dataKey="vertical"
                  fill={chartConfig.vertical.color}
                  radius={[0, 0, 0, 0]}
                  onClick={(data: any) => setActiveMonth(data.payload.mes)}
                  // barSize={15}
                />
                <ClickOverlay
                  data={fullData}
                  onSelect={(mes) => setActiveMonth(mes)}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
