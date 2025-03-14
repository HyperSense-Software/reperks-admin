export interface PieChartProps {
  industry: string | null;
  industryEntries: number;
  fill?: string;
}

export interface BarChartParams {
  year?: number;
}

export interface BarChartProps {
  month: string;
  number: number;
  fill?: string;
}
