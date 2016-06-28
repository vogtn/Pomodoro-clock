
function CountDownTimer(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
}

CountDownTimer.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.running = true;
  var start = Date.now(),
    that = this,
    diff, obj;

  (function timer() {
    diff = that.duration - (((Date.now() - start) / 1000) | 0);

    if (diff > 0) {
      setTimeout(timer, that.granularity);
    } else {
      diff = 0;
      that.running = false;
    }

    obj = CountDownTimer.parse(diff);
    that.tickFtns.forEach(function(ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }());
};

CountDownTimer.prototype.onTick = function(ftn) {
  if (typeof ftn === 'function') {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function() {
  return !this.running;
};

CountDownTimer.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  };
};

window.onload = function() {
  var display = document.querySelector('#time'),
      display1 = document.querySelector('#time1'),
    timer = new CountDownTimer(1500),
    timer1 = new CountDownTimer(300),
    timeObj = CountDownTimer.parse(1500);

  format(timeObj.minutes, timeObj.seconds);

  timer.onTick(format).onTick(restart);
  timer1.onTick(format);

  document.querySelector('#start').addEventListener('click', function() {
    timer.start();
  });
     function restart() {
        if (this.expired()) {
            alert("5 Minute Break!");
            setTimeout(function () { timer.start(); }, 300 *1000);
          timer1.start();
        }
    }

  function format(minutes, seconds) {
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ':' + seconds;
  }
};