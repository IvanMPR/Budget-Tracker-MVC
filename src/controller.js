import Model from '../js_modules/model.js';
import View from '../js_modules/view.js';

class Controller {
  constructor(m, v) {
    this.m = m;
    this.v = v;
  }
  // Controller method to clear input fields and reset temporary storage variable to ''
  ctrlClearFields() {
    this.v.clearFields();
    this.m.stateObject.storage.id = '';
  }
  // Controller method to return created entry
  ctrlEntry() {
    const object = this.v.createEntry();
    return object;
  }
  // Controller method to push entry(v) into entries arr(m)
  ctrlPushEntry() {
    this.m.pushEntry(this.ctrlEntry());
  }
  // Controller method to update internal Model state
  ctrlUpdateState() {
    this.m.updateState();
  }
  // Controller method to render entries
  ctrlRenderEntries() {
    this.v.renderEntries(this.m.entriesArray);
  }
  // Controller method to update sum
  ctrlUpdateSum() {
    this.v.updateSum(this.m.stateObject);
  }
  // Controller combined method to create entry and update both model and view
  ctrlAddEntry() {
    this.ctrlPushEntry();
    this.ctrlUpdateEntries();
  }
  // Controller method to call m.deleteEntry
  ctrlDeleteEntry(id) {
    this.m.deleteEntry(id);
  }
  // Controller combined method to delete entry and update both model and view
  ctrlDeleteSequence(e) {
    const id = e.target.closest('li').dataset.id;
    this.ctrlDeleteEntry(id);
    this.ctrlUpdateEntries();
  }
  // Controller combined method to update model and view after changes
  ctrlUpdateEntries() {
    this.ctrlUpdateState();
    this.ctrlUpdateSum();
    this.ctrlRenderEntries();
  }
  // Controller method to edit entry
  ctrlEditEntry(id, newDesc, newVal) {
    this.m.editEntry(id, newDesc, newVal);
  }
  // Controller method for calling v.addEditClass
  ctrlAddEditClass(oldDesc, oldVal) {
    this.v.addEditClass(oldDesc, oldVal);
  }
  // Controller combined method for getting and storing id, description and value to be edited
  ctrlEditFirstSequence(e) {
    const id = e.target.closest('li').dataset.id;
    this.m.stateObject.storage.id = id;
    const currentEntry = this.ctrlFindEntry(id);
    const oldValue = currentEntry.value;
    const oldDesc = currentEntry.desc;

    this.ctrlAddEditClass(oldDesc, oldValue);
  }
  // Controller combined method to swap old description and value with new ones, and update accordingly
  ctrlEditLastSequence(id, newDesc, newVal) {
    this.ctrlEditEntry(id, newDesc, newVal);
    this.ctrlUpdateEntries();
    this.ctrlRemoveEditClass();
  }
  // Controller combined method for hiding edit button, showing add entry button, and clearing fields
  ctrlRemoveEditClass() {
    this.v.editButton.classList.add('hidden');
    this.v.button.classList.remove('hidden');
    this.ctrlClearFields();
  }
  // Controller method for finding desired entry
  ctrlFindEntry(id) {
    return this.m.findEntry(id);
  }
  // Controller combined method for adding event listeners
  listeners() {
    // Add entry on button click
    this.v.button.addEventListener('click', this.ctrlAddEntry.bind(this));
    // Add entry on 'Enter' press
    document.addEventListener('keydown', e => {
      // If add entry button is visible (doesn't have a 'hidden' class), addEntry will trigger
      if (e.key === 'Enter' && !this.v.button.classList.contains('hidden'))
        this.ctrlAddEntry();
      // If edit button is visible (doesn't have a 'hidden' class ) editLastSequence will trigger
      else if (
        e.key === 'Enter' &&
        !this.v.editButton.classList.contains('hidden')
      )
        this.ctrlEditLastSequence(
          this.m.stateObject.storage.id,
          this.v.desc.value,
          this.v.val.value
        );
    });
    // Click on Font Awesome delete icon, to delete entry
    this.v.iconButtonsParent.addEventListener('click', e => {
      if (!e.target.classList.contains('delete-icon')) return;
      else this.ctrlDeleteSequence(e);
    });
    // Click on Font Awesome edit icon, to begin the first sequence of editing
    this.v.iconButtonsParent.addEventListener('click', e => {
      if (!e.target.classList.contains('edit-icon')) return;
      else this.ctrlEditFirstSequence(e);
    });
    // Click on Edit button to apply changes
    this.v.editButton.addEventListener('click', () => {
      this.ctrlEditLastSequence(
        this.m.stateObject.storage.id,
        this.v.desc.value,
        this.v.val.value
      );
    });

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('entries', JSON.stringify(this.m.entriesArray));
    });

    window.addEventListener('load', () => {
      if (localStorage.getItem('entries')) {
        this.ctrlUpdateEntries();
      }
    });
  }
}

const app = new Controller(new Model(), new View());

app.listeners();
