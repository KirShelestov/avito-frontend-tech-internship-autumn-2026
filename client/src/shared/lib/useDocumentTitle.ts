import { useEffect } from 'react';

const BASE_TITLE = 'BookRoom';

/** Без аргумента (или пока данные грузятся) оставляет только базовый заголовок */
export function useDocumentTitle(title?: string | null): void {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}
