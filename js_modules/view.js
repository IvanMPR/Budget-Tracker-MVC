class View {
  constructor() {
    this.type = document.getElementById('inp');
    this.desc = document.querySelector('.inputs__description--input');
    this.val = document.querySelector('.inputs__value--num');
    this.button = document.querySelector('.inputs__submit--btn');
    this.editButton = document.querySelector('.inputs__submit--edit');
    this.incList = document.querySelector('.transactions__incomes--ul');
    this.expList = document.querySelector('.transactions__expenses--ul');
    this.currentSum = document.querySelector('.amounts__current--p');
    this.currentInc = document.querySelector('.amounts__income--p');
    this.currentExp = document.querySelector('.amounts__expense--p');
    this.iconButtonsParent = document.querySelector('.transactions');
    this.percentage = document.querySelector('.amounts__expense--s');
  }
  // Hide Add value button, show Edit button, set focus and populate fields with old values
  addEditClass(oldDesc, oldVal) {
    this.button.classList.add('hidden');
    this.editButton.classList.remove('hidden');
    this.desc.value = oldDesc;
    this.desc.focus();
    this.val.value = oldVal;
  }
  // Clear inputs and return focus to description field
  clearFields() {
    this.desc.value = '';
    this.val.value = '';
    this.desc.focus();
  }
  // Create single entry
  createEntry() {
    if (this.desc.value === '' || !this.val) {
      alert('Please fill in all fields!');
      this.clearFields();
      return;
    }

    const entry = {
      type: this.type.value,
      desc: this.desc.value,
      value: this.val.value,
      id: this.type.value.slice(0, 1).toUpperCase() + Date.now(),
    };

    this.clearFields();
    return entry;
  }
  // Render entries (from entries array)
  renderEntries(arr) {
    this.incList.innerHTML = '';
    this.expList.innerHTML = '';
    arr.forEach(entry => {
      const entryHtml = `
    <li class="transactions__${entry.type}--li" data-id="${entry.id}">
      <p class="transactions__description transactions__incomes--p">${entry.desc}</p>
      <p class="transactions__value transactions__incomes--p">${entry.value}
        <span class="edit"><i title="Edit entry" class="fa-solid fa-pen-to-square edit-icon"></i></span>
        <span title="Delete entry" class="delete"><i class="fa-solid fa-trash-can delete-icon"></i></span>
      </p>
   </li>`;

      document
        .querySelector(`.transactions__${entry.type}--ul`)
        .insertAdjacentHTML('beforeend', entryHtml);
    });
  }
  // Update screen with updated values
  updateSum(obj) {
    this.currentSum.textContent = this.formatAmount(obj.total);
    this.currentInc.textContent = this.formatAmount(obj.incomes);
    this.currentExp.textContent = this.formatAmount(obj.expenses);
    this.percentage.textContent = obj.percentage;
  }

  formatAmount(amount) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
}

export default View;
