const { exampleAtlasItems, scoreAtlasItem } = require("./scoreAtlasItem");

const scoredItems = exampleAtlasItems
  .map((item) => ({
    title: item.title,
    ...scoreAtlasItem(item),
  }))
  .sort((a, b) => b.score - a.score);

console.table(
  scoredItems.map(({ title, score, priority, department, nextAction }) => ({
    title,
    score,
    priority,
    department,
    nextAction,
  })),
);
