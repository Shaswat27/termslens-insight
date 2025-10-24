import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { exitValue: 0, company: 0, investors: 0 },
  { exitValue: 5, company: 5, investors: 5 },
  { exitValue: 10, company: 7.5, investors: 7.5 },
  { exitValue: 20, company: 15, investors: 15 },
  { exitValue: 30, company: 22.5, investors: 22.5 },
  { exitValue: 40, company: 30, investors: 32 },
  { exitValue: 50, company: 40, investors: 42 },
  { exitValue: 75, company: 65, investors: 68 },
  { exitValue: 100, company: 95, investors: 95 },
];

const chartConfig = {
  company: {
    label: "Company",
    color: "hsl(var(--chart-1))",
  },
  investors: {
    label: "Investors",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const ReturnsChart = () => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
      <h2 className="text-xl md:text-2xl font-semibold text-primary mb-6">
        Returns vs Company Exit Value
      </h2>
      
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorCompany" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInvestors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="exitValue" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ 
                  value: 'Company Exit Value ($M)', 
                  position: 'bottom',
                  offset: 15,
                  style: { fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                label={{ 
                  value: 'Returns ($M)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="investors" 
                stroke="hsl(var(--chart-2))" 
                fillOpacity={1} 
                fill="url(#colorInvestors)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="company" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#colorCompany)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
