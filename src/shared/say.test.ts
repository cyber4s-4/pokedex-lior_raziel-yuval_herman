import { Say } from './say.service';

const say = new Say();

test('count length', () => {
  expect(say.getLength('Wakka')).toBe(5);
  expect(say.getLength('')).toBe(0);
  expect(say.getLength(' ')).toBe(1);
  expect(say.getLength('123')).toBe(3);
  expect(say.getLength('one two 3')).toBe(9);
});
