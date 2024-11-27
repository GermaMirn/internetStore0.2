export function dateFormattingForChats(timeStr: string) {
  const timeObj = new Date(timeStr);

  const day = timeObj.getDate();
  const month = timeObj.toLocaleString('ru-RU', { month: 'long' });

  return `Заказ от ${day} ${month}`;
}
