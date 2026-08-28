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
    room: {
      floor: '{{floor}} этаж',
      capacity: 'Вместимость: до {{count}} человек',
      availableForSlot: 'Доступно на выбранное время',
      unavailableForSlot: 'Недоступно на выбранное время',
      freeAllDay: 'Свободна весь день',
      busyUntil: 'Занята до {{time}}',
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
    filters: {
      date: 'Дата',
      startTime: 'Время начала',
      duration: 'Длительность',
      capacity: 'Вместимость',
      capacityAny: 'Не указано',
      capacityValue: 'Мин. {{count}} чел.',
    },
    rooms: {
      heading: 'Доступные переговорные в этом офисе',
      loading: 'Загрузка переговорных…',
      emptyTitle: 'Нет доступных переговорных',
      emptyText: 'Попробуйте изменить параметры фильтрации или выбрать другой офис',
      errorText: 'Произошла ошибка при загрузке списка переговорных',
      pickOfficeTitle: 'Выберите офис',
      pickOfficeText: 'Для просмотра доступных переговорных сначала выберите офис из списка выше',
      localTime: 'Местное время: {{time}} {{zone}}',
      addressUnknown: 'Адрес не выбран',
      chooseOffice: 'Выберите офис',
    },
  },
} as const;

export type Resources = typeof ru;
