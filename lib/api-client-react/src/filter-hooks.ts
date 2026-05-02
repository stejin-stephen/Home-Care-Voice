import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult, QueryKey } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";
import type { Appointment, CallLog, Reminder, Escalation } from "./generated/api.schemas";

export interface AppointmentFilters {
  clientId?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CallLogFilters {
  outcome?: string;
  intent?: string;
  language?: string;
}

export interface ReminderFilters {
  type?: string;
  status?: string;
}

export interface EscalationFilters {
  priority?: string;
  resolved?: "true" | "false";
}

function buildUrl(base: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== "all") sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export const getGetAppointmentsFilteredQueryKey = (filters: AppointmentFilters) =>
  ["/api/appointments", filters] as const;

export function useGetAppointmentsFiltered<
  TData = Appointment[],
  TError = unknown,
>(
  filters: AppointmentFilters = {},
  options?: UseQueryOptions<Appointment[], TError, TData>,
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryKey = options?.queryKey ?? getGetAppointmentsFilteredQueryKey(filters);
  const query = useQuery<Appointment[], TError, TData>({
    queryKey,
    queryFn: ({ signal }) =>
      customFetch<Appointment[]>(buildUrl("/api/appointments", filters as Record<string, string | undefined>), { signal, method: "GET" }),
    ...options,
  }) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey };
}

export const getGetCallLogsFilteredQueryKey = (filters: CallLogFilters) =>
  ["/api/call-logs", filters] as const;

export function useGetCallLogsFiltered<
  TData = CallLog[],
  TError = unknown,
>(
  filters: CallLogFilters = {},
  options?: UseQueryOptions<CallLog[], TError, TData>,
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryKey = options?.queryKey ?? getGetCallLogsFilteredQueryKey(filters);
  const query = useQuery<CallLog[], TError, TData>({
    queryKey,
    queryFn: ({ signal }) =>
      customFetch<CallLog[]>(buildUrl("/api/call-logs", filters as Record<string, string | undefined>), { signal, method: "GET" }),
    ...options,
  }) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey };
}

export const getGetRemindersFilteredQueryKey = (filters: ReminderFilters) =>
  ["/api/reminders", filters] as const;

export function useGetRemindersFiltered<
  TData = Reminder[],
  TError = unknown,
>(
  filters: ReminderFilters = {},
  options?: UseQueryOptions<Reminder[], TError, TData>,
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryKey = options?.queryKey ?? getGetRemindersFilteredQueryKey(filters);
  const query = useQuery<Reminder[], TError, TData>({
    queryKey,
    queryFn: ({ signal }) =>
      customFetch<Reminder[]>(buildUrl("/api/reminders", filters as Record<string, string | undefined>), { signal, method: "GET" }),
    ...options,
  }) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey };
}

export const getGetEscalationsFilteredQueryKey = (filters: EscalationFilters) =>
  ["/api/escalations", filters] as const;

export function useGetEscalationsFiltered<
  TData = Escalation[],
  TError = unknown,
>(
  filters: EscalationFilters = {},
  options?: UseQueryOptions<Escalation[], TError, TData>,
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryKey = options?.queryKey ?? getGetEscalationsFilteredQueryKey(filters);
  const query = useQuery<Escalation[], TError, TData>({
    queryKey,
    queryFn: ({ signal }) =>
      customFetch<Escalation[]>(buildUrl("/api/escalations", filters as Record<string, string | undefined>), { signal, method: "GET" }),
    ...options,
  }) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey };
}
