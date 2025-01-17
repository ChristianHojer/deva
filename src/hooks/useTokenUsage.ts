import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TokenUsageData {
  used: number;
  limit: number;
}

export function useTokenUsage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['token-usage'],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      const { data: monthlyData, error: monthlyError } = await supabase
        .from('token_usage')
        .select('tokens_used')
        .gte('created_at', startOfMonth.toISOString());

      if (monthlyError) throw monthlyError;

      const { data: yearlyData, error: yearlyError } = await supabase
        .from('token_usage')
        .select('tokens_used')
        .gte('created_at', startOfYear.toISOString());

      if (yearlyError) throw yearlyError;

      const monthlyUsed = monthlyData.reduce((sum, record) => sum + record.tokens_used, 0);
      const yearlyUsed = yearlyData.reduce((sum, record) => sum + record.tokens_used, 0);

      return {
        monthlyUsage: {
          used: monthlyUsed,
          limit: 1000,
        },
        yearlyUsage: {
          used: yearlyUsed,
          limit: 12000,
        },
      };
    },
    refetchInterval: 5000, // Refetch every 5 seconds as a fallback
  });

  return {
    monthlyUsage: data?.monthlyUsage || { used: 0, limit: 1000 },
    yearlyUsage: data?.yearlyUsage || { used: 0, limit: 12000 },
    isLoading,
    error,
  };
}