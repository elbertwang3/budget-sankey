export function prepareSankeyData(data) {
  data.forEach((d) => {
    d.value = +d.value;
  });
  const nodes = [...data.map((d) => d.source), ...data.map((d) => d.target)]
    .filter(onlyUnique)
    .map((d) => ({ id: d }));

  const result = { nodes: nodes, links: data };
  return result;
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
