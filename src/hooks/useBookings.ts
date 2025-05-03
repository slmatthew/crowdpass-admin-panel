import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { useState } from "react";
import { Booking } from "@/types/models/Booking";

export interface BookingFilters {
  search: string;
  eventId: string;
  status: string;
  page: number;
  perPage: number;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
}

export function useBookings() {
  const api = useApiClient();

  const [filters, setFilters] = useState<BookingFilters>({
    search: "",
    eventId: "",
    status: "",
    page: 1,
    perPage: 20,
  });

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<BookingsResponse>({
    queryKey: ["bookings", filters],
    queryFn: async () => {
      const res = await api.get("admin/bookings", { params: filters });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    bookings: data?.bookings ?? [],
    total: data?.total ?? 0,
    isLoading,
    isFetching,
    refetch,
    filters,
    updateFilters: (newFilters: Partial<BookingFilters>) =>
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })),
    resetFilters: () =>
      setFilters({ search: "", eventId: "", status: "", page: 1, perPage: 20 }),
    goToPage: (page: number) => setFilters((prev) => ({ ...prev, page })),
  };
}