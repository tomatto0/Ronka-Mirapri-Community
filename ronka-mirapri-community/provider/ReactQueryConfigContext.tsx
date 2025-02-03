"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
type Props = {
  children: React.ReactNode;
};
const queryClient = new QueryClient();

export default function ReactQueryConfigContext({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
