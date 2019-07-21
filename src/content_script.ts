import dayjs, { OpUnitType } from 'dayjs';
import { TimePeriods, getTimePeriods } from './data';

const insertTimePeriods = (timePeriods: TimePeriods) => {
  // initialize
  const etp = document.querySelectorAll('ul.hdtbU > li.hdtbItm.etp');
  Object.entries(etp).map(([_, el]) => {
    el.parentNode.removeChild(el);
  });

  const searchUrl = document
    .querySelectorAll("ul.hdtbU > li.hdtbItm[id^='qdr']:not(.hdtbSel)")[1]
    .querySelector('a')
    .getAttribute('href');

  const currentLocation = document.location.href;
  const today = dayjs().format('M/D/YYYY');

  for (let tp of timePeriods) {
    const start = dayjs()
      .subtract(tp.value, tp.unit as OpUnitType)
      .format('M/D/YYYY');

    const plural = tp.value > 1 ? 's' : '';
    const text = `Past ${tp.value} ${tp.unit}${plural}`;

    const re = new RegExp(`tbs=cdr:1,cd_min:${start},cd_max:${today}`);
    const li = document.createElement('li');
    li.classList.add('hdtbItm', 'etp');
    if (re.test(currentLocation)) {
      li.classList.add('hdtbSel');
      li.innerText = text;

      const ind = document.querySelector(
        'div.hdtb-mn-hd.hdtb-tsel > div.mn-hd-txt',
      ) as HTMLElement;
      ind.innerText = text;
    } else {
      const a = document.createElement('a');
      a.innerText = text;
      a.classList.add('q', 'qs');
      a.setAttribute(
        'href',
        encodeURI(`${searchUrl}&tbs=cdr:1,cd_min:${start},cd_max:${today}`),
      );
      li.appendChild(a);
    }

    const el = document.querySelector('ul.hdtbU > li#cdr_opt') as HTMLElement;
    el.parentNode.insertBefore(li, el);
  }
};

(async () => {
  // initialize
  const timePeriods = await getTimePeriods();
  insertTimePeriods(timePeriods);
})();

/*global chrome*/
chrome.storage.onChanged.addListener(async (changes, _) => {
  for (let key in changes) {
    if (key === 'extraTimePeriods') {
      const timePeriods = await getTimePeriods();
      insertTimePeriods(timePeriods);
    }
  }
});
