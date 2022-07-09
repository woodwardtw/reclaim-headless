var api_url_div = document.getElementById("api_url_div");
//var roadshowAPI = 'https://roadshowwp.uk.reclaim.cloud/wp-json/wp/v2/presentation?per_page=99&categories=212'
//var roadshowAPI = 'http://multisitetwo.local/headless/wp-json/wp/v2/presentation?per_page=99&categories=3';

var roadshowAPI = scriptParams.url + '&categories=3';
console.log(roadshowAPI);

var placeholder_videoID_div = document.getElementById("placeholder_videoID_div");
var placeholder_videoID = placeholder_videoID_div.textContent;

const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const Interval = luxon.Interval;
let live = false;
let liveTimer;
let checkLiveTimer;
let now = DateTime.now();
const liveBox = document.querySelector('#live-box');
const liveBoxLabel = document.querySelector('#live-box + label');
const programs = [];

const box = {
  Day: {
    classes: [
      'has-background-info',
      'break',
      'box',
      'is-bordered',
      'is-bordered-info',
      'p-2',
      'mt-1',
      'mb-2',
      'mr-2',
      'is-flex',
      'is-flex-direction-column',
      'is-justify-content-center',
      'is-align-items-center',
    ],
    content: (
      title,
      time
    ) => `<h5 class="prg__title mb-0 is-uppercase has-text-white">${title}</h5>
    <span class="prg__time tag is-info">${time}</span>`,
  },
  Break: {
    classes: [
      'has-background-light',
      'break',
      'box',
      'is-bordered',
      'p-2',
      'mt-1',
      'mb-2',
      'mr-2',
      'is-flex',
      'is-flex-direction-column',
      'is-justify-content-center',
      'is-align-items-center',
      'has-transition',
    ],
    content: (
      title,
      time
    ) => `<h5 class="prg__title mb-0 is-uppercase has-transition">${title}</h5>
    <span class="prg__time tag is-light has-transition">${time}</span>`,
  },
  Presentation: {
    classes: [
      'program',
      'box',
      'is-bordered',
      'is-min-width-300',
      'is-clickable',
      'p-2',
      'mt-1',
      'mb-2',
      'mr-2',
      'is-flex',
      'is-justify-content-flex-start',
      'has-transition',
    ],
    content: (title, time, duration, description) => `<div
    class="
      is-flex
      is-flex-direction-column
      is-justify-content-center
      is-align-items-center
    "
  >
    <span class="prg__time tag is-dark mr-2 has-transition">${time}</span>
    <span class="prg__duration tag is-white has-transition">${duration}</span>
  </div>
  <div class="content is-small">
    <h5 class="prg__title mb-0 line-clamp line-clamp-1 has-transition">
      ${title}
    </h5>
    <div class="prg__description line-clamp line-clamp-2 has-transition">
      ${description}
    </div>
  </div>`,
  },
  'Alt-format': {
    classes: [
      'program',
      'box',
      'is-bordered',
      'is-min-width-300',
      'is-clickable',
      'p-2',
      'mt-1',
      'mb-2',
      'mr-2',
      'is-flex',
      'is-justify-content-flex-start',
      'has-transition',
    ],
    content: (title, time, duration, description) => `<div
    class="
      is-flex
      is-flex-direction-column
      is-justify-content-center
      is-align-items-center
    "
  >
    <span class="prg__time tag is-dark mr-2 has-transition">${time}</span>
    <span class="prg__duration tag is-white has-transition">${duration}</span>
  </div>
  <div class="content is-small">
    <h5 class="prg__title mb-0 line-clamp line-clamp-1 has-transition">
      ${title}
    </h5>
    <div class="prg__description line-clamp line-clamp-2 has-transition">
      ${description}
    </div>
  </div>`,
  },
};
const modal = {
  Presentation: {
    classes: ['modal'],
    content: (time, title, modalContent, youtubeID) => `<div
    class="
      modal-background
      animate__animated animate__fadeIn animate__faster
    "
  ></div>
  <div
    class="
      modal-card
      animate__animated animate__zoomIn animate__faster
    "
  >
    <header class="modal-card-head has-background-white">
      <span class="tag is-dark mr-2">${time}</span>
      <p class="modal-card-title">${title}</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      ${modalContent}
    </section>
    <footer class="modal-card-foot has-background-white">
      <button data-target=${youtubeID} class="playerButton button is-danger is-uppercase">
        <span class="material-icons mr-2"> play_circle_outline </span>
        Watch
      </button>
    </footer>
  </div>`,
  },
  'Alt-format': {
    classes: ['modal'],
    content: (time, title, modalContent, mediaID) => `<div
    class="
      modal-background
      animate__animated animate__fadeIn animate__faster
    "
  ></div>
  <div
    class="
      modal-card
      animate__animated animate__zoomIn animate__faster
    "
  >
    <header class="modal-card-head has-background-white">
      <span class="tag is-dark mr-2">${time}</span>
      <p class="modal-card-title">${title}</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      ${modalContent}
    </section>
    <footer class="modal-card-foot has-background-white">
      <a data-target=${mediaID} class="altButton button is-danger is-uppercase" href="https://discord.com/channels/839571610327449630/839573072884662282" target="_blank">
      <span class="material-icons mr-2">headset_mic</span>
        Join
      </a>
    </footer>
  </div>`,
  },
};

class Program {
  constructor(
    id,
    title,
    date,
    time,
    dur,
    speakers,
    type,
    desc,
    mediaType,
    mediaID
  ) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.time = time;
    this.dur = dur;
    this.speakers = speakers;
    this.type = type;
    this.desc = desc;
    this.mediaType = mediaType;
    this.mediaID = mediaID;
    this.complete = false;
  }

  setTime() {
    this.programDateTime = DateTime.fromFormat(
      `${this.date} ${this.time} America/New_York`,
      'D t z'
    );
  }
  setComplete() {
    this.complete = true;
  }
  setSpeakers() {
    !this.speakers
      ? (this.speakers = [])
      : (this.speakers = this.speakers.map((speaker) => speaker.post_title));
  }
  buildSpeakerString() {
    let spkList = this.speakers.map((spk) => {
      let firstLast = `${spk.slice(spk.indexOf(',') + 2)} ${spk.slice(
        0,
        spk.indexOf(',')
      )}`;
      return firstLast;
    });
    let joined = [spkList.slice(0, -1).join(', '), spkList.slice(-1)[0]].join(
      spkList.length < 2 ? '' : ' and '
    );
    return joined;
  }
  buildBox() {
    let boxDiv = document.createElement('div');
    boxDiv.dataset.target = this.id;
    boxDiv.classList.add('prg', ...box[this.type].classes);
    let args;
    switch (this.type) {
      case 'Day':
        args = [
          this.title,
          this.programDateTime.toLocaleString({
            month: 'short',
            day: 'numeric',
            timeZoneName: 'short',
          }),
        ];
        break;
      case 'Break':
        args = [this.title, `${this.dur} min`];
        break;
      default:
        args = [
          this.title,
          this.programDateTime.toLocaleString(DateTime.TIME_SIMPLE),
          `${this.dur} min`,
          this.desc,
        ];
    }
    boxDiv.innerHTML = box[this.type].content(...args);
    return boxDiv;
  }
  buildModal() {
    let modalDiv = document.createElement('div');
    modalDiv.setAttribute('id', this.id);
    modalDiv.classList.add(...modal[this.type].classes);
    let args = [
      this.programDateTime.toLocaleString(DateTime.TIME_SIMPLE),
      this.title,
      this.buildModalContent(),
      this.mediaID,
    ];

    modalDiv.innerHTML = modal[this.type].content(...args);
    return modalDiv;
  }
  buildModalContent() {
    let content = '';
    if (this.buildSpeakerString()) {
      content += `<h6 class="title is-6">${this.buildSpeakerString()}</h6>`;
    }
    if (this.desc) {
      content += `<p>${this.desc}</p>`;
    }
    return content;
  }
}

async function getPrograms() {
  return await axios
    .get(roadshowAPI)
    .then((res) => res.data)
    .then((data) =>
      data.map((prg) => {
        let mediaID;
        let mediaType;
        if (prg.acf.pick_your_media_path) {
          mediaType = prg.acf.pick_your_media_path;
        }
        if (prg.acf.youtube_id) {
          mediaID = prg.acf.youtube_id;
        } else if (prg.acf.youtube_live_id) {
          mediaID = prg.acf.youtube_live_id;
        }
        return new Program(
          prg.id,
          prg.title.rendered,
          prg.acf.presentation_date,
          prg.acf.time,
          prg.acf.duration,
          prg.acf.speakers,
          prg.acf.presentation_type,
          prg.acf.session_description,
          mediaType,
          mediaID
        );
      })
    )
    .then((prgs) =>
      prgs.map((prg) => {
        prg.setSpeakers();
        prg.setTime();
        return prg;
      })
    )
    .then((prgs) =>
      prgs.sort((a, b) =>
        a.programDateTime.toMillis() > b.programDateTime.toMillis() ? 1 : -1
      )
    )
    .then((prgs) => programs.push(...prgs));
}

const programsDiv = document.querySelector('.programs');
const modalsDiv = document.querySelector('.modals');

async function init() {
  await getPrograms();
  programs.forEach((prg) => {
    programsDiv.appendChild(prg.buildBox());
    if (prg.type !== 'Day' && prg.type !== 'Break') {
      modalsDiv.appendChild(prg.buildModal());
    }
  });
  setListeners();
}

init();

const setListeners = () => {
  // Get all "navbar-burger" elements
  const navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  );
  // Check if there are any navbar burgers
  if (navbarBurgers.length > 0) {
    // Add a click event on each of them
    navbarBurgers.forEach((el) => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  //Program box and Modal selectors
  const programDivs = getAll('.program');

  const rootEl = document.documentElement;
  const modals = getAll('.modal');
  const modalCloses = getAll(
    '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button'
  );

  const playButtons = getAll('.playerButton');

  if (programDivs.length > 0) {
    programDivs.forEach(function (el) {
      el.addEventListener('click', function () {
        let target = el.dataset.target;
        openModal(target);
      });
    });
  }

  if (modalCloses.length > 0) {
    modalCloses.forEach(function (el) {
      el.addEventListener('click', function () {
        closeModals();
      });
    });
  }

  if (playButtons.length > 0) {
    playButtons.forEach(function (el) {
      el.addEventListener('click', function () {
        let target = el.dataset.target;
        live = false;
        console.log(live);
        clearTimeout(liveTimer);
        removeLiveBox();
        setLiveToggle();
        playProgram(target);
      });
    });
  }

  function openModal(target) {
    let $target = document.getElementById(target);
    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
  }

  function closeModals() {
    rootEl.classList.remove('is-clipped');
    modals.forEach(function (el) {
      el.classList.remove('is-active');
    });
  }

  function playProgram(youtubeID) {
    player.loadVideoById(youtubeID);
  }

  document.addEventListener('keydown', function (event) {
    var e = event || window.event;

    if (e.keyCode === 27) {
      closeModals();
    }
  });

  //utility
  function getAll(selector) {
    var parent =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : document;

    return Array.prototype.slice.call(parent.querySelectorAll(selector), 0);
  }

  //using j-query to allow mousewheel on horizontal scroller
  $(document).ready(function () {
    $('.is-horz-scrolling').mousewheel(function (e, delta) {
      this.scrollLeft -= delta;
      e.preventDefault();
    });
  });

  //live checkbox listener
  liveBox.addEventListener('change', function () {
    if (this.checked) {
      live = true;
      goLive();
      setLiveToggle();
    } else {
      live = false;
      clearTimeout(liveTimer);
      removeLiveBox();
      stopLive();
      setLiveToggle();
    }
  });
};

//Live functions
function checkLive() {
  console.log('checking for live');
  now = DateTime.now();
  let schedule = programs.filter((prg) => prg.type !== 'Day');
  let first = schedule[0];
  let last = schedule[schedule.length - 1];
  let start = first.programDateTime;
  let dur = Duration.fromObject({ minutes: parseInt(last.dur) });
  let finish = last.programDateTime.plus(dur);
  if (now > start && now < finish) {
    live = true;
    clearTimeout(checkLiveTimer);
    liveBox.checked = true;
    liveBox.disabled = false;
    setLiveToggle();
    goLive();
  } else if (now > finish) {
    live = false;
    clearTimeout(checkLiveTimer);
    setLiveToggle(start, finish);
  } else {
    live = false;
    checkLiveTimer = setTimeout(checkLive, 5000);
    setLiveToggle(start, finish);
  }
}

function setLiveToggle(start, finish) {
  if (arguments.length) {
    liveBox.disabled = true;
    liveBox.checked = false;
    liveBoxLabel.classList.remove('has-text-success');
    now = DateTime.now();
    let diffInDays, diffDisplay;
    if (now < start) {
      diffInDays = start.diff(now, 'days');
      if (Math.round(diffInDays.as('days')) > 1) {
        diffDisplay = Math.round(diffInDays.as('days')) + ' days';
      } else if (Math.round(diffInDays.as('hours')) > 1) {
        diffDisplay = Math.round(diffInDays.as('hours')) + ' hours';
      } else if (Math.round(diffInDays.as('minutes')) > 1) {
        diffDisplay = Math.round(diffInDays.as('minutes')) + ' minutes';
      } else {
        diffDisplay = 'Show is about to start';
      }
      liveBoxLabel.textContent = `Event starts in ${diffDisplay}.`;
    } else {
      // diff = now.diff(finish, "days");
      diff = Interval.fromDateTimes(finish, now);
      liveBoxLabel.textContent = `Event ended ${Math.floor(
        diff.length('days')
      )} days ago.`;
    }
  } else {
    if (live) {
      liveBox.disabled = false;
      liveBox.checked = true;
      liveBoxLabel.classList.add('has-text-success');
      liveBoxLabel.textContent = 'Live';
    } else {
      liveBox.disabled = false;
      liveBox.checked = false;
      liveBoxLabel.classList.remove('has-text-success');
      liveBoxLabel.textContent = 'Go live';
    }
  }
}

function buildLivePlaylist() {
  now = DateTime.now();
  let schedule = programs.filter(
    (prg) => prg.type === 'Presentation' && !prg.complete
  );
  let schedListStart = schedule.findIndex((prg) => {
    let start = prg.programDateTime;
    let dur = Duration.fromObject({ minutes: parseInt(prg.dur) });
    let finish = start.plus(dur);
    return (now > start && now < finish) || now < start;
  });
  console.log(schedListStart);
  if (schedListStart !== -1) {
    let liveSched = schedule.slice(schedListStart);
    let livePlayList = liveSched.map((prg) => prg.mediaID);
    return livePlayList;
  }
  return (live = false);
}

function findLiveBox() {
  console.log('live');
  clearTimeout(liveTimer);
  liveTimer = setTimeout(findLiveBox, 5000);
  now = DateTime.now();
  let schedule = programs.filter((prg) => prg.type !== 'Day');
  let livePrg = schedule.find((prg) => {
    let start = prg.programDateTime;
    let dur = Duration.fromObject({ minutes: parseInt(prg.dur) });
    let finish = start.plus(dur);
    return now > start && now < finish;
  });
  if (livePrg) {
    setLiveBox(livePrg.id);
  } else {
    removeLiveBox();
  }
  let last = schedule[schedule.length - 1];
  let dur = Duration.fromObject({ minutes: parseInt(last.dur) });
  let finish = last.programDateTime.plus(dur);
  if (now > finish) {
    clearTimeout(liveTimer);
    checkLive();
  }
}

function goLive() {
  live = true;
  findLiveBox();
  let playlist = buildLivePlaylist();
  player.loadPlaylist(playlist);
}

function stopLive() {
  live = false;
  clearTimeout(liveTimer);
  player.cueVideoById(placeholder_videoID);
}

function findLive() {
  console.log('live');
  clearTimeout(liveTimer);
  liveTimer = setTimeout(findLive, 5000);
  now = DateTime.now();
  let schedule = programs.filter((prg) => prg.type !== 'Day');
  let liveShow = schedule.find((prg) => {
    let start = prg.programDateTime;
    let dur = Duration.fromObject({ minutes: parseInt(prg.dur) });
    let finish = start.plus(dur);
    return now > start && now < finish;
  });
  let nextShow = schedule
    .filter((prg) => prg.type !== 'Break')
    .find((prg) => {
      let start = prg.programDateTime;
      return now < start;
    });
  if (player.getPlayerState() !== 1) {
    if (liveShow) {
      if (!liveShow.complete) {
        if (liveShow.type === 'Presentation') {
          player.loadVideoById(liveShow.mediaID);
          player.playVideo();
        }
      } else {
        player.cueVideoById('Vufa6FJOr0s');
      }
      setLiveBox(liveShow.id);
    } else {
      player.cueVideoById('Vufa6FJOr0s');
    }
  }
}

function removeLiveBox() {
  let boxes = document.querySelectorAll('.prg');
  let times = document.querySelectorAll('.prg__time');
  let durations = document.querySelectorAll('.prg__duration');
  let titles = document.querySelectorAll('.prg__title');
  let descriptions = document.querySelectorAll('.prg__description');
  boxes.forEach((box) => {
    box.classList.remove('is-bordered-success', 'has-background-success-light');
  });
  times.forEach((time) => {
    time.classList.remove('is-success');
  });
  durations.forEach((dur) => {
    dur.classList.remove('is-success', 'is-light');
  });
  titles.forEach((title) => {
    title.classList.remove('has-text-success');
  });
  descriptions.forEach((desc) => {
    if (desc.firstElementChild) {
      desc.firstElementChild.classList.remove('has-text-success-dark');
    } else {
      desc.classList.remove('has-text-success-dark');
    }
  });
}

function setLiveBox(id) {
  removeLiveBox();
  let liveBox = document.querySelector(`[data-target="${id}"]`);
  let liveTitle = document.querySelector(`[data-target="${id}"] .prg__title`);
  let liveTime = document.querySelector(`[data-target="${id}"] .prg__time`);
  let liveDuration = document.querySelector(
    `[data-target="${id}"] .prg__duration`
  );
  let liveDescription = document.querySelector(
    `[data-target="${id}"] .prg__description`
  );
  liveBox.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'center',
  });

  liveBox.classList.add('is-bordered-success', 'has-background-success-light');
  if (liveTime) {
    liveTime.classList.add('is-success');
  }
  if (liveDuration) {
    liveDuration.classList.add('is-success', 'is-light');
  }
  if (liveTitle) {
    liveTitle.classList.add('has-text-success');
  }
  if (liveDescription) {
    if (liveDescription.firstElementChild) {
      liveDescription.firstElementChild.classList.add('has-text-success-dark');
    } else {
      liveDescription.classList.add('has-text-success-dark');
    }
  }
}

function timedRemoveLiveBox(prg) {
  let now = DateTime.now();
  let start = prg.programDateTime;
  let dur = Duration.fromObject({ minutes: parseInt(prg.dur) });
  let finish = start.plus(dur);
  if (now > finish) {
    removeLiveBox();
  }
}

//Youtube Player
const playerFigure = document.querySelector('#player-figure');
// asynchronously loads the IFrame Player API
let tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// update iframe
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  playerFigure.classList.remove('is-invisible');
  checkLive();
}

//The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
  if (live) {
    if (event.data == YT.PlayerState.ENDED) {
      setProgramComplete();
    }
  }
}

function setProgramComplete() {
  let video_id = player.getVideoUrl().split('v=')[1];
  let ampersandPosition = video_id.indexOf('&');
  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  let foundPrg = programs.find((prg) => prg.mediaID === video_id);
  foundPrg.setComplete();
  timedRemoveLiveBox(foundPrg);
}
