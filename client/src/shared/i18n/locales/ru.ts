export const ru = {
  common: {
    app: {
      title: 'BookRoom',
      subtitle: 'Каркас приложения. Экраны и маршруты появятся на следующих этапах.',
    },
    nav: {
      rooms: 'Переговорные',
      bookings: 'Мои бронирования',
    },
    notFound: {
      title: 'Страница не найдена',
      description:
        'Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.',
      back: 'Вернуться к переговорным',
    },
    appError: {
      title: 'Что-то пошло не так',
      description: 'Произошла непредвиденная ошибка. Попробуйте обновить страницу.',
      reload: 'Обновить',
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
