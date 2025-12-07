export default class History {
  constructor(container) {
    this.container = container;
  }

  addLog(data) {
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    
    entry.innerHTML = `
      <div class="entry-header">Gen: ${data.generation}</div>
      <div class="entry-details">
        <span>Pop: ${data.population}</span>
        <span>Best: ${data.bestFitness}</span>
        <span>Acc: ${data.accuracy}</span>
        <span>Surv: ${data.survival}</span>
      </div>
    `;

    this.container.appendChild(entry);
    
    this.container.scrollTop = this.container.scrollHeight;
  }
}
