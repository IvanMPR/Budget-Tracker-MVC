class Model {
  constructor() {
    this.entriesArray = localStorage.getItem('entries')
      ? JSON.parse(localStorage.getItem('entries'))
      : [];
    this.stateObject = {
      incomes: 0,
      expenses: 0,
      total: 0,
      percentage: 0,
      storage: {
        id: '',
      },
    };
  }
  // Push single entry to entries array
  pushEntry(obj) {
    // prevent pushing undefined to entries array(could happen if one of the required inputs is missing)
    if (!obj) return;
    else this.entriesArray.push(obj);
  }
  // Generic function to filter and calculate array sum
  calcSum(type, arr) {
    return arr
      .filter(entry => entry.type === type)
      .map(entry => entry.value)
      .reduce((acc, curr) => acc + Number(curr), 0);
  }
  // Calculate and update Modal internal data
  parseDataFromEntries() {
    const incomesSum = this.calcSum('incomes', this.entriesArray);
    const expensesSum = this.calcSum('expenses', this.entriesArray);

    this.stateObject.incomes = incomesSum;
    this.stateObject.expenses = expensesSum;
    this.stateObject.total = incomesSum - expensesSum;
    const percentage =
      (this.stateObject.expenses / this.stateObject.incomes) * 100;

    if (isNaN(percentage) || percentage === Infinity || percentage < 0) {
      this.stateObject.percentage = '---';
    } else if (percentage % 1 !== 0) {
      this.stateObject.percentage = `${percentage.toFixed(1)} %`;
    } else {
      this.stateObject.percentage = `${percentage} %`;
    }

    return this.stateObject;
  }
  // Function to store Modal internal updated data
  updateState() {
    this.parseDataFromEntries();
  }
  // Find entry in entries arr by it's id, delete it, return modified entries arr
  deleteEntry(id) {
    const transformedEntriesArr = this.entriesArray.map(entry => entry.id);
    const index = transformedEntriesArr.indexOf(id);
    this.entriesArray.splice(index, 1);
  }
  // Find entry by it's id. Used for editing entry data
  findEntry(id) {
    return this.entriesArray.filter(entry => entry.id === id)[0];
  }
  // Modify entry with new data
  editEntry(id, newDesc, newVal) {
    this.entriesArray.map(entry => {
      if (entry.id !== id) return entry;
      else {
        entry.desc = newDesc;
        entry.value = newVal;
        return entry;
      }
    });
  }
}

export default Model;
