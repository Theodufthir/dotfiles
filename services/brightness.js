class BrightnessService extends Service {
  // every subclass of GObject.Object has to register itself
  static {
    Service.register(
      this,
      { // 'name-of-signal': [type as a string from GObject.TYPE_<type>],
        'screen-changed': ['float'],
      },
      { // 'kebab-cased-name': [type as a string from GObject.TYPE_<type>, 'r' | 'w' | 'rw']
        'screen-value': ['float', 'rw'],
      },
    );
  }

  #interface = Utils.exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");

  #screenValue = 0;
  #max = Number(Utils.exec('brightnessctl max'));
  #exponent = 5;
  #weight = 1 - (1/this.#max)**(1/this.#exponent);

  get exponent() {
    return this.#exponent;
  }

  set exponent(value) {
    this.#exponent = value;
    this.#weight = 1 - (1/this.#max)**(1/this.#exponent);
  }

  get screen_value() {
    return this.#screenValue;
  }

  set screen_value(percent) {
    if (percent < 0)
      percent = 0;
    if (percent > 1)
      percent = 1;

    const weighted = 1 + (percent - 1) * this.#weight
    const minus = this.#screenValue > percent

    Utils.execAsync(`brightnessctl --exponent=${this.#exponent} -s${minus ? "n" : ""} set ${weighted * 100}% -q`)
  }

  constructor() {
    super();
    const brightness = `/sys/class/backlight/${this.#interface}/brightness`;
    Utils.monitorFile(brightness, () => this.#onChange());
    this.#onChange();
  }

  #onChange() {
    const percent = (Number(Utils.exec('brightnessctl get'))/this.#max)**(1/this.#exponent);
    this.#screenValue = 1 + (percent - 1) / this.#weight

    this.emit('changed'); // emits "changed"
    this.notify('screen-value'); // emits "notify::screen-value"

    this.emit('screen-changed', this.#screenValue);
  }

  connect(event = 'screen-changed', callback) {
    return super.connect(event, callback);
  }
}

const service = new BrightnessService;

export default service;
