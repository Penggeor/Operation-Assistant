type Output = {
  paragraph: string;
  percentage: string;
};

export default function calculateWordPercentage(input: string): Output[] {
  // 1. 将多行字符串分解为行并过滤掉空行或只包含空格的行
  const lines = input.split('\n').filter(line => line.trim() !== '');

  let totalWords = 0;
  const wordsPerLine: { text: string, count: number }[] = [];

  // 先计算总单词数量
  for (const line of lines) {
    const trimmedLine = line.trim();
    const words = trimmedLine.split(' ').length;
    wordsPerLine.push({ text: trimmedLine, count: words });
    totalWords += words;
  }

  let cumulativeWords = 0;
  const result: Output[] = [];

  for (const { text, count } of wordsPerLine) {
    cumulativeWords += count;
    const percentage = (cumulativeWords / totalWords) * 100;
    result.push({
      paragraph: text,
      percentage: Math.round(percentage) + '%'
    });
  }

  return result;
}

