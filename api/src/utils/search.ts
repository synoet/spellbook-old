export const stringRankSearch = (query: string,  list: any) => {
  let idxs = query.toLowerCase().split(' ');
  return list.map((item: any) => {
    const labelCount = item.labels.filter((label: string) => idxs.includes(label.toLowerCase())).length;
    const descriptionCount = item.description.toLowerCase().split(' ').filter((word: string) => idxs.includes(word)).length;
    return {
      ...item,
      idx: labelCount + descriptionCount,
    }
  }).sort((a: any, b: any) => b.idx - a.idx);
}


