/**
 * Deist Technologies - Enterprise Interactive Web Engine
 * Dynamic Currency Switcher, Interactive ROI Calculator, Consultation Booking Modal,
 * Toast Notification System & AI Architecture Playground Visualizer.
 */

window.DeistApp = (function () {
  'use strict';

  // State Management
  const state = {
    currency: localStorage.getItem('deist_currency') || 'INR', // 'INR' or 'USD'
    usdToInrRate: 83,
    bookingData: {
      date: null,
      time: null,
      package: 'Sovereign AI Enterprise',
      name: '',
      email: '',
      company: ''
    }
  };

  // --- 1. DYNAMIC CURRENCY SWITCHER ---
  function initCurrencySwitcher() {
    const inrBtns = document.querySelectorAll('.currency-btn-inr');
    const usdBtns = document.querySelectorAll('.currency-btn-usd');

    // Find all currency buttons in headers
    document.querySelectorAll('header button').forEach(btn => {
      const txt = btn.textContent.trim();
      if (txt.includes('INR')) {
        btn.classList.add('currency-btn-inr');
      } else if (txt.includes('USD')) {
        btn.classList.add('currency-btn-usd');
      }
    });

    updateCurrencyUI();

    document.addEventListener('click', (e) => {
      const inrBtn = e.target.closest('.currency-btn-inr');
      const usdBtn = e.target.closest('.currency-btn-usd');

      if (inrBtn) {
        setCurrency('INR');
      } else if (usdBtn) {
        setCurrency('USD');
      }
    });
  }

  function setCurrency(curr) {
    state.currency = curr;
    localStorage.setItem('deist_currency', curr);
    updateCurrencyUI();
    // Re-run ROI calculator if on page
    updateRoiCalculator();
    showToast(`Currency updated to ${curr === 'INR' ? 'Indian Rupee (₹)' : 'US Dollar ($)'}`, 'info', 'Currency Preference');
  }

  function updateCurrencyUI() {
    const isINR = state.currency === 'INR';

    // Update Header Button Styles
    document.querySelectorAll('.currency-btn-inr').forEach(btn => {
      if (isINR) {
        btn.className = 'currency-btn-inr px-3 py-1 rounded-full clay-pill-white shadow-sm text-on-surface font-label-numeric text-label-numeric font-medium transition-all';
      } else {
        btn.className = 'currency-btn-inr px-3 py-1 rounded-full text-on-surface-variant hover:text-on-surface font-label-numeric text-label-numeric font-medium transition-colors';
      }
    });

    document.querySelectorAll('.currency-btn-usd').forEach(btn => {
      if (!isINR) {
        btn.className = 'currency-btn-usd px-3 py-1 rounded-full clay-pill-white shadow-sm text-on-surface font-label-numeric text-label-numeric font-medium transition-all';
      } else {
        btn.className = 'currency-btn-usd px-3 py-1 rounded-full text-on-surface-variant hover:text-on-surface font-label-numeric text-label-numeric font-medium transition-colors';
      }
    });

    // Update Price Elements
    document.querySelectorAll('[data-price-usd]').forEach(el => {
      const usdPrice = parseFloat(el.getAttribute('data-price-usd'));
      const inrPrice = el.getAttribute('data-price-inr') 
        ? parseFloat(el.getAttribute('data-price-inr')) 
        : Math.round(usdPrice * state.usdToInrRate);

      const period = el.getAttribute('data-price-period') || '/mo';

      if (isINR) {
        el.innerHTML = `₹${inrPrice.toLocaleString('en-IN')}<span class="text-sm font-normal opacity-70">${period}</span>`;
      } else {
        el.innerHTML = `$${usdPrice.toLocaleString('en-US')}<span class="text-sm font-normal opacity-70">${period}</span>`;
      }
    });

    // Update static currency symbols
    document.querySelectorAll('.currency-symbol').forEach(el => {
      el.textContent = isINR ? '₹' : '$';
    });
  }

  function formatCurrency(usdValue) {
    if (state.currency === 'INR') {
      const inrVal = Math.round(usdValue * state.usdToInrRate);
      return `₹${inrVal.toLocaleString('en-IN')}`;
    }
    return `$${Math.round(usdValue).toLocaleString('en-US')}`;
  }

  // --- 2. INTERACTIVE ROI & COMPUTE SAVINGS CALCULATOR ---
  function initRoiCalculator() {
    const sliderWorkflows = document.getElementById('slider-workflows');
    const sliderTeam = document.getElementById('slider-team');

    if (!sliderWorkflows || !sliderTeam) return;

    sliderWorkflows.addEventListener('input', updateRoiCalculator);
    sliderTeam.addEventListener('input', updateRoiCalculator);

    updateRoiCalculator();
  }

  function updateRoiCalculator() {
    const sliderWorkflows = document.getElementById('slider-workflows');
    const sliderTeam = document.getElementById('slider-team');

    if (!sliderWorkflows || !sliderTeam) return;

    const workflows = parseInt(sliderWorkflows.value, 10);
    const team = parseInt(sliderTeam.value, 10);

    const valWorkflows = document.getElementById('val-workflows');
    const valTeam = document.getElementById('val-team');

    if (valWorkflows) valWorkflows.textContent = `${workflows} Pipelines`;
    if (valTeam) valTeam.textContent = `${team} Members`;

    // Calculation formulas
    const humanOpsMonthlyUsd = (workflows * 1400) + (team * 900);
    const deistMonthlyUsd = (workflows * 280) + (team * 120);
    const monthlySavingsUsd = humanOpsMonthlyUsd - deistMonthlyUsd;
    const annualSavingsUsd = monthlySavingsUsd * 12;
    const roiPercentage = Math.round((annualSavingsUsd / (deistMonthlyUsd * 12)) * 100);
    const hoursSavedMonthly = Math.round(workflows * team * 32);

    const elSavings = document.getElementById('res-annual-savings');
    const elRoi = document.getElementById('res-roi-percentage');
    const elHours = document.getElementById('res-hours-saved');

    if (elSavings) elSavings.textContent = formatCurrency(annualSavingsUsd);
    if (elRoi) elRoi.textContent = `+${roiPercentage}%`;
    if (elHours) elHours.textContent = `${hoursSavedMonthly.toLocaleString()} hrs/mo`;
  }

  // --- 3. CONSULTATION BOOKING MODAL ---
  function initBookingModal() {
    createModalHTML();

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-booking], .btn-book-consultation');
      if (trigger) {
        e.preventDefault();
        openBookingModal();
      }
    });
  }

  function createModalHTML() {
    if (document.getElementById('deist-booking-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'deist-booking-modal';
    modal.className = 'fixed inset-0 z-50 hidden flex items-center justify-center p-4 deist-modal-backdrop';
    modal.innerHTML = `
      <div class="clay-card max-w-xl w-full p-8 relative overflow-hidden bg-white shadow-2xl transition-all scale-95 opacity-0 modal-content">
        <button id="close-booking-modal" class="absolute top-6 right-6 w-9 h-9 rounded-full clay-pill-white flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div id="booking-step-1" class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-secondary text-on-primary flex items-center justify-center clay-icon-squircle">
              <span class="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <span class="text-xs font-semibold text-secondary uppercase tracking-wider">Book Consultation</span>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold text-xl">Schedule Sovereign AI Architecture Session</h3>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-on-surface-variant mb-2">Select Date</label>
            <div class="grid grid-cols-4 gap-2" id="booking-dates">
              <!-- Dynamically generated date chips -->
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase text-on-surface-variant mb-2">Select Time Slot (IST / EST)</label>
            <div class="grid grid-cols-3 gap-2" id="booking-slots">
              <button type="button" class="slot-btn px-3 py-2 rounded-xl border border-surface-container-highest text-center text-sm font-medium hover:border-secondary transition-all">10:00 AM</button>
              <button type="button" class="slot-btn px-3 py-2 rounded-xl border border-surface-container-highest text-center text-sm font-medium hover:border-secondary transition-all">02:30 PM</button>
              <button type="button" class="slot-btn px-3 py-2 rounded-xl border border-surface-container-highest text-center text-sm font-medium hover:border-secondary transition-all">06:00 PM</button>
            </div>
          </div>

          <button id="next-to-step-2" type="button" class="w-full py-3.5 rounded-full clay-pill-dark text-on-primary font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg">
            <span>Continue to Details</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div id="booking-step-2" class="space-y-4 hidden">
          <div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold text-lg">Enter Your Details</h3>
            <p class="text-xs text-on-surface-variant">Our lead architect will contact you at the scheduled time.</p>
          </div>

          <form id="booking-form" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-on-surface mb-1">Full Name</label>
              <input type="text" required id="booking-name" placeholder="Alex Mercer" class="w-full px-4 py-2.5 rounded-2xl bg-surface-container border border-surface-container-highest text-sm focus:outline-none focus:ring-2 focus:ring-secondary"/>
            </div>

            <div>
              <label class="block text-xs font-medium text-on-surface mb-1">Work Email</label>
              <input type="email" required id="booking-email" placeholder="alex@enterprise.com" class="w-full px-4 py-2.5 rounded-2xl bg-surface-container border border-surface-container-highest text-sm focus:outline-none focus:ring-2 focus:ring-secondary"/>
            </div>

            <div>
              <label class="block text-xs font-medium text-on-surface mb-1">Company / Organization</label>
              <input type="text" required id="booking-company" placeholder="AeroSystems Global" class="w-full px-4 py-2.5 rounded-2xl bg-surface-container border border-surface-container-highest text-sm focus:outline-none focus:ring-2 focus:ring-secondary"/>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" id="back-to-step-1" class="px-5 py-3 rounded-full clay-pill-white text-on-surface font-medium text-sm cursor-pointer">Back</button>
              <button type="submit" class="flex-1 py-3 rounded-full clay-pill-dark text-on-primary font-medium text-sm cursor-pointer shadow-lg">Confirm Booking</button>
            </div>
          </form>
        </div>

        <div id="booking-step-3" class="space-y-4 text-center py-6 hidden">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <span class="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold text-2xl">Consultation Confirmed!</h3>
          <p class="text-sm text-on-surface-variant max-w-md mx-auto">
            Your consultation pass <span id="booking-ref-id" class="font-mono text-secondary font-bold">#DST-8921</span> has been dispatched to your email.
          </p>
          <button type="button" id="finish-booking" class="px-8 py-3 rounded-full clay-pill-dark text-on-primary font-medium text-sm cursor-pointer">
            Done
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Populate dates
    const dateContainer = modal.querySelector('#booking-dates');
    const today = new Date();
    for (let i = 1; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `date-btn px-3 py-2 rounded-2xl border text-center transition-all ${i === 1 ? 'border-secondary bg-secondary/10 font-bold' : 'border-surface-container-highest hover:border-secondary'}`;
      btn.innerHTML = `<span class="block text-[10px] uppercase text-on-surface-variant">${dayName}</span><span class="text-base font-bold text-on-surface">${dayNum}</span>`;
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.date-btn').forEach(b => b.className = 'date-btn px-3 py-2 rounded-2xl border border-surface-container-highest text-center hover:border-secondary transition-all');
        btn.className = 'date-btn px-3 py-2 rounded-2xl border border-secondary bg-secondary/10 font-bold text-center transition-all';
        state.bookingData.date = `${dayName}, Oct ${dayNum}`;
      });
      dateContainer.appendChild(btn);
    }
    state.bookingData.date = 'Tomorrow';

    // Slots listener
    modal.querySelectorAll('#booking-slots .slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('#booking-slots .slot-btn').forEach(b => b.className = 'slot-btn px-3 py-2 rounded-xl border border-surface-container-highest text-center text-sm font-medium hover:border-secondary transition-all');
        btn.className = 'slot-btn px-3 py-2 rounded-xl border border-secondary bg-secondary/10 text-center text-sm font-bold transition-all';
        state.bookingData.time = btn.textContent.trim();
      });
    });

    // Navigation listeners
    const step1 = modal.querySelector('#booking-step-1');
    const step2 = modal.querySelector('#booking-step-2');
    const step3 = modal.querySelector('#booking-step-3');

    modal.querySelector('#next-to-step-2').addEventListener('click', () => {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });

    modal.querySelector('#back-to-step-1').addEventListener('click', () => {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });

    modal.querySelector('#booking-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const refCode = 'DST-' + Math.floor(1000 + Math.random() * 9000);
      modal.querySelector('#booking-ref-id').textContent = '#' + refCode;
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
      showToast(`Consultation #${refCode} booked successfully!`, 'success', 'Session Confirmed');
    });

    modal.querySelector('#finish-booking').addEventListener('click', closeBookingModal);
    modal.querySelector('#close-booking-modal').addEventListener('click', closeBookingModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  function openBookingModal() {
    const modal = document.getElementById('deist-booking-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    const content = modal.querySelector('.modal-content');
    setTimeout(() => {
      content.classList.remove('scale-95', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    }, 10);
  }

  function closeBookingModal() {
    const modal = document.getElementById('deist-booking-modal');
    if (!modal) return;
    const content = modal.querySelector('.modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      // Reset steps
      modal.querySelector('#booking-step-1').classList.remove('hidden');
      modal.querySelector('#booking-step-2').classList.add('hidden');
      modal.querySelector('#booking-step-3').classList.add('hidden');
    }, 200);
  }

  // --- 4. TOAST NOTIFICATION ENGINE ---
  function initToastContainer() {
    if (document.getElementById('deist-toast-container')) return;
    const container = document.createElement('div');
    container.id = 'deist-toast-container';
    document.body.appendChild(container);
  }

  function showToast(message, type = 'success', title = 'Notification') {
    initToastContainer();
    const container = document.getElementById('deist-toast-container');

    const iconMap = {
      success: { icon: 'check_circle', color: 'text-emerald-500' },
      info: { icon: 'info', color: 'text-sky-500' },
      error: { icon: 'error', color: 'text-rose-500' }
    };

    const style = iconMap[type] || iconMap.success;

    const toast = document.createElement('div');
    toast.className = 'deist-toast';
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined ${style.color} text-[20px]">${style.icon}</span>
      </div>
      <div class="flex-1">
        <h4 class="font-headline-sm text-sm font-semibold text-on-surface leading-tight">${title}</h4>
        <p class="text-xs text-on-surface-variant mt-0.5">${message}</p>
      </div>
      <button class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  // --- 5. CONTACT FORM VALIDATION & TOAST INTEGRATION ---
  function initContactForms() {
    document.querySelectorAll('form').forEach(form => {
      if (form.id === 'booking-form') return; // Handled separately

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let valid = true;

        inputs.forEach(input => {
          if (!input.value.trim()) {
            valid = false;
            input.classList.add('ring-2', 'ring-rose-500');
          } else {
            input.classList.remove('ring-2', 'ring-rose-500');
          }
        });

        if (!valid) {
          showToast('Please complete all required fields.', 'error', 'Validation Error');
          return;
        }

        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && !/\S+@\S+\.\S+/.test(emailInput.value)) {
          showToast('Please enter a valid work email address.', 'error', 'Invalid Email');
          return;
        }

        showToast('Your inquiry has been submitted! Our AI lead architect will reach out within 2 hours.', 'success', 'Request Sent');
        form.reset();
      });
    });
  }

  // --- 6. AI ARCHITECTURE PLAYGROUND VISUALIZER ---
  function initArchitectureVisualizer() {
    const visualizerNav = document.getElementById('ai-viz-nav');
    if (!visualizerNav) return;

    const vizTitle = document.getElementById('viz-title');
    const vizDesc = document.getElementById('viz-desc');
    const vizCode = document.getElementById('viz-code');
    const vizMetric1 = document.getElementById('viz-metric-1');
    const vizMetric2 = document.getElementById('viz-metric-2');

    const configMap = {
      'vector-mesh': {
        title: 'High-Throughput Vector Mesh (pgvector / Qdrant)',
        desc: 'Sub-15ms embedding retrieval over billions of high-dimensional vectors with zero data leakage.',
        code: `const vectorMesh = new SovereignVectorMesh({
  dimensions: 1536,
  metric: "cosine",
  shards: 128,
  isolation: "airgapped"
});
await vectorMesh.query({ topK: 10, threshold: 0.94 });`,
        metric1: '11.4 ms',
        metric2: '4.8M ops/sec'
      },
      'agentic-pipeline': {
        title: 'Autonomous Multi-Agent Mesh Protocol',
        desc: 'Self-correcting agent chains executing multi-step computational graphs with automated fallback loops.',
        code: `const agentMesh = new AgenticChain({
  agents: ["Researcher", "CodeSynthesizer", "SecurityAuditor"],
  maxHops: 8,
  consensus: "bft_strict"
});
const result = await agentMesh.executeTask(enterpriseGoal);`,
        metric1: '99.84%',
        metric2: '14 Active Agents'
      },
      'voice-synth': {
        title: 'Ultra-Low Latency Voice Synthesizer',
        desc: 'Real-time conversational neural audio pipelines running sub-200ms speech-to-speech loops.',
        code: `const voiceStream = new NeuralAudioPipeline({
  model: "deist-voice-v3",
  sampleRate: "48kHz",
  streamBufferMs: 120
});
voiceStream.on('audioChunk', (pcm) => audioContext.play(pcm));`,
        metric1: '185 ms',
        metric2: '48 kHz / 24-bit'
      },
      'compute-nodes': {
        title: 'Dedicated Sovereign Compute Nodes',
        desc: 'Custom fine-tuned Llama-3 70B & Qwen-2.5 instances deployed on private hardware nodes.',
        code: `const computeNode = new SovereignComputeNode({
  clusterId: "deist-node-us-east-1",
  gpuCluster: "H100-SXM5-80GB x8",
  tensorParallel: 4
});
await computeNode.deployCustomWeights(modelWeights);`,
        metric1: '140 tok/s',
        metric2: '100% On-Prem'
      }
    };

    visualizerNav.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-viz-target');
        const cfg = configMap[target];
        if (!cfg) return;

        visualizerNav.querySelectorAll('button').forEach(b => {
          b.className = 'px-4 py-2 rounded-2xl text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all';
        });
        btn.className = 'px-4 py-2 rounded-2xl text-xs font-semibold clay-pill-white text-on-surface shadow-sm transition-all';

        if (vizTitle) vizTitle.textContent = cfg.title;
        if (vizDesc) vizDesc.textContent = cfg.desc;
        if (vizCode) vizCode.textContent = cfg.code;
        if (vizMetric1) vizMetric1.textContent = cfg.metric1;
        if (vizMetric2) vizMetric2.textContent = cfg.metric2;

        showToast(`Loaded ${cfg.title} architecture preset`, 'info', 'Playground');
      });
    });
  }

  // DOM READY INITIALIZATION
  document.addEventListener('DOMContentLoaded', () => {
    initCurrencySwitcher();
    initRoiCalculator();
    initBookingModal();
    initToastContainer();
    initContactForms();
    initArchitectureVisualizer();
  });

  return {
    setCurrency,
    showToast,
    openBookingModal,
    closeBookingModal,
    updateRoiCalculator
  };
})();
