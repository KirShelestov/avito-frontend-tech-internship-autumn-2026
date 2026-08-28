import { describe, expect, it } from 'vitest';
import {
  isAlignedToStep,
  maskTimeInput,
  minutesToTime,
  snapTime,
  stepTime,
  timeToMinutes,
} from './time';

describe('timeToMinutes', () => {
  it('парсит корректное время', () => {
    expect(timeToMinutes('09:00')).toBe(540);
    expect(timeToMinutes('9:30')).toBe(570);
    expect(timeToMinutes('20:00')).toBe(1200);
  });

  it('возвращает null для мусора', () => {
    expect(timeToMinutes('')).toBeNull();
    expect(timeToMinutes('25:00')).toBeNull();
    expect(timeToMinutes('10:75')).toBeNull();
    expect(timeToMinutes('abc')).toBeNull();
  });
});

describe('minutesToTime', () => {
  it('форматирует с ведущими нулями', () => {
    expect(minutesToTime(540)).toBe('09:00');
    expect(minutesToTime(575)).toBe('09:35');
  });
});

describe('isAlignedToStep', () => {
  it('проверяет кратность шагу 15', () => {
    expect(isAlignedToStep('09:15', 15)).toBe(true);
    expect(isAlignedToStep('09:07', 15)).toBe(false);
  });
});

describe('maskTimeInput', () => {
  it('прогрессивно подставляет двоеточие', () => {
    expect(maskTimeInput('9')).toBe('9');
    expect(maskTimeInput('09')).toBe('09');
    expect(maskTimeInput('093')).toBe('09:3');
    expect(maskTimeInput('0930')).toBe('09:30');
  });

  it('автоподставляет ведущий ноль, если первая цифра > 2', () => {
    expect(maskTimeInput('930')).toBe('09:30');
    expect(maskTimeInput('9:30')).toBe('09:30');
  });

  it('ограничивает часы и минуты', () => {
    expect(maskTimeInput('2599')).toBe('23:59');
  });

  it('игнорирует нецифры', () => {
    expect(maskTimeInput('a9b3c0')).toBe('09:30');
  });
});

describe('snapTime', () => {
  const min = 9 * 60;
  const max = 20 * 60;

  it('округляет к ближайшему шагу', () => {
    expect(snapTime('09:07', 15, min, max)).toBe('09:00');
    expect(snapTime('09:08', 15, min, max)).toBe('09:15');
  });

  it('зажимает в границы', () => {
    expect(snapTime('07:00', 15, min, max)).toBe('09:00');
    expect(snapTime('23:00', 15, min, max)).toBe('20:00');
  });
});

describe('stepTime', () => {
  const min = 9 * 60;
  const max = 20 * 60;

  it('шагает вверх и вниз', () => {
    expect(stepTime('09:00', 1, 15, min, max)).toBe('09:15');
    expect(stepTime('09:00', -1, 15, min, max)).toBe('09:00');
    expect(stepTime('09:30', -1, 15, min, max)).toBe('09:15');
  });

  it('не выходит за границы', () => {
    expect(stepTime('19:45', 5, 15, min, max)).toBe('20:00');
  });
});
