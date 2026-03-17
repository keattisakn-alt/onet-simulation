/* ============================================
   ONet — Script: Animations & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---- Mobile Hamburger ----
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // ---- Scroll Reveal Animations ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// ==============================================
// Simulation Engine (only runs on simulation.html)
// ==============================================
class ONetSimulation {
  constructor() {
    this.canvas = document.getElementById('sim-canvas');
    this.logEl = document.getElementById('sim-log');
    if (!this.canvas || !this.logEl) return;

    this.nodes = {};
    this.links = [];
    this.packets = [];
    this.running = false;

    this.initNodes();
    this.drawLinks();
    this.drawNodes();
  }

  initNodes() {
    const w = this.canvas.offsetWidth;
    const h = this.canvas.offsetHeight;

    this.nodeData = [
      { id: 'ben', label: 'Ben-01', type: 'omnitrix', x: w * 0.15, y: h * 0.35 },
      { id: 'gwen', label: 'Gwen-02', type: 'omnitrix', x: w * 0.15, y: h * 0.72 },
      { id: 'p1', label: 'Plumber-1', type: 'plumber', x: w * 0.55, y: h * 0.2 },
      { id: 'p2', label: 'Plumber-2', type: 'plumber', x: w * 0.78, y: h * 0.5 },
      { id: 'p3', label: 'Plumber-3', type: 'plumber', x: w * 0.55, y: h * 0.78 },
    ];

    this.linkData = [
      ['ben', 'p1'], ['ben', 'p2'], ['ben', 'p3'],
      ['p1', 'p2'], ['p2', 'p3'], ['p1', 'p3'],
      ['gwen', 'p3']
    ];
  }

  getNode(id) {
    return this.nodeData.find(n => n.id === id);
  }

  clearCanvas() {
    // Remove old elements
    this.canvas.querySelectorAll('.sim-node, .sim-link, .sim-packet').forEach(el => el.remove());
    // Reset node types and positions
    this.nodeData.forEach(n => {
      if (n.id === 'gwen') n.type = 'omnitrix';
      else if (n.id === 'ben') n.type = 'omnitrix';
    });
    // Re-init positions
    this.initNodes();
  }

  drawNodes() {
    this.nodeData.forEach(n => {
      const el = document.createElement('div');
      el.className = `sim-node ${n.type}`;
      el.id = `node-${n.id}`;
      el.style.left = `${n.x - 35}px`;
      el.style.top = `${n.y - 35}px`;
      el.innerHTML = `<span>${n.id.toUpperCase()}</span><span class="node-label">${n.label}</span>`;
      this.canvas.appendChild(el);
    });
  }

  drawLinks() {
    this.linkData.forEach(([a, b]) => {
      const nA = this.getNode(a);
      const nB = this.getNode(b);
      const dx = nB.x - nA.x;
      const dy = nB.y - nA.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      const el = document.createElement('div');
      el.className = 'sim-link';
      el.id = `link-${a}-${b}`;
      el.style.left = `${nA.x}px`;
      el.style.top = `${nA.y}px`;
      el.style.width = `${length}px`;
      el.style.transform = `rotate(${angle}deg)`;
      this.canvas.appendChild(el);
    });
  }

  log(text, type = '') {
    const line = document.createElement('div');
    if (type) line.className = `log-${type}`;
    line.textContent = text;
    this.logEl.appendChild(line);
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  clearLog() {
    this.logEl.innerHTML = '';
  }

  async animatePacket(fromId, toId, type = '', duration = 600) {
    const from = this.getNode(fromId);
    const to = this.getNode(toId);
    const pkt = document.createElement('div');
    pkt.className = `sim-packet ${type}`;
    pkt.style.left = `${from.x - 5}px`;
    pkt.style.top = `${from.y - 5}px`;
    this.canvas.appendChild(pkt);

    await new Promise(resolve => {
      const start = performance.now();
      const animate = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        pkt.style.left = `${from.x + (to.x - from.x) * eased - 5}px`;
        pkt.style.top = `${from.y + (to.y - from.y) * eased - 5}px`;
        if (t < 1) requestAnimationFrame(animate);
        else { pkt.remove(); resolve(); }
      };
      requestAnimationFrame(animate);
    });
  }

  setNodeActive(id, active) {
    const el = document.getElementById(`node-${id}`);
    if (el) el.classList.toggle('active', active);
  }

  setNodeDisconnected(id) {
    const el = document.getElementById(`node-${id}`);
    if (el) {
      el.className = 'sim-node disconnected';
    }
  }

  setLinkBroken(a, b) {
    let el = document.getElementById(`link-${a}-${b}`) || document.getElementById(`link-${b}-${a}`);
    if (el) el.classList.add('broken');
  }

  setLinkActive(a, b, active) {
    let el = document.getElementById(`link-${a}-${b}`) || document.getElementById(`link-${b}-${a}`);
    if (el) el.classList.toggle('active-link', active);
  }

  async delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  disableButtons(disabled) {
    document.querySelectorAll('.sim-controls .btn').forEach(b => {
      b.style.pointerEvents = disabled ? 'none' : '';
      b.style.opacity = disabled ? '0.5' : '';
    });
  }

  // --- Scenario 1: Local Cache Hit ---
  async runScenario1() {
    if (this.running) return;
    this.running = true;
    this.disableButtons(true);
    this.clearCanvas();
    this.drawLinks();
    this.drawNodes();
    this.clearLog();

    this.log('=== Scenario 1: Local Execution (Cached DNA) ===', 'header');
    this.log('');

    this.setNodeActive('ben', true);
    this.log('[Node Ben-01] Requesting transformation to /ONet/DNA/Tetramand/v1...', 'info');
    await this.delay(600);

    this.log('[Node Ben-01] Checking local cache...', '');
    await this.delay(400);

    // Green flash on the node itself - it's a local hit
    const benEl = document.getElementById('node-ben');
    if (benEl) benEl.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';
    await this.delay(300);

    const latency = (Math.random() * 4 + 1).toFixed(2);
    this.log(`[Node Ben-01] SUCCESS: Local cache hit. Zero-latency transformation executed.`, 'success');
    this.log(`[Node Ben-01] Latency: ${latency} ms`, 'success');
    this.log('');
    this.log('✔ No network traffic needed — data served from local cache.', 'success');

    await this.delay(1000);
    this.setNodeActive('ben', false);
    if (benEl) benEl.style.boxShadow = '';
    this.running = false;
    this.disableButtons(false);
  }

  // --- Scenario 2: Federated Consensus ---
  async runScenario2() {
    if (this.running) return;
    this.running = true;
    this.disableButtons(true);
    this.clearCanvas();
    this.drawLinks();
    this.drawNodes();
    this.clearLog();

    this.log('=== Scenario 2: Federated Consensus (New Alien) ===', 'header');
    this.log('');

    this.setNodeActive('ben', true);
    this.log('[Node Ben-01] Requesting transformation to /ONet/DNA/Galvan/v1...', 'info');
    await this.delay(600);

    this.log('[Node Ben-01] Cache miss. Initiating Federated Consensus with Plumber Nodes...', '');
    await this.delay(400);

    // Animate packets from Ben to all Plumber nodes
    this.setLinkActive('ben', 'p1', true);
    this.setLinkActive('ben', 'p2', true);
    this.setLinkActive('ben', 'p3', true);

    this.log('[Network] Sending Interest packet to Plumber nodes...', 'info');
    await Promise.all([
      this.animatePacket('ben', 'p1', 'consensus', 700),
      this.animatePacket('ben', 'p2', 'consensus', 800),
      this.animatePacket('ben', 'p3', 'consensus', 750),
    ]);

    // Plumber consensus
    this.setNodeActive('p1', true);
    this.setNodeActive('p2', true);
    this.setNodeActive('p3', true);
    this.log('[Plumber Nodes] Running PBFT consensus...', 'info');
    await this.delay(1200);

    // Consensus among plumber nodes
    await Promise.all([
      this.animatePacket('p1', 'p2', 'consensus', 400),
      this.animatePacket('p2', 'p3', 'consensus', 400),
      this.animatePacket('p3', 'p1', 'consensus', 400),
    ]);
    await this.delay(400);

    // Send data back
    this.log('[Plumber Nodes] Consensus achieved. Sending Data packet...', 'success');
    await this.animatePacket('p1', 'ben', '', 600);

    const latency = (Math.random() * 200 + 150).toFixed(2);
    this.log(`[Node Ben-01] SUCCESS: Consensus achieved. New capability token issued.`, 'success');
    this.log(`[Node Ben-01] Latency: ${latency} ms`, 'success');
    this.log('');
    this.log('✔ New alien unlocked via distributed consensus.', 'success');

    await this.delay(800);
    this.setNodeActive('ben', false);
    this.setNodeActive('p1', false);
    this.setNodeActive('p2', false);
    this.setNodeActive('p3', false);
    this.setLinkActive('ben', 'p1', false);
    this.setLinkActive('ben', 'p2', false);
    this.setLinkActive('ben', 'p3', false);
    this.running = false;
    this.disableButtons(false);
  }

  // --- Scenario 3: Network Partition ---
  async runScenario3() {
    if (this.running) return;
    this.running = true;
    this.disableButtons(true);
    this.clearCanvas();
    this.drawLinks();
    this.drawNodes();
    this.clearLog();

    this.log('=== Scenario 3: Network Partition (Isolated Node) ===', 'header');
    this.log('');

    // Mark Gwen as disconnected
    this.setNodeDisconnected('gwen');
    this.setLinkBroken('gwen', 'p3');
    this.log('[Network] Gwen-02 is isolated from the network.', 'fail');
    await this.delay(800);

    // Test 1: Cached DNA on isolated node
    this.log('');
    this.log('--- Test A: Cached DNA on isolated node ---', 'header');
    const gwenEl = document.getElementById('node-gwen');
    if (gwenEl) gwenEl.classList.add('active');
    this.log('[Node Gwen-02] Requesting transformation to /ONet/DNA/Tetramand/v1...', 'info');
    await this.delay(600);

    this.log('[Node Gwen-02] Checking local cache...', '');
    await this.delay(400);

    if (gwenEl) gwenEl.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.5)';
    const latency1 = (Math.random() * 4 + 1).toFixed(2);
    this.log(`[Node Gwen-02] SUCCESS: Local cache hit. Zero-latency transformation executed.`, 'success');
    this.log(`[Node Gwen-02] Latency: ${latency1} ms`, 'success');
    this.log('✔ Cached data works even without network.', 'success');
    await this.delay(1000);
    if (gwenEl) gwenEl.style.boxShadow = '';

    // Test 2: Uncached DNA on isolated node
    this.log('');
    this.log('--- Test B: Uncached DNA on isolated node ---', 'header');
    this.log('[Node Gwen-02] Requesting transformation to /ONet/DNA/Kineceleran/v1...', 'info');
    await this.delay(600);

    this.log('[Node Gwen-02] Cache miss. Attempting network...', '');
    await this.delay(400);

    // Attempt to send but fail
    const failPkt = document.createElement('div');
    failPkt.className = 'sim-packet fail';
    const gwenNode = this.getNode('gwen');
    const p3Node = this.getNode('p3');
    failPkt.style.left = `${gwenNode.x - 5}px`;
    failPkt.style.top = `${gwenNode.y - 5}px`;
    this.canvas.appendChild(failPkt);

    await new Promise(resolve => {
      const start = performance.now();
      const animate = (now) => {
        const t = Math.min((now - start) / 400, 1);
        const midX = gwenNode.x + (p3Node.x - gwenNode.x) * 0.3;
        const midY = gwenNode.y + (p3Node.y - gwenNode.y) * 0.3;
        failPkt.style.left = `${gwenNode.x + (midX - gwenNode.x) * t - 5}px`;
        failPkt.style.top = `${gwenNode.y + (midY - gwenNode.y) * t - 5}px`;
        failPkt.style.opacity = `${1 - t}`;
        if (t < 1) requestAnimationFrame(animate);
        else { failPkt.remove(); resolve(); }
      };
      requestAnimationFrame(animate);
    });

    if (gwenEl) gwenEl.style.boxShadow = '0 0 30px rgba(255, 45, 149, 0.5)';
    this.log(`[Node Gwen-02] FAILED: Network partition detected. Cannot reach consensus nodes.`, 'fail');
    this.log('');
    this.log('✘ Uncached data requires network — partition causes failure.', 'fail');

    await this.delay(1000);
    if (gwenEl) {
      gwenEl.style.boxShadow = '';
      gwenEl.classList.remove('active');
    }
    this.running = false;
    this.disableButtons(false);
  }

  // --- Scenario 4: In-Network Caching ---
  async runScenario4() {
    if (this.running) return;
    this.running = true;
    this.disableButtons(true);
    this.clearCanvas();
    this.drawLinks();
    this.drawNodes();
    this.clearLog();

    this.log('=== Scenario 4: In-Network Caching (Peer Data Sharing) ===', 'header');
    this.log('');

    // Step 1: Ben fetches from Plumber & caches
    this.setNodeActive('ben', true);
    this.log('[Node Ben-01] Requesting /ONet/DNA/Galvan/v1 (not cached)...', 'info');
    await this.delay(600);

    this.log('[Node Ben-01] Cache miss → fetching from Plumber-1...', '');
    this.setLinkActive('ben', 'p1', true);
    await this.animatePacket('ben', 'p1', 'consensus', 600);
    this.setNodeActive('p1', true);
    await this.delay(400);
    this.log('[Plumber-1] Serving Data packet...', 'info');
    await this.animatePacket('p1', 'ben', '', 600);

    const benEl = document.getElementById('node-ben');
    if (benEl) benEl.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.5)';
    this.log('[Node Ben-01] SUCCESS: Received & cached /ONet/DNA/Galvan/v1', 'success');
    await this.delay(800);
    if (benEl) benEl.style.boxShadow = '';
    this.setNodeActive('p1', false);
    this.setLinkActive('ben', 'p1', false);

    // Step 2: Gwen requests the same DNA — gets it from Ben (peer cache)
    this.log('');
    this.log('--- Gwen-02 requests the same DNA ---', 'header');
    this.setNodeActive('gwen', true);
    this.log('[Node Gwen-02] Requesting /ONet/DNA/Galvan/v1 (not cached)...', 'info');
    await this.delay(600);

    this.log('[Node Gwen-02] Cache miss → NDN locates nearest cache: Ben-01 (peer)...', '');
    await this.delay(400);

    // Add a temporary link between gwen and ben
    const gwen = this.getNode('gwen');
    const ben = this.getNode('ben');
    const dx = ben.x - gwen.x;
    const dy = ben.y - gwen.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const peerLink = document.createElement('div');
    peerLink.className = 'sim-link active-link';
    peerLink.id = 'link-gwen-ben';
    peerLink.style.left = `${gwen.x}px`;
    peerLink.style.top = `${gwen.y}px`;
    peerLink.style.width = `${length}px`;
    peerLink.style.transform = `rotate(${angle}deg)`;
    this.canvas.appendChild(peerLink);

    this.log('[Network] NDN Interest forwarded via peer mesh...', 'info');
    await this.animatePacket('gwen', 'ben', 'consensus', 500);
    await this.delay(300);
    this.log('[Node Ben-01] Serving from local cache...', '');
    await this.animatePacket('ben', 'gwen', '', 500);

    const gwenEl = document.getElementById('node-gwen');
    if (gwenEl) gwenEl.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.5)';
    const latency = (Math.random() * 20 + 10).toFixed(2);
    this.log(`[Node Gwen-02] SUCCESS: Data served from peer cache (Ben-01).`, 'success');
    this.log(`[Node Gwen-02] Latency: ${latency} ms (much faster than server)`, 'success');
    this.log('');
    this.log('✔ In-network caching eliminates redundant server requests.', 'success');

    await this.delay(1000);
    this.setNodeActive('ben', false);
    this.setNodeActive('gwen', false);
    if (gwenEl) gwenEl.style.boxShadow = '';
    this.running = false;
    this.disableButtons(false);
  }

  // --- Scenario 5: Consensus Rejection ---
  async runScenario5() {
    if (this.running) return;
    this.running = true;
    this.disableButtons(true);
    this.clearCanvas();
    this.drawLinks();
    this.drawNodes();
    this.clearLog();

    this.log('=== Scenario 5: Consensus Rejection (Ethics Violation) ===', 'header');
    this.log('');

    this.setNodeActive('ben', true);
    this.log('[Node Ben-01] Requesting /ONet/DNA/Ectonurite/v1 (RESTRICTED species)...', 'info');
    await this.delay(600);

    this.log('[Node Ben-01] Cache miss. Initiating Federated Consensus...', '');
    await this.delay(400);

    // Send requests to Plumber nodes
    this.setLinkActive('ben', 'p1', true);
    this.setLinkActive('ben', 'p2', true);
    this.setLinkActive('ben', 'p3', true);
    this.log('[Network] Sending Interest packet to Plumber nodes...', 'info');
    await Promise.all([
      this.animatePacket('ben', 'p1', 'consensus', 700),
      this.animatePacket('ben', 'p2', 'consensus', 750),
      this.animatePacket('ben', 'p3', 'consensus', 720),
    ]);

    // Plumber nodes deliberate
    this.setNodeActive('p1', true);
    this.setNodeActive('p2', true);
    this.setNodeActive('p3', true);
    this.log('[Plumber Nodes] Running PBFT consensus...', 'info');
    this.log('[Plumber Nodes] Checking Alien Species Preservation System...', 'info');
    await this.delay(1200);

    // Consensus exchange
    await Promise.all([
      this.animatePacket('p1', 'p2', 'consensus', 400),
      this.animatePacket('p2', 'p3', 'consensus', 400),
      this.animatePacket('p3', 'p1', 'consensus', 400),
    ]);
    await this.delay(600);

    // Rejection! Send fail packet back
    this.log('[Plumber-1] VOTE: REJECT ❌ (endangered species)', 'fail');
    this.log('[Plumber-2] VOTE: REJECT ❌ (ethical violation)', 'fail');
    this.log('[Plumber-3] VOTE: REJECT ❌ (preservation policy)', 'fail');
    await this.delay(600);

    this.log('[Plumber Nodes] Consensus: REJECTED (3/3 votes against).', 'fail');
    await this.animatePacket('p1', 'ben', 'fail', 600);

    const benEl = document.getElementById('node-ben');
    if (benEl) benEl.style.boxShadow = '0 0 30px rgba(255, 45, 149, 0.5)';
    this.log(`[Node Ben-01] FAILED: Consensus rejected the request.`, 'fail');
    this.log(`[Node Ben-01] Reason: Ectonurite is a protected species under ASPS.`, 'fail');
    this.log('');
    this.log('✘ Federated consensus prevents unauthorized access to restricted DNA.', 'fail');

    await this.delay(1000);
    this.setNodeActive('ben', false);
    this.setNodeActive('p1', false);
    this.setNodeActive('p2', false);
    this.setNodeActive('p3', false);
    this.setLinkActive('ben', 'p1', false);
    this.setLinkActive('ben', 'p2', false);
    this.setLinkActive('ben', 'p3', false);
    if (benEl) benEl.style.boxShadow = '';
    this.running = false;
    this.disableButtons(false);
  }

  // --- Helper: Animate node movement ---
  async moveNode(id, newX, newY, duration = 1000) {
    const node = this.getNode(id);
    const el = document.getElementById(`node-${id}`);
    if (!node || !el) return;
    const startX = node.x;
    const startY = node.y;

    await new Promise(resolve => {
      const start = performance.now();
      const animate = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        node.x = startX + (newX - startX) * eased;
        node.y = startY + (newY - startY) * eased;
        el.style.left = `${node.x - 35}px`;
        el.style.top = `${node.y - 35}px`;
        if (t < 1) requestAnimationFrame(animate);
        else resolve();
      };
      requestAnimationFrame(animate);
    });
  }

  // --- Helper: Redraw all links ---
  redrawLinks() {
    this.canvas.querySelectorAll('.sim-link').forEach(el => el.remove());
    this.drawLinks();
  }

  // --- Scenario 6: Node Mobility ---
  async runScenario6() {
    if (this.running) return;
    this.running = true;
    this.disableButtons(true);
    this.clearCanvas();
    // For this scenario, add a link between ben and gwen
    this.linkData.push(['ben', 'gwen']);
    this.drawLinks();
    this.drawNodes();
    this.clearLog();

    const w = this.canvas.offsetWidth;
    const h = this.canvas.offsetHeight;

    this.log('=== Scenario 6: Node Mobility (Dynamic Topology) ===', 'header');
    this.log('');
    this.log('[Network] Ben-01 is mobile and moving through the mesh...', 'info');
    await this.delay(800);

    // Step 1: Ben fetches while connected to P1
    this.setNodeActive('ben', true);
    this.log('[Node Ben-01] Requesting /ONet/DNA/Pyronite/v1 from Plumber-1...', 'info');
    this.setLinkActive('ben', 'p1', true);
    await this.animatePacket('ben', 'p1', 'consensus', 500);
    await this.animatePacket('p1', 'ben', '', 500);
    this.log('[Node Ben-01] SUCCESS: Data received from Plumber-1.', 'success');
    this.setLinkActive('ben', 'p1', false);
    await this.delay(600);

    // Step 2: Ben starts moving
    this.log('');
    this.log('[Network] Ben-01 is moving... Links are changing dynamically.', 'info');
    const newX = w * 0.65;
    const newY = h * 0.55;
    await this.moveNode('ben', newX, newY, 1500);
    // Remove old link from extra and redraw
    this.linkData = this.linkData.filter(([a, b]) => !(a === 'ben' && b === 'gwen') && !(a === 'gwen' && b === 'ben'));
    this.redrawLinks();
    this.log('[Network] Topology updated — Ben-01 now closer to Plumber-2 & Plumber-3.', 'info');
    await this.delay(600);

    // Step 3: Ben fetches again from new nearest node
    this.log('');
    this.log('[Node Ben-01] Requesting /ONet/DNA/Diamondhead/v1 from nearest node...', 'info');
    this.setLinkActive('ben', 'p2', true);
    await this.animatePacket('ben', 'p2', 'consensus', 500);
    this.setNodeActive('p2', true);
    await this.delay(300);
    await this.animatePacket('p2', 'ben', '', 500);

    const benEl = document.getElementById('node-ben');
    if (benEl) benEl.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.5)';
    const latency = (Math.random() * 30 + 20).toFixed(2);
    this.log(`[Node Ben-01] SUCCESS: Seamless handoff to Plumber-2.`, 'success');
    this.log(`[Node Ben-01] Latency: ${latency} ms`, 'success');
    this.log('');
    this.log('✔ NDN routing adapts to node mobility — no session lost.', 'success');

    await this.delay(1000);
    this.setNodeActive('ben', false);
    this.setNodeActive('p2', false);
    this.setLinkActive('ben', 'p2', false);
    if (benEl) benEl.style.boxShadow = '';
    this.running = false;
    this.disableButtons(false);
  }

  // --- Scenario 7: Multi-hop Routing ---
  async runScenario7() {
    if (this.running) return;
    this.running = true;
    this.disableButtons(true);
    this.clearCanvas();
    this.drawLinks();
    this.drawNodes();
    this.clearLog();

    this.log('=== Scenario 7: Multi-hop Routing (Relay via Peers) ===', 'header');
    this.log('');

    // Gwen only connects to P3 directly
    this.log('[Network] Gwen-02 has no direct link to Plumber-1 (data source).', 'info');
    this.log('[Network] Route: Gwen-02 → Plumber-3 → Plumber-1', 'info');
    await this.delay(800);

    this.setNodeActive('gwen', true);
    this.log('');
    this.log('[Node Gwen-02] Requesting /ONet/DNA/Wildmutt/v1...', 'info');
    await this.delay(500);

    this.log('[Node Gwen-02] Cache miss → forwarding Interest to Plumber-3...', '');

    // Hop 1: Gwen → P3
    this.setLinkActive('gwen', 'p3', true);
    await this.animatePacket('gwen', 'p3', 'consensus', 600);
    this.setNodeActive('p3', true);
    this.log('[Plumber-3] Interest received. Not in local store. Forwarding to Plumber-1...', 'info');
    await this.delay(400);

    // Hop 2: P3 → P1
    this.setLinkActive('p1', 'p3', true);
    await this.animatePacket('p3', 'p1', 'consensus', 600);
    this.setNodeActive('p1', true);
    this.log('[Plumber-1] Interest received. Data found! Sending Data packet back...', 'success');
    await this.delay(400);

    // Data returns: P1 → P3
    this.log('[Network] Data packet traversing reverse path: P1 → P3 → Gwen-02...', 'info');
    await this.animatePacket('p1', 'p3', '', 600);
    this.log('[Plumber-3] Caching data for future requests...', '');

    // P3 glows briefly to show caching
    const p3El = document.getElementById('node-p3');
    if (p3El) p3El.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
    await this.delay(400);
    if (p3El) p3El.style.boxShadow = '';

    // Data returns: P3 → Gwen
    await this.animatePacket('p3', 'gwen', '', 600);

    const gwenEl = document.getElementById('node-gwen');
    if (gwenEl) gwenEl.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.5)';
    const hop1Lat = (Math.random() * 20 + 15).toFixed(2);
    const hop2Lat = (Math.random() * 20 + 15).toFixed(2);
    const totalLat = (parseFloat(hop1Lat) + parseFloat(hop2Lat)).toFixed(2);
    this.log(`[Node Gwen-02] SUCCESS: Data received via 2-hop relay.`, 'success');
    this.log(`[Node Gwen-02] Hop 1 latency: ${hop1Lat} ms | Hop 2 latency: ${hop2Lat} ms`, 'success');
    this.log(`[Node Gwen-02] Total latency: ${totalLat} ms`, 'success');
    this.log('');
    this.log('✔ NDN multi-hop routing delivers data without direct server connection.', 'success');
    this.log('✔ Intermediate node (P3) cached the data for faster future access.', 'success');

    await this.delay(1000);
    this.setNodeActive('gwen', false);
    this.setNodeActive('p1', false);
    this.setNodeActive('p3', false);
    this.setLinkActive('gwen', 'p3', false);
    this.setLinkActive('p1', 'p3', false);
    if (gwenEl) gwenEl.style.boxShadow = '';
    this.running = false;
    this.disableButtons(false);
  }
}

// Init simulation if on the simulation page
let sim;
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sim-canvas')) {
    sim = new ONetSimulation();
  }
});

function runScenario(n) {
  if (!sim) return;
  // Update button styles
  document.querySelectorAll('.sim-controls .btn').forEach((b, i) => {
    b.classList.toggle('active-scenario', i === n - 1);
  });
  if (n === 1) sim.runScenario1();
  if (n === 2) sim.runScenario2();
  if (n === 3) sim.runScenario3();
  if (n === 4) sim.runScenario4();
  if (n === 5) sim.runScenario5();
  if (n === 6) sim.runScenario6();
  if (n === 7) sim.runScenario7();
}

// Run All Scenarios sequentially
async function runAllScenarios() {
  if (!sim || sim.running) return;

  const runAllBtn = document.getElementById('btn-run-all');
  if (runAllBtn) {
    runAllBtn.textContent = '⏳ Running...';
    runAllBtn.style.pointerEvents = 'none';
    runAllBtn.style.opacity = '0.6';
  }

  for (let i = 1; i <= 7; i++) {
    runScenario(i);
    // Wait for scenario to finish
    while (sim.running) {
      await new Promise(r => setTimeout(r, 200));
    }
    // Small gap between scenarios
    await new Promise(r => setTimeout(r, 600));
  }

  // Show completion message
  if (sim.logEl) {
    sim.log('');
    sim.log('══════════════════════════════════════════', 'header');
    sim.log('✅ ALL 7 SCENARIOS COMPLETED SUCCESSFULLY', 'success');
    sim.log('══════════════════════════════════════════', 'header');
    sim.log('');
    sim.log('📊 View detailed analysis → Results page', 'info');
  }

  if (runAllBtn) {
    runAllBtn.textContent = '✅ All Complete — View Results →';
    runAllBtn.style.pointerEvents = '';
    runAllBtn.style.opacity = '';
    runAllBtn.classList.add('active-scenario');
    runAllBtn.onclick = () => window.location.href = 'results.html';
  }
}

// ==============================================
// Results Page Animations
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  // --- Animated Counters ---
  const metricValues = document.querySelectorAll('.metric-value');
  if (metricValues.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          const duration = 1500;
          const start = performance.now();
          const isInteger = Number.isInteger(target);

          const animate = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const current = target * eased;
            el.textContent = (isInteger ? Math.round(current) : current.toFixed(1)) + suffix;
            if (t < 1) requestAnimationFrame(animate);
            else el.textContent = (isInteger ? target : target.toFixed(1)) + suffix;
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    metricValues.forEach(el => counterObserver.observe(el));
  }

  // --- Bar Chart Animation ---
  const chartBars = document.querySelectorAll('.chart-bar');
  if (chartBars.length > 0) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll('.chart-bar');
          bars.forEach((bar, index) => {
            const widthPercent = bar.dataset.width;
            setTimeout(() => {
              bar.style.width = widthPercent + '%';
            }, index * 120);
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const chartContainer = document.querySelector('.chart-bar-group');
    if (chartContainer) barObserver.observe(chartContainer);
  }

  // --- Throughput Ring Animation ---
  const tpRings = document.querySelectorAll('.tp-ring');
  if (tpRings.length > 0) {
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percent = parseInt(entry.target.dataset.percent);
          const fill = entry.target.querySelector('.tp-fill');
          if (fill) {
            const circumference = 264;
            const offset = circumference - (circumference * percent / 100);
            fill.style.strokeDashoffset = offset;
          }
          ringObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    tpRings.forEach(ring => ringObserver.observe(ring));
  }
});

// ==============================================
// Interactive Code Demos — runDemo()
// ==============================================
const demoOutputs = {
  1: [
    { type: 'header', text: '═══ Running onet_local_cache.py ═══' },
    { type: 'info',   text: '[ndnSIM] Creating Node "Ben-01" (type: omnitrix)...' },
    { type: 'line',   text: '[ndnSIM] Content Store: added /ONet/DNA/Tetramand/v1 (1.2 KB, signed=True)' },
    { type: 'line',   text: '[Ben-01] Interest → /ONet/DNA/Tetramand/v1' },
    { type: 'line',   text: '[Ben-01] Checking local Content Store...' },
    { type: 'success', text: '✅ CACHE HIT — Latency: 3.2 ms' },
    { type: 'success', text: '📦 Data: /ONet/DNA/Tetramand/v1 (verified)' },
    { type: 'success', text: '🔒 Signature: VERIFIED (self-authenticating data)' },
    { type: 'success', text: '🌐 Network used: NONE (zero network overhead)' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ Running tcp_request.py ═══' },
    { type: 'info',   text: '[TCP] Creating socket connection to dna-server.onet.io:443...' },
    { type: 'line',   text: '[TCP] SYN → SYN-ACK → ACK (3-way handshake: 45 ms)' },
    { type: 'line',   text: '[TLS] ClientHello → ServerHello → Certificate (TLS 1.3: 82 ms)' },
    { type: 'line',   text: '[HTTP] GET /api/dna/tetramand HTTP/1.1' },
    { type: 'line',   text: '[HTTP] Response: 200 OK (server processing: 248 ms)' },
    { type: 'warn',   text: '📡 Response — Latency: 375 ms' },
    { type: 'warn',   text: '🔒 Security: TLS channel only (data not self-verifying)' },
    { type: 'warn',   text: '🌐 Network: Required (full server roundtrip)' },
    { type: 'fail',   text: '⚠️ Single point of failure: dna-server.onet.io' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ COMPARISON RESULTS ═══' },
    { type: 'metric', text: '⚡ ONet Latency: 3.2 ms', good: true },
    { type: 'metric', text: '🐢 TCP/IP Latency: 375 ms', good: false },
    { type: 'metric', text: '📊 Speed improvement: 117x faster', good: true },
    { type: 'metric', text: '🌐 ONet network: NONE | TCP/IP network: Required', good: true },
    { type: 'metric', text: '🔒 ONet security: Data-level | TCP/IP: Channel-level', good: true },
  ],
  2: [
    { type: 'header', text: '═══ Running onet_consensus.py ═══' },
    { type: 'info',   text: '[ndnSIM] Creating 3 Plumber Validator Nodes...' },
    { type: 'line',   text: '[Ben-01] Interest → /ONet/DNA/Galvan/v1 (cache miss)' },
    { type: 'line',   text: '[PBFT] Phase 1: PRE-PREPARE → Plumber-1 (leader)' },
    { type: 'line',   text: '[PBFT] Phase 2: PREPARE → Plumber-2, Plumber-3' },
    { type: 'info',   text: '[Plumber-1] VOTE: ✓ APPROVE (ethics check passed)' },
    { type: 'info',   text: '[Plumber-2] VOTE: ✓ APPROVE (ethics check passed)' },
    { type: 'info',   text: '[Plumber-3] VOTE: ✓ APPROVE (ethics check passed)' },
    { type: 'line',   text: '[PBFT] Phase 3: COMMIT — Quorum reached (3/3)' },
    { type: 'success', text: 'Result: APPROVED ✓' },
    { type: 'success', text: 'Votes: 3/3 (unanimous)' },
    { type: 'success', text: 'Latency: 247 ms' },
    { type: 'success', text: '🛡️ No single point of failure — 3 independent validators' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ Running tcp_auth_server.py ═══' },
    { type: 'info',   text: '[HTTP] POST https://auth.onet.io/api/unlock' },
    { type: 'line',   text: '[TCP] 3-way handshake: 48 ms' },
    { type: 'line',   text: '[TLS] Negotiation: 85 ms' },
    { type: 'line',   text: '[Server] Processing auth request: 210 ms' },
    { type: 'line',   text: '[Server] JWT validation → Database query → Response' },
    { type: 'warn',   text: 'Status: 200 OK' },
    { type: 'warn',   text: 'Latency: 343 ms' },
    { type: 'fail',   text: '⚠️ Single server = single point of failure' },
    { type: 'fail',   text: '⚠️ If auth.onet.io is down → ALL requests fail' },
    { type: 'fail',   text: '⚠️ No distributed validation — one server decides everything' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ COMPARISON RESULTS ═══' },
    { type: 'metric', text: '⚡ ONet PBFT: 247 ms (3 nodes validate)', good: true },
    { type: 'metric', text: '🐢 TCP/IP: 343 ms (1 server decides)', good: false },
    { type: 'metric', text: '🛡️ ONet: Decentralized (no single point of failure)', good: true },
    { type: 'metric', text: '💀 TCP/IP: Centralized (server down = total failure)', good: false },
  ],
  3: [
    { type: 'header', text: '═══ Running onet_partition.py ═══' },
    { type: 'info',   text: '[ndnSIM] Creating Node "Gwen-02" (type: omnitrix)' },
    { type: 'line',   text: '[Gwen-02] Content Store: /ONet/DNA/Tetramand/v1 (cached)' },
    { type: 'fail',   text: '⚠️ Network Partition: ALL LINKS DOWN ✂️' },
    { type: 'line',   text: '' },
    { type: 'info',   text: '--- Test A: Cached DNA (Tetramand) ---' },
    { type: 'line',   text: '[Gwen-02] Interest → /ONet/DNA/Tetramand/v1' },
    { type: 'line',   text: '[Gwen-02] Checking local Content Store...' },
    { type: 'success', text: 'Test A (cached):  ✅ SUCCESS — Latency: 2.8 ms' },
    { type: 'success', text: '📦 Data served from local cache — no network needed!' },
    { type: 'line',   text: '' },
    { type: 'info',   text: '--- Test B: Uncached DNA (Kineceleran) ---' },
    { type: 'line',   text: '[Gwen-02] Interest → /ONet/DNA/Kineceleran/v1' },
    { type: 'line',   text: '[Gwen-02] Cache miss → attempting network...' },
    { type: 'line',   text: '[Gwen-02] Forwarding Interest... FAILED (no links)' },
    { type: 'fail',   text: 'Test B (uncached): ❌ FAILED — Cannot reach consensus nodes' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ Running tcp_partition.py ═══' },
    { type: 'fail',   text: '⚠️ Network Partition: SERVER UNREACHABLE ✂️' },
    { type: 'line',   text: '' },
    { type: 'info',   text: '--- Test A: Previously fetched data (Tetramand) ---' },
    { type: 'line',   text: '[TCP] Connecting to dna-server.onet.io:443...' },
    { type: 'line',   text: '[TCP] SYN → ... waiting ... timeout (3000 ms)' },
    { type: 'fail',   text: 'Test A: ❌ CONNECTION TIMEOUT (no local cache available)' },
    { type: 'line',   text: '' },
    { type: 'info',   text: '--- Test B: New data (Kineceleran) ---' },
    { type: 'line',   text: '[TCP] Connecting to dna-server.onet.io:443...' },
    { type: 'line',   text: '[TCP] SYN → ... waiting ... timeout (3000 ms)' },
    { type: 'fail',   text: 'Test B: ❌ CONNECTION TIMEOUT' },
    { type: 'fail',   text: '💀 TCP/IP: 0% success — ไม่มีแคชในตัว client เลย' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ COMPARISON RESULTS ═══' },
    { type: 'metric', text: '✅ ONet Cached: SUCCESS (2.8 ms) — ทำงานแม้ offline', good: true },
    { type: 'metric', text: '❌ ONet Uncached: FAILED — ต้องใช้ consensus', good: false },
    { type: 'metric', text: '❌ TCP/IP Test A: TIMEOUT — ไม่มี local cache', good: false },
    { type: 'metric', text: '❌ TCP/IP Test B: TIMEOUT — server unreachable', good: false },
    { type: 'metric', text: '📊 ONet: 50% availability | TCP/IP: 0% availability', good: true },
  ],
  4: [
    { type: 'header', text: '═══ Running onet_peer_cache.py ═══' },
    { type: 'info',   text: '[ndnSIM] Creating Node "Ben-01" (omnitrix)' },
    { type: 'info',   text: '[ndnSIM] Creating Node "Gwen-02" (omnitrix)' },
    { type: 'line',   text: '[ndnSIM] Link: Ben-01 ↔ Gwen-02 (10 Mbps, 5ms latency)' },
    { type: 'line',   text: '' },
    { type: 'info',   text: '--- Step 1: Ben fetches from Server ---' },
    { type: 'line',   text: '[Ben-01] Interest → /ONet/DNA/Galvan/v1 (cache miss)' },
    { type: 'line',   text: '[Plumber-1] Serving Data packet → Ben-01' },
    { type: 'success', text: '[Ben-01] Received & cached /ONet/DNA/Galvan/v1 (180 ms)' },
    { type: 'line',   text: '' },
    { type: 'info',   text: '--- Step 2: Gwen requests same data ---' },
    { type: 'line',   text: '[Gwen-02] Interest → /ONet/DNA/Galvan/v1 (cache miss)' },
    { type: 'line',   text: '[NDN] Forwarding Interest → nearest cache...' },
    { type: 'line',   text: '[NDN] Found: Ben-01 has /ONet/DNA/Galvan/v1 in Content Store' },
    { type: 'success', text: 'Source: Ben-01 (peer cache) — NOT server!' },
    { type: 'success', text: 'Latency: 22 ms (peer-to-peer)' },
    { type: 'success', text: '📡 ไม่ต้องไปถึง Server — ดึงจาก Ben โดยตรง!' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ Running tcp_no_cache.py ═══' },
    { type: 'info',   text: '--- User 1 (Ben): Fetch from server ---' },
    { type: 'line',   text: '[HTTP] GET https://dna-server.onet.io/galvan' },
    { type: 'warn',   text: 'Ben: 200 OK — 375 ms (full server roundtrip)' },
    { type: 'line',   text: '' },
    { type: 'info',   text: '--- User 2 (Gwen): Fetch SAME data ---' },
    { type: 'line',   text: '[HTTP] GET https://dna-server.onet.io/galvan' },
    { type: 'line',   text: '[TCP] 3-way handshake: 48 ms' },
    { type: 'line',   text: '[TLS] Negotiation: 85 ms' },
    { type: 'line',   text: '[Server] Processing: 240 ms' },
    { type: 'warn',   text: 'Gwen: 200 OK — 373 ms (SAME full roundtrip!)' },
    { type: 'fail',   text: '⚠️ ไม่มี peer cache — ต้องดึงจาก server ซ้ำทุกครั้ง' },
    { type: 'fail',   text: '⚠️ Server load เพิ่มขึ้น linearly ตามจำนวน user' },
    { type: 'divider', text: '─────────────────────────────────────' },
    { type: 'header', text: '═══ COMPARISON RESULTS ═══' },
    { type: 'metric', text: '⚡ ONet Gwen latency: 22 ms (from peer cache)', good: true },
    { type: 'metric', text: '🐢 TCP/IP Gwen latency: 373 ms (from server)', good: false },
    { type: 'metric', text: '📊 Speed improvement: 17x faster with peer cache', good: true },
    { type: 'metric', text: '📦 ONet server load: 1 request | TCP/IP: 2 requests', good: true },
  ],
};

async function runDemo(n) {
  const output = document.getElementById(`demo-${n}-output`);
  const status = document.getElementById(`demo-${n}-status`);
  const btn = output.closest('.code-demo').querySelector('.demo-run-btn');
  if (!output || !status) return;

  // Disable button
  btn.style.pointerEvents = 'none';
  btn.style.opacity = '0.5';
  btn.textContent = '⏳ Running...';
  status.className = 'demo-status running';
  status.textContent = 'Executing simulation...';

  // Clear output
  output.innerHTML = '';

  const lines = demoOutputs[n];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const el = document.createElement('div');

    if (line.type === 'metric') {
      el.className = `out-metric ${line.good ? '' : 'bad'}`;
      el.textContent = line.text;
    } else {
      el.className = `out-${line.type}`;
      el.textContent = line.text;
    }

    output.appendChild(el);
    output.scrollTop = output.scrollHeight;

    // Variable delay for effect
    const delay = line.type === 'header' ? 300 :
                  line.type === 'divider' ? 400 :
                  line.type === 'metric' ? 150 :
                  line.type === 'success' || line.type === 'fail' ? 200 :
                  line.text === '' ? 100 : 120;
    await new Promise(r => setTimeout(r, delay));
  }

  // Done
  status.className = 'demo-status done';
  status.textContent = '✓ Simulation complete';
  btn.style.pointerEvents = '';
  btn.style.opacity = '';
  btn.textContent = '▶ Run Again';
}
