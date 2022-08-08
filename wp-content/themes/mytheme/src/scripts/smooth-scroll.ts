// @ts-nocheck
export class SmoothScroll {
  updatePos: (newPos: number) => void;

  constructor(speed: number, smooth: number) {
    const target =
      document.scrollingElement ||
      document.documentElement ||
      document.body.parentNode ||
      document.body; // cross browser support for document scrolling

    let moving = false;
    let pos = target.scrollTop;
    const frame =
      target === document.body && document.documentElement
        ? document.documentElement
        : target; // safari is the new IE

    var requestFrame = (function () {
      // requestAnimationFrame cross browser
      return (
        window.requestAnimationFrame ||
        function (func) {
          window.setTimeout(func, 1000 / 50);
        }
      );
    })();

    function update() {
      moving = true;

      var delta = (pos - target.scrollTop) / smooth;

      target.scrollTop += delta;

      if (Math.abs(delta) > 0.5) requestFrame(update);
      else moving = false;
    }

    function normalizeWheelDelta(e: WheelEvent) {
      if (e.detail) {
        if (e.deltaY)
          return (-e.deltaY / e.detail / 40) * (e.detail > 0 ? 1 : -1);
        // Opera
        else return -e.detail / 3; // Firefox
      } else return -e.deltaY / 120; // IE,Safari,Chrome
    }

    function scrolled(e: WheelEvent) {
      e.preventDefault(); // disable default scrolling

      const delta = normalizeWheelDelta(e);

      pos += -delta * speed;
      pos = Math.max(
        0,
        Math.min(pos, target.scrollHeight - frame.clientHeight)
      ); // limit scrolling

      if (!moving) update();
    }

    document.addEventListener('wheel', scrolled, { passive: false });

    const onmousedown = function (e) {
      if (e && (e.which == 2 || e.button == 4)) {
        document.removeEventListener('wheel', scrolled);
      }
    };
    // Handle middle mouse click and scroll
    document.addEventListener('mousedown', onmousedown);

    const onmouseup = function (e) {
      if (!(e && (e.which == 2 || e.button == 4))) return;

      pos = target.scrollTop;
      document.addEventListener('wheel', scrolled, { passive: false });
    };

    document.addEventListener('mouseup', onmouseup);

    const updatePos = (newPos: number) => {
      pos = newPos;
    };

    this.updatePos = updatePos;
  }
}
