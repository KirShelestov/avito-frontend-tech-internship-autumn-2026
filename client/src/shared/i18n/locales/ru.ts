export const ru = {
  common: {
    app: {
      title: 'BookRoom',
      subtitle: 'Каркас приложения. Экраны и маршруты появятся на следующих этапах.',
    },
    actions: {
      retry: 'Попробовать снова',
      cancel: 'Отмена',
      close: 'Закрыть',
      book: 'Забронировать',
      details: 'Подробнее',
      resetFilters: 'Сбросить фильтры',
    },
    states: {
      loading: 'Загрузка…',
      loadError: 'Не удалось загрузить данные',
    },
    field: {
      required: 'Обязательное поле',
    },
    breadcrumbs: {
      label: 'Навигационная цепочка',
    },
    calendar: {
      label: 'Выбор даты',
      prevMonth: 'Предыдущий месяц',
      nextMonth: 'Следующий месяц',
      open: 'Выбрать дату',
    },
  },
} as const;

export type Resources = typeof ru;
