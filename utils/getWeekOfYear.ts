/**
// 获取今天是今年的第几周
const todayWeek: number = getWeekOfYear();
console.log(`今天是今年的第 ${todayWeek} 周`);

// 获取指定日期是今年的第几周
const inputDate: Date = new Date('2023-06-20'); // 2023 年 6 月 20 日
const inputWeek: number = getWeekOfYear(inputDate);
console.log(`指定日期是今年的第 ${inputWeek} 周`);
 */

export default function getWeekOfYear(date?: Date): number {
  // 如果未提供日期参数，则默认使用今天的日期
  if (!date) {
    date = new Date();
  }

  // 创建一个新的 Date 对象以避免修改原始日期对象
  const targetDate: Date = new Date(date);

  // 将日期设置为当年的第一天
  targetDate.setMonth(0); // 一月
  targetDate.setDate(1); // 第一天

  // 获取第一周的第一天
  let firstWeekStart: number = targetDate.getDay();
  if (firstWeekStart === 0) {
    firstWeekStart = 7; // 如果第一天是星期日，则设置为 7
  }

  // 将目标日期设置为第一周的第一天
  targetDate.setDate(1 + (7 - firstWeekStart));

  // 计算目标日期和输入日期之间的天数差异
  const timeDiff: number = date.getTime() - targetDate.getTime();

  // 计算周数（向上取整）
  const week: number = Math.ceil(timeDiff / (7 * 24 * 60 * 60 * 1000));

  return week;
}
