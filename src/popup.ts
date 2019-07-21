import dayjs from 'dayjs';
import {
  TimePeriod,
  TimePeriods,
  getTimePeriods,
  addTimePeriod,
  removeTimePeriod,
} from './data';

const showTimePeriods = (timePeriods: TimePeriods) => {
  const ul = document.getElementById('time-period-list') as HTMLElement;
  ul.style.paddingLeft = '15px';

  // initialize
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  // insert All of timePeriods
  timePeriods.map(tp => {
    const li = document.createElement('li');
    const plural = tp.value > 1 ? 's' : '';
    const span = document.createElement('span');
    span.innerText = `${tp.value} ${tp.unit}${plural}  `;

    li.appendChild(span);

    const button = document.createElement('button');
    button.innerText = 'remove';
    button.dataset.value = String(tp.value);
    button.dataset.unit = String(tp.unit);
    button.addEventListener('click', async (e: HTMLElementEventMap) => {
      const periodValue = Number(e.target.dataset.value);
      const periodUnit = String(e.target.dataset.unit);
      await removeTimePeriod({
        value: periodValue,
        unit: periodUnit,
      });
    });
    li.appendChild(button);

    ul.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  // initialize
  const timePeriods = await getTimePeriods();
  showTimePeriods(timePeriods);

  // button trigger
  const addButton = document.getElementById('add-time-period') as HTMLElement;
  addButton.addEventListener('click', async () => {
    const elValue = document.getElementById('period-value') as HTMLInputElement;
    const elUnit = document.getElementById('period-unit') as HTMLInputElement;
    const periodValue = Number(elValue.value);
    const periodUnit = String(elUnit.value);
    await addTimePeriod({
      value: periodValue,
      unit: periodUnit,
    });
  });
});

/*global chrome*/
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  for (let key in changes) {
    if (key === 'extraTimePeriods') {
      const timePeriods = await getTimePeriods();
      showTimePeriods(timePeriods);
    }
  }
});
