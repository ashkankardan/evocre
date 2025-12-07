const METRICS = [
  { key: 'generation', label: 'Generation' },
  { key: 'population', label: 'Population' },
  { key: 'food', label: 'Food' },
  { key: 'poison', label: 'Poison' },
  { key: 'avgFitness', label: 'Avg Fitness' },
  { key: 'bestFitness', label: 'Best Fitness' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'survival', label: 'Survival Rate' },
];

export default class StatsPanel {
  constructor(container, statusElement) {
    this.container = container;
    this.statusElement = statusElement;
    this.dataProvider = null;
    this.intervalId = null;
    this.renderSkeleton();
  }

  renderSkeleton() {
    this.container.innerHTML = '';
    for (const metric of METRICS) {
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = metric.label;
      const value = document.createElement('div');
      value.className = 'value';
      value.dataset.key = metric.key;
      value.textContent = '-';
      this.container.appendChild(label);
      this.container.appendChild(value);
    }
  }

  setDataProvider(fn) {
    this.dataProvider = fn;
  }

  setStatus(text) {
    if (this.statusElement) {
      this.statusElement.textContent = `Game Status: ${text}`;
    }
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  update() {
    if (!this.dataProvider) return;
    const data = this.dataProvider();
    if (!data) return;
    for (const metric of METRICS) {
      const el = this.container.querySelector(`[data-key="${metric.key}"]`);
      if (!el) continue;
      let value = data[metric.key];
      if (value === undefined || value === null) {
        value = '-';
      }
      el.textContent = value;
    }
    if (data.statusText) {
      this.setStatus(data.statusText);
    }
  }
}
