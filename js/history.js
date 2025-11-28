export default class History {
  constructor(container) {
    this.container = container;
  }

  addLog(data) {
    // Create a log entry element
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    
    // Format the content
    // Expected data: generation, population, bestFitness, accuracy, survival
    entry.innerHTML = `
      <div class="entry-header">Gen: ${data.generation}</div>
      <div class="entry-details">
        <span>Pop: ${data.population}</span>
        <span>Best: ${data.bestFitness}</span>
        <span>Acc: ${data.accuracy}</span>
        <span>Surv: ${data.survival}</span>
      </div>
    `;

    // Append to the container (top or bottom? "still keeps the results of previous history" usually implies append)
    this.container.appendChild(entry);
    
    // Scroll to bottom
    this.container.scrollTop = this.container.scrollHeight;
  }
}
