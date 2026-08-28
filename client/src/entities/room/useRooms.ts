import { useQuery } from '@tanstack/react-query';
import { api, queryKeys, type ListRoomsParams } from '@/shared/api';

/**
 * Запрос выключен, пока не выбран офис.
 * Если переданы `from`/`to`, у комнат появляется поле `available`.
 */
export function useRooms(params: Partial<ListRoomsParams>) {
  const officeId = params.officeId;
  const enabled = Boolean(officeId);

  return useQuery({
    queryKey: queryKeys.rooms({
      officeId: officeId ?? '',
      minCapacity: params.minCapacity,
      from: params.from,
      to: params.to,
    }),
    queryFn: ({ signal }) =>
      api.listRooms(
        {
          officeId: officeId!,
          minCapacity: params.minCapacity,
          from: params.from,
          to: params.to,
        },
        signal,
      ),
    enabled,
    select: (data) => data.items,
  });
}
