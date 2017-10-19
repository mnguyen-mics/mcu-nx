function filterTableByIncludeStatus(table = [], bool) {
  return table.filter(elem => !elem.toBeRemoved && elem.include === bool);
}

function filterTableByRemovedStatus(table = []) {
  return table.filter(elem => !elem.toBeRemoved);
}

function filterTableByExcludeProperty(table = [], boolean) {
  return table.filter(elem => elem.exclude === boolean && !elem.toBeRemoved);
}

function stringifyTable(table = [], key) {
  return table.reduce((acc, element, i) => (
    `${acc}${`${i > 0 && i < table.length ? ',' : ''} ${element[key]}`}`
  ), '');
}

export {
  filterTableByIncludeStatus,
  filterTableByRemovedStatus,
  filterTableByExcludeProperty,
  stringifyTable,
};
