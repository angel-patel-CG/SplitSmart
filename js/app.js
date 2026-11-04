/* ============================================================
   SplitSmart - Main Application Logic & Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initToasts();
  initAuthView();
  initTermsView();
  initDashboardView();
  initTravelView();
  initTransactionsView();
  initChatView();
  initCurrencyView();
  initScannerView();
  initSuggestionsView();
  initHelpView();
  initGlobalEvents();

  // Initial routing
  window.splitRouter.handleRoute();

  // Subscribe to state updates to keep all views reactive
  window.splitStore.subscribe(() => {
    updateGlobalHeaderUI();
    renderDashboardBalances();
    renderTransactionsList();
    renderTravelBalances();
    renderChatMessages();
    renderSuggestionsList();
  });

  // Initial header sync
  updateGlobalHeaderUI();
});

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function initToasts() {
  let toastEl = document.getElementById('ss-toast-notification');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'ss-toast-notification';
    toastEl.className = 'ss-toast';
    toastEl.innerHTML = `
      <i class="fa-solid fa-circle-check" style="color:#00C0F7; font-size:18px;"></i>
      <span id="ss-toast-text">Action completed successfully</span>
    `;
    document.body.appendChild(toastEl);
  }
}

window.showToast = function(message) {
  const toastEl = document.getElementById('ss-toast-notification');
  const toastText = document.getElementById('ss-toast-text');
  if (!toastEl || !toastText) return;

  toastText.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3200);
};

/* ============================================================
   GLOBAL HEADER & USER UI SYNC
   ============================================================ */
function updateGlobalHeaderUI() {
  const state = window.splitStore.state;
  const user = state.auth;

  const headerAvatar = document.getElementById('nav-user-avatar');
  const headerName = document.getElementById('nav-user-name');
  if (headerAvatar) headerAvatar.textContent = user.avatar || 'AJ';
  if (headerName) headerName.textContent = user.name || 'Alex Johnson';
}

function initGlobalEvents() {
  // Brand logo click navigates to dashboard if logged in, or login if not
  const brandLogos = document.querySelectorAll('.brand-wrapper');
  brandLogos.forEach(logo => {
    logo.addEventListener('click', () => {
      const state = window.splitStore.state;
      if (state.auth.isLoggedIn && state.auth.agreedToTerms) {
        window.navigateTo('dashboard');
      } else if (state.auth.isLoggedIn) {
        window.navigateTo('terms');
      } else {
        window.navigateTo('login');
      }
    });
  });

  // Help button in header
  const helpBtn = document.getElementById('nav-help-btn');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      window.navigateTo('help');
    });
  }

  // User profile / logout toggle
  const userBtn = document.getElementById('nav-user-badge');
  if (userBtn) {
    userBtn.addEventListener('click', () => {
      if (confirm('Do you want to log out of SplitSmart?')) {
        window.splitStore.logout();
        window.navigateTo('login');
        window.showToast('Logged out successfully.');
      }
    });
  }
}

/* ============================================================
   VIEW 1: AUTHENTICATION (LOGIN & SIGN-UP)
   ============================================================ */
function initAuthView() {
  const form = document.getElementById('auth-form');
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const nameGroup = document.getElementById('auth-name-group');
  const nameInput = document.getElementById('auth-name');
  const submitBtn = document.getElementById('auth-submit-btn');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');
  const autofillBtn = document.getElementById('demo-autofill-btn');

  let mode = 'login'; // 'login' or 'register'

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
      mode = 'login';
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      nameGroup.style.display = 'none';
      submitBtn.innerHTML = '<span>Log In & Continue to Policy</span> <i class="fa-solid fa-arrow-right"></i>';
    });

    tabRegister.addEventListener('click', () => {
      mode = 'register';
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      nameGroup.style.display = 'block';
      submitBtn.innerHTML = '<span>Create Account & Review Policy</span> <i class="fa-solid fa-arrow-right"></i>';
    });
  }

  if (autofillBtn) {
    autofillBtn.addEventListener('click', (e) => {
      e.preventDefault();
      emailInput.value = 'alex.j@splitsmart.io';
      passInput.value = 'paypal123';
      if (nameInput) nameInput.value = 'Alex Johnson';
      window.showToast('Filled demo account credentials.');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const pass = passInput.value.trim();
      const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Alex Johnson';

      if (!email || !pass) {
        alert('Please enter your email and password.');
        return;
      }

      // Successful auth -> stores login and directly leads to MANDATORY Terms & Policy Gateway
      window.splitStore.login(email, name);
      window.showToast(mode === 'login' ? 'Signed in! Please review SplitSmart policies.' : 'Account created! Please review SplitSmart policies.');
      window.navigateTo('terms');
    });
  }
}

/* ============================================================
   VIEW 2: MANDATORY TERMS & POLICY GATEWAY
   ============================================================ */
function initTermsView() {
  const checkbox = document.getElementById('terms-agree-checkbox');
  const proceedBtn = document.getElementById('terms-proceed-btn');
  const declineBtn = document.getElementById('terms-decline-btn');

  if (checkbox && proceedBtn) {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        proceedBtn.removeAttribute('disabled');
        proceedBtn.classList.remove('disabled');
      } else {
        proceedBtn.setAttribute('disabled', 'true');
        proceedBtn.classList.add('disabled');
      }
    });

    proceedBtn.addEventListener('click', () => {
      if (!checkbox.checked) return;
      window.splitStore.agreeToTerms();
      window.showToast('Welcome to SplitSmart! All features unlocked.');
      window.navigateTo('dashboard');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      if (confirm('Declining the Terms of Service will log you out. Are you sure?')) {
        window.splitStore.logout();
        window.navigateTo('login');
      }
    });
  }
}

/* ============================================================
   VIEW 3: GUIDELINES & HELP
   ============================================================ */
function initHelpView() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    }
  });

  const chatSupportBtn = document.getElementById('help-chat-support-btn');
  if (chatSupportBtn) {
    chatSupportBtn.addEventListener('click', () => {
      alert('SplitSmart Live Support: An agent has been notified and will reply to alex.j@splitsmart.io within 5 minutes.');
    });
  }
}

/* ============================================================
   VIEW 4: MAIN DASHBOARD & PERSONAL DATA BANK SECURITY
   ============================================================ */
function initDashboardView() {
  renderDashboardBalances();

  // Bank security PIN unlock/lock logic
  const unlockBtn = document.getElementById('bank-unlock-btn');
  const lockBtn = document.getElementById('bank-relock-btn');
  const pinInput = document.getElementById('bank-pin-input');
  const quickDemoPinBtn = document.getElementById('quick-demo-pin-btn');

  if (unlockBtn && pinInput) {
    unlockBtn.addEventListener('click', () => {
      const pin = pinInput.value.trim();
      if (!pin) {
        alert('Please enter your account password or PIN (Demo: 1234 or paypal123).');
        return;
      }
      window.splitStore.unlockBankDetails();
      pinInput.value = '';
      window.showToast('Personal Bank & Financial Data Unlocked!');
      renderBankSecurityState();
    });
  }

  if (quickDemoPinBtn && pinInput) {
    quickDemoPinBtn.addEventListener('click', () => {
      pinInput.value = '1234';
      window.splitStore.unlockBankDetails();
      pinInput.value = '';
      window.showToast('Personal Bank & Financial Data Unlocked!');
      renderBankSecurityState();
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      window.splitStore.lockBankDetails();
      window.showToast('Financial Data Masked and Re-locked.');
      renderBankSecurityState();
    });
  }

  renderBankSecurityState();

  // Settle all button on Dashboard
  const settleAllBtn = document.getElementById('dash-settle-all-btn');
  if (settleAllBtn) {
    settleAllBtn.addEventListener('click', () => {
      const state = window.splitStore.state;
      if (state.balances.youOwe <= 0) {
        alert('You do not owe anything right now! All group balances are settled.');
        return;
      }
      window.triggerPayPalCheckout(
        state.balances.youOwe,
        'Priya Patel & Friends',
        'settlements@splitsmart.io',
        'Consolidated Settlement for All Outstanding SplitSmart Group Dues'
      );
    });
  }
}

function renderDashboardBalances() {
  const state = window.splitStore.state;
  const youOweEl = document.getElementById('dash-val-you-owe');
  const youAreOwedEl = document.getElementById('dash-val-you-are-owed');
  const netBalanceEl = document.getElementById('dash-val-net-balance');

  if (youOweEl) youOweEl.textContent = `$${state.balances.youOwe.toFixed(2)}`;
  if (youAreOwedEl) youAreOwedEl.textContent = `$${state.balances.youAreOwed.toFixed(2)}`;
  if (netBalanceEl) {
    const net = state.balances.netBalance;
    netBalanceEl.textContent = `${net >= 0 ? '+' : ''}$${net.toFixed(2)}`;
  }
}

function renderBankSecurityState() {
  const state = window.splitStore.state;
  const isUnlocked = state.auth.bankUnlocked;
  const widget = document.getElementById('bank-security-widget');
  const lockedGate = document.getElementById('bank-locked-gate');
  const revealedData = document.getElementById('bank-revealed-data');
  const badgePill = document.getElementById('bank-security-badge-text');

  if (!widget) return;

  if (isUnlocked) {
    widget.classList.add('unlocked');
    if (lockedGate) lockedGate.style.display = 'none';
    if (revealedData) revealedData.style.display = 'block';
    if (badgePill) badgePill.innerHTML = '<i class="fa-solid fa-lock-open" style="color:#00875A;"></i> Verified & Unlocked';

    document.getElementById('bank-val-account').textContent = state.bankDetails.realAccount;
    document.getElementById('bank-val-routing').textContent = state.bankDetails.realRouting;
    document.getElementById('bank-val-paypal').textContent = state.bankDetails.paypalEmail;
    document.getElementById('bank-val-balance').textContent = state.bankDetails.availableBalance;
  } else {
    widget.classList.remove('unlocked');
    if (lockedGate) lockedGate.style.display = 'block';
    if (revealedData) revealedData.style.display = 'none';
    if (badgePill) badgePill.innerHTML = '<i class="fa-solid fa-lock"></i> Masked (Encrypted)';
  }
}

/* ============================================================
   VIEW 5: TRAVEL SPLIT & TOUR MANAGEMENT
   ============================================================ */
function initTravelView() {
  renderTravelBalances();

  // Trip expense form submission
  const expenseForm = document.getElementById('travel-add-expense-form');
  const splitPills = document.querySelectorAll('.split-pill-btn');
  let currentSplitType = 'equal';

  splitPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      splitPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentSplitType = pill.getAttribute('data-split');
    });
  });

  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('travel-exp-title').value.trim();
      const rawAmt = parseFloat(document.getElementById('travel-exp-amount').value);
      const category = document.getElementById('travel-exp-category').value;
      const currency = document.getElementById('travel-exp-currency').value;
      const payer = document.getElementById('travel-exp-payer').value;

      if (!title || isNaN(rawAmt) || rawAmt <= 0) {
        alert('Please enter a valid expense title and amount.');
        return;
      }

      // Live conversion to USD if entered in INR or EUR
      let finalAmtUSD = rawAmt;
      if (currency === 'INR') {
        finalAmtUSD = rawAmt / 83.20;
      } else if (currency === 'EUR') {
        finalAmtUSD = rawAmt / 0.92;
      }

      const newExpense = {
        id: 'tx-t' + Date.now(),
        title: title,
        amount: finalAmtUSD,
        payer: payer,
        category: category,
        date: 'Nov 03, 2026'
      };

      window.splitStore.addTravelExpense(newExpense);
      expenseForm.reset();
      window.showToast(`Added "${title}" ($${finalAmtUSD.toFixed(2)} USD) to Goa Trip!`);
      renderTravelBalances();
    });
  }
}

function renderTravelBalances() {
  const state = window.splitStore.state;
  const trip = state.travel.trips.find(t => t.id === 'goa2026');
  if (!trip) return;

  // Update budget bar
  const totalBudgetEl = document.getElementById('travel-total-budget');
  const totalSpentEl = document.getElementById('travel-total-spent');
  const remainingEl = document.getElementById('travel-budget-remaining');
  const progressFill = document.getElementById('travel-budget-fill');

  const budget = trip.totalBudget;
  const spent = trip.totalSpent;
  const remaining = Math.max(0, budget - spent);
  const pct = Math.min(100, Math.round((spent / budget) * 100));

  if (totalBudgetEl) totalBudgetEl.textContent = `$${budget.toFixed(2)}`;
  if (totalSpentEl) totalSpentEl.textContent = `$${spent.toFixed(2)}`;
  if (remainingEl) remainingEl.textContent = `$${remaining.toFixed(2)} remaining`;
  if (progressFill) progressFill.style.width = `${pct}%`;

  // Render settlements list
  const listContainer = document.getElementById('travel-settlements-list');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  trip.members.forEach(member => {
    const card = document.createElement('div');
    card.className = 'settlement-card-item';

    let actionBtnHtml = '';
    if (member.youOwe > 0) {
      actionBtnHtml = `
        <button class="btn-paypal-blue btn-paypal-sm pay-travel-btn" 
          data-amount="${member.youOwe.toFixed(2)}" 
          data-recipient="${member.name}"
          data-email="${member.id}@splitsmart.io"
          data-memo="Settlement for Goa Vacation 2026 travel share">
          <i class="fa-brands fa-paypal"></i> Pay with PayPal $${member.youOwe.toFixed(2)}
        </button>
      `;
    } else if (member.owesYou > 0) {
      actionBtnHtml = `
        <span class="badge badge-success" style="font-size:13px; padding:6px 14px;">
          <i class="fa-solid fa-arrow-down"></i> Owes You $${member.owesYou.toFixed(2)}
        </span>
      `;
    } else {
      actionBtnHtml = `
        <span class="badge" style="background:#F1F5F9; color:#64748B;">
          <i class="fa-solid fa-check"></i> Settled Up
        </span>
      `;
    }

    card.innerHTML = `
      <div class="traveler-info">
        <div class="traveler-avatar">${member.avatar}</div>
        <div>
          <div style="font-weight:700; color:#0F172A; font-size:15px;">${member.name}</div>
          <div style="font-size:12px; color:#64748B;">Equal Share (25%) &bull; Goa Trip Member</div>
        </div>
      </div>
      <div>${actionBtnHtml}</div>
    `;

    listContainer.appendChild(card);
  });

  // Attach click listeners to "Pay with PayPal" buttons
  const payButtons = listContainer.querySelectorAll('.pay-travel-btn');
  payButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = btn.getAttribute('data-amount');
      const recipient = btn.getAttribute('data-recipient');
      const email = btn.getAttribute('data-email');
      const memo = btn.getAttribute('data-memo');
      window.triggerPayPalCheckout(amt, recipient, email, memo);
    });
  });
}

/* ============================================================
   VIEW 6: MONEY EXPENSE & TRANSACTION HISTORY
   ============================================================ */
let activeTxCategory = 'all';
let activeTxStatus = 'all';
let txSearchKeyword = '';

function initTransactionsView() {
  renderTransactionsList();

  // Search input
  const searchInput = document.getElementById('tx-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      txSearchKeyword = e.target.value.toLowerCase().trim();
      renderTransactionsList();
    });
  }

  // Filter chips
  const catChips = document.querySelectorAll('.filter-chip[data-filter-cat]');
  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      catChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeTxCategory = chip.getAttribute('data-filter-cat');
      renderTransactionsList();
    });
  });

  const statusChips = document.querySelectorAll('.filter-chip[data-filter-status]');
  statusChips.forEach(chip => {
    chip.addEventListener('click', () => {
      statusChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeTxStatus = chip.getAttribute('data-filter-status');
      renderTransactionsList();
    });
  });

  // Export buttons (CSV and PDF simulation)
  const exportCsvBtn = document.getElementById('export-tx-csv-btn');
  const exportPdfBtn = document.getElementById('export-tx-pdf-btn');

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => exportTransactionsCsv());
  }
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => exportTransactionsPdf());
  }
}

function renderTransactionsList() {
  const container = document.getElementById('tx-list-container');
  if (!container) return;

  const state = window.splitStore.state;
  let filtered = state.transactions.filter(tx => {
    // category filter
    if (activeTxCategory !== 'all' && tx.category.toLowerCase() !== activeTxCategory.toLowerCase()) {
      return false;
    }
    // status filter
    if (activeTxStatus !== 'all' && tx.status.toLowerCase() !== activeTxStatus.toLowerCase()) {
      return false;
    }
    // search filter
    if (txSearchKeyword) {
      const matchTitle = tx.title.toLowerCase().includes(txSearchKeyword);
      const matchPayer = tx.payer.toLowerCase().includes(txSearchKeyword);
      const matchGroup = tx.group.toLowerCase().includes(txSearchKeyword);
      if (!matchTitle && !matchPayer && !matchGroup) return false;
    }
    return true;
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:#64748B;">
        <i class="fa-solid fa-receipt" style="font-size:36px; margin-bottom:12px; color:#CBD5E1;"></i>
        <h4 style="color:#0F172A; font-weight:700;">No transactions found</h4>
        <p style="font-size:13px;">Try adjusting your search keywords or active filters.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(tx => {
    const card = document.createElement('div');
    card.className = 'tx-record-card';
    card.setAttribute('data-id', tx.id);

    const isOwed = tx.status === 'Owed';
    const statusBadge = isOwed
      ? `<span class="badge badge-owed"><i class="fa-solid fa-clock"></i> You Owe $${tx.yourShare.toFixed(2)}</span>`
      : `<span class="badge badge-success"><i class="fa-solid fa-check"></i> Settled</span>`;

    const settleBtnHtml = isOwed
      ? `<button class="btn-paypal-blue btn-paypal-sm settle-tx-btn" 
          data-id="${tx.id}" 
          data-amount="${tx.yourShare.toFixed(2)}"
          data-recipient="${tx.payer}"
          data-email="${tx.recipientEmail}"
          data-memo="${tx.title} - ${tx.group}">
          <i class="fa-brands fa-paypal"></i> Settle Up $${tx.yourShare.toFixed(2)}
         </button>`
      : '';

    let breakdownHtml = '';
    if (tx.breakdown) {
      breakdownHtml = tx.breakdown.map(b => `
        <div style="display:flex; justify-content:space-between; font-size:12.5px; padding:4px 0; color:#475569;">
          <span>${b.name}</span>
          <span style="font-weight:600;">$${b.share.toFixed(2)} ${b.paid ? '<span style="color:#00875A;">(Paid)</span>' : '<span style="color:#D9381E;">(Pending)</span>'}</span>
        </div>
      `).join('');
    }

    card.innerHTML = `
      <div class="tx-card-main">
        <div class="tx-title-group">
          <div class="tx-cat-icon">
            <i class="fa-solid ${tx.icon || 'fa-receipt'}"></i>
          </div>
          <div>
            <div style="font-weight:700; color:#0F172A; font-size:15px;">${tx.title}</div>
            <div style="font-size:12px; color:#64748B;">
              ${tx.date} &bull; <strong style="color:#0070BA;">${tx.group}</strong> &bull; Paid by ${tx.payer}
            </div>
          </div>
        </div>
        <div class="tx-amounts">
          <div class="tx-total">$${tx.totalAmount.toFixed(2)}</div>
          <div class="tx-share">Your share: $${tx.yourShare.toFixed(2)}</div>
          <div style="margin-top:4px;">${statusBadge}</div>
        </div>
      </div>

      <!-- Expandable breakdown drawer -->
      <div class="tx-expanded-drawer">
        <div style="font-size:12px; font-weight:700; color:#003087; margin-bottom:6px; text-transform:uppercase;">
          Split Breakdown (${tx.breakdown ? tx.breakdown.length : 0} members):
        </div>
        <div style="background:#F8FAFC; border-radius:8px; padding:10px 14px; margin-bottom:12px;">
          ${breakdownHtml}
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div style="font-size:12px; color:#64748B;">
            <i class="fa-solid fa-note-sticky"></i> ${tx.memo || 'Expense record'}
          </div>
          <div>${settleBtnHtml}</div>
        </div>
      </div>
    `;

    // Click on card toggles expansion
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // ignore click on buttons
      card.classList.toggle('expanded');
    });

    container.appendChild(card);
  });

  // Attach Settle Up click listeners
  const settleBtns = container.querySelectorAll('.settle-tx-btn');
  settleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const amt = btn.getAttribute('data-amount');
      const recipient = btn.getAttribute('data-recipient');
      const email = btn.getAttribute('data-email');
      const memo = btn.getAttribute('data-memo');
      window.triggerPayPalCheckout(amt, recipient, email, memo, id);
    });
  });
}

function exportTransactionsCsv() {
  const state = window.splitStore.state;
  let csv = 'Transaction ID,Date,Title,Group,Category,Total Amount,Your Share,Payer,Status\n';
  state.transactions.forEach(t => {
    csv += `"${t.id}","${t.date}","${t.title}","${t.group}","${t.category}",${t.totalAmount},${t.yourShare},"${t.payer}","${t.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SplitSmart_Expense_Log_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.showToast('Downloaded CSV Expense Log!');
}

function exportTransactionsPdf() {
  window.print();
}

/* ============================================================
   VIEW 7: GROUP CHAT & BITMOJI MESSAGING
   ============================================================ */
function initChatView() {
  renderChatMessages();

  // Send text message
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-text-input');
  const stickerToggleBtn = document.getElementById('chat-sticker-picker-toggle');
  const stickerDrawer = document.getElementById('chat-bitmoji-drawer');
  const groupSelect = document.getElementById('chat-group-select');

  if (groupSelect) {
    groupSelect.addEventListener('change', (e) => {
      const state = window.splitStore.state;
      state.chat.activeGroup = e.target.value;
      window.splitStore.saveState();
      window.showToast(`Switched chat to ${e.target.value}`);
      renderChatMessages();
    });
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const newMsg = {
        id: 'msg-' + Date.now(),
        sender: 'You',
        avatar: 'AJ',
        isMe: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        text: text
      };

      window.splitStore.addChatMessage(newMsg);
      chatInput.value = '';
      renderChatMessages();
      scrollToChatBottom();
    });
  }

  // Toggle Bitmoji drawer
  if (stickerToggleBtn && stickerDrawer) {
    stickerToggleBtn.addEventListener('click', () => {
      stickerDrawer.classList.toggle('active');
    });
  }

  // Handle Bitmoji stickers click
  const stickerButtons = document.querySelectorAll('.sticker-pick-btn');
  stickerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      const label = btn.getAttribute('data-label');

      const newMsg = {
        id: 'msg-' + Date.now(),
        sender: 'You',
        avatar: 'AJ',
        isMe: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'bitmoji',
        sticker: emoji,
        label: label
      };

      window.splitStore.addChatMessage(newMsg);
      if (stickerDrawer) stickerDrawer.classList.remove('active');
      renderChatMessages();
      scrollToChatBottom();
      window.showToast(`Sent Bitmoji: ${label}!`);
    });
  });

  // Chat action: quick add expense in chat
  const chatAddExpenseBtn = document.getElementById('chat-action-add-expense');
  if (chatAddExpenseBtn) {
    chatAddExpenseBtn.addEventListener('click', () => {
      const title = prompt('Expense description:', 'Late Night Tacos & Boba');
      if (!title) return;
      const amtStr = prompt('Total bill amount ($):', '32.00');
      const total = parseFloat(amtStr);
      if (isNaN(total) || total <= 0) return;

      const perPerson = total / 4;
      const newExpCardMsg = {
        id: 'msg-' + Date.now(),
        sender: 'System',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'expense_card',
        cardData: {
          title: title,
          total: total,
          perPerson: perPerson,
          payer: 'You',
          recipientEmail: 'alex.j@splitsmart.io',
          yourShare: perPerson,
          isSettled: false
        }
      };

      window.splitStore.addChatMessage(newExpCardMsg);
      renderChatMessages();
      scrollToChatBottom();
      window.showToast(`Added $${total.toFixed(2)} bill to chat!`);
    });
  }
}

function renderChatMessages() {
  const container = document.getElementById('chat-feed-stream');
  if (!container) return;

  const state = window.splitStore.state;
  container.innerHTML = '';

  state.chat.messages.forEach(msg => {
    if (msg.type === 'expense_card') {
      const card = document.createElement('div');
      card.className = 'chat-system-card';
      const c = msg.cardData;
      card.innerHTML = `
        <div class="chat-system-header">
          <span class="chat-system-title">
            <i class="fa-solid fa-receipt" style="color:#0070BA;"></i>
            <strong>${c.title}</strong>
          </span>
          <span style="font-size:11px; color:#64748B;">${msg.time}</span>
        </div>
        <div style="font-size:13px; color:#475569; margin-bottom:8px;">
          Added by <strong>${c.payer}</strong> &bull; Total: <strong style="color:#003087;">$${c.total.toFixed(2)}</strong>
        </div>
        <div style="background:#F0F7FD; border-radius:8px; padding:8px 12px; margin-bottom:12px; font-size:12px; color:#003087;">
          Split 4 ways: <strong>$${c.perPerson.toFixed(2)}</strong> per member
        </div>
        <button class="btn-paypal-blue btn-paypal-sm chat-pay-pp-btn" style="width:100%;"
          data-amount="${c.perPerson.toFixed(2)}"
          data-recipient="${c.payer}"
          data-email="${c.recipientEmail}"
          data-memo="Settlement for in-chat expense: ${c.title}">
          <i class="fa-brands fa-paypal"></i> Pay with PayPal $${c.perPerson.toFixed(2)}
        </button>
      `;
      container.appendChild(card);
      return;
    }

    const row = document.createElement('div');
    row.className = `chat-bubble-row ${msg.isMe ? 'me' : ''}`;

    let innerContent = '';
    if (msg.type === 'bitmoji') {
      innerContent = `
        <div class="bitmoji-sticker-card">
          <div class="bitmoji-img-badge">${msg.sticker}</div>
          <span class="bitmoji-label">${msg.label}</span>
        </div>
      `;
    } else {
      innerContent = `
        <div class="chat-bubble-text">${msg.text}</div>
      `;
    }

    row.innerHTML = `
      <div class="chat-msg-avatar">${msg.avatar || 'U'}</div>
      <div class="chat-msg-content">
        <div style="font-size:11px; color:#64748B; padding:0 4px;">
          ${msg.isMe ? 'You' : msg.sender} &bull; ${msg.time}
        </div>
        ${innerContent}
      </div>
    `;

    container.appendChild(row);
  });

  // Attach in-chat payment button triggers
  const chatPayBtns = container.querySelectorAll('.chat-pay-pp-btn');
  chatPayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = btn.getAttribute('data-amount');
      const recipient = btn.getAttribute('data-recipient');
      const email = btn.getAttribute('data-email');
      const memo = btn.getAttribute('data-memo');
      window.triggerPayPalCheckout(amt, recipient, email, memo);
    });
  });
}

function scrollToChatBottom() {
  const container = document.getElementById('chat-feed-stream');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/* ============================================================
   VIEW 8: CURRENCY EXCHANGE TOOL
   ============================================================ */
function initCurrencyView() {
  const amountInput = document.getElementById('curr-amount-input');
  const fromSelect = document.getElementById('curr-from-select');
  const toSelect = document.getElementById('curr-to-select');
  const swapBtn = document.getElementById('curr-swap-btn');
  const travelersInput = document.getElementById('curr-travelers-count');
  const splitPayBtn = document.getElementById('curr-split-paypal-btn');

  function updateConversion() {
    const rawAmt = parseFloat(amountInput.value) || 0;
    const from = fromSelect.value;
    const to = toSelect.value;
    const rates = window.splitStore.state.rates;

    // Convert via USD as pivot
    const fromRateToUSD = rates[from] || 1;
    const toRateToUSD = rates[to] || 1;

    // Amount in USD = rawAmt / fromRateToUSD
    const amtInUSD = rawAmt / fromRateToUSD;
    // Amount in Target = amtInUSD * toRateToUSD
    const targetAmt = amtInUSD * toRateToUSD;
    const effectiveRate = toRateToUSD / fromRateToUSD;

    document.getElementById('curr-result-val').textContent = `${to} ${targetAmt.toFixed(2)}`;
    document.getElementById('curr-rate-breakdown').textContent = `1 ${from} = ${effectiveRate.toFixed(4)} ${to}`;

    // Split preview among travelers
    const travelers = parseInt(travelersInput.value) || 4;
    const perPersonInUSD = (amtInUSD / travelers);
    const perPersonInTarget = (targetAmt / travelers);

    document.getElementById('curr-split-per-person').textContent = `${to} ${perPersonInTarget.toFixed(2)} (~$${perPersonInUSD.toFixed(2)} USD each)`;

    if (splitPayBtn) {
      splitPayBtn.innerHTML = `<i class="fa-brands fa-paypal"></i> Pay with PayPal $${perPersonInUSD.toFixed(2)} USD`;
      splitPayBtn.setAttribute('data-amount', perPersonInUSD.toFixed(2));
      splitPayBtn.setAttribute('data-memo', `Split for international expense (${from} ${rawAmt.toFixed(2)} -> ${to} ${targetAmt.toFixed(2)})`);
    }
  }

  if (amountInput) amountInput.addEventListener('input', updateConversion);
  if (fromSelect) fromSelect.addEventListener('change', updateConversion);
  if (toSelect) toSelect.addEventListener('change', updateConversion);
  if (travelersInput) travelersInput.addEventListener('input', updateConversion);

  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
      updateConversion();
      window.showToast(`Swapped currency pair to ${fromSelect.value} -> ${toSelect.value}`);
    });
  }

  if (splitPayBtn) {
    splitPayBtn.addEventListener('click', () => {
      const amt = splitPayBtn.getAttribute('data-amount') || '45.00';
      const memo = splitPayBtn.getAttribute('data-memo') || 'International trip split payment';
      window.triggerPayPalCheckout(amt, 'International Tour Guide', 'travel@splitsmart.io', memo);
    });
  }

  updateConversion();
}

/* ============================================================
   VIEW 9: SPLIT MONEY (AI & QR SCANNER)
   ============================================================ */
function initScannerView() {
  const tabReceipt = document.getElementById('scan-tab-receipt');
  const tabQr = document.getElementById('scan-tab-qr');
  const receiptPanel = document.getElementById('scan-receipt-panel');
  const qrPanel = document.getElementById('scan-qr-panel');
  const dropzone = document.getElementById('receipt-dropzone');
  const samplePills = document.querySelectorAll('.sample-receipt-pill');
  const aiParseBtn = document.getElementById('ai-text-parse-btn');
  const aiTextInput = document.getElementById('ai-natural-text-input');

  if (tabReceipt && tabQr) {
    tabReceipt.addEventListener('click', () => {
      tabReceipt.classList.add('active');
      tabQr.classList.remove('active');
      receiptPanel.style.display = 'block';
      qrPanel.style.display = 'none';
    });

    tabQr.addEventListener('click', () => {
      tabQr.classList.add('active');
      tabReceipt.classList.remove('active');
      receiptPanel.style.display = 'none';
      qrPanel.style.display = 'block';
    });
  }

  // Trigger scanning simulation on dropzone click
  if (dropzone) {
    dropzone.addEventListener('click', () => {
      runAiScanSimulation('Bistro & Grill Seafood Dinner', [
        { name: 'Woodfired Margherita Pizza', price: 25.00 },
        { name: 'Craft Cocktails & Artisanal Drinks', price: 15.00 },
        { name: 'Service Tax & Gratuity', price: 8.00 }
      ]);
    });
  }

  samplePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const sample = pill.getAttribute('data-sample');
      if (sample === 'bistro') {
        runAiScanSimulation('Bistro & Grill Seafood Dinner', [
          { name: 'Woodfired Margherita Pizza', price: 25.00 },
          { name: 'Craft Cocktails & Artisanal Drinks', price: 15.00 },
          { name: 'Service Tax & Gratuity', price: 8.00 }
        ]);
      } else if (sample === 'grocery') {
        runAiScanSimulation('Trader Joes & Whole Foods', [
          { name: 'Organic Fruits & Fresh Greens', price: 28.50 },
          { name: 'Artisan Cheeses & Almond Milk', price: 19.50 },
          { name: 'Pantry Snacks & Coffee Beans', price: 28.40 }
        ]);
      }
    });
  });

  // Natural Language Prompt Parsing (e.g. "Split $120 dinner bill between Rahul and me")
  if (aiParseBtn && aiTextInput) {
    aiParseBtn.addEventListener('click', () => {
      const query = aiTextInput.value.trim();
      if (!query) {
        alert('Please enter a sentence, e.g. "Split $120 dinner bill between Rahul and me".');
        return;
      }

      // Regex parser for amount
      const amtMatch = query.match(/\$?(\d+(\.\d{1,2})?)/);
      const extractedAmount = amtMatch ? parseFloat(amtMatch[1]) : 60.00;

      runAiScanSimulation('AI Parsed: ' + query, [
        { name: 'Extracted Meal Bill Total', price: extractedAmount * 0.85 },
        { name: 'Taxes & Service Charge', price: extractedAmount * 0.15 }
      ]);
    });
  }

  // QR Code camera scan simulation button
  const qrSimulateBtn = document.getElementById('qr-simulate-scan-btn');
  if (qrSimulateBtn) {
    qrSimulateBtn.addEventListener('click', () => {
      window.showToast('Scanning SplitSmart PayPal QR Code...');
      setTimeout(() => {
        window.triggerPayPalCheckout(
          '28.50',
          'Alex Morgan',
          'alex.m@splitsmart.io',
          'QR Code Scan Settlement for Coffee & Pastries'
        );
      }, 1200);
    });
  }
}

function runAiScanSimulation(billTitle, items) {
  const dropzone = document.getElementById('receipt-dropzone');
  const resultsCard = document.getElementById('ocr-results-card');
  const statusMsg = document.getElementById('ocr-status-message');

  if (!dropzone || !resultsCard) return;

  dropzone.classList.add('scanning');
  if (statusMsg) statusMsg.textContent = 'AI OCR scanning receipt lines and extracting amounts...';
  resultsCard.style.display = 'none';

  setTimeout(() => {
    if (statusMsg) statusMsg.textContent = 'SplitSmart Neural Model verifying totals, tax, and tip...';
  }, 900);

  setTimeout(() => {
    dropzone.classList.remove('scanning');
    if (statusMsg) statusMsg.textContent = 'Receipt parsed successfully!';
    resultsCard.style.display = 'block';

    const itemsContainer = document.getElementById('ocr-items-list');
    itemsContainer.innerHTML = '';

    let total = 0;
    items.forEach(it => {
      total += it.price;
      const row = document.createElement('div');
      row.className = 'extracted-item-row';
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" checked style="accent-color:#0070BA; width:18px; height:18px;">
          <span style="font-weight:600; color:#0F172A;">${it.name}</span>
        </div>
        <strong style="color:#003087;">$${it.price.toFixed(2)}</strong>
      `;
      itemsContainer.appendChild(row);
    });

    document.getElementById('ocr-bill-title').textContent = billTitle;
    document.getElementById('ocr-total-amount').textContent = `$${total.toFixed(2)}`;

    const memberShare = total / 3;
    document.getElementById('ocr-per-member-share').textContent = `$${memberShare.toFixed(2)} each (3 members)`;

    const payBtn = document.getElementById('ocr-pay-paypal-btn');
    if (payBtn) {
      payBtn.innerHTML = `<i class="fa-brands fa-paypal"></i> Pay Your Share with PayPal ($${memberShare.toFixed(2)})`;
      payBtn.onclick = () => {
        window.triggerPayPalCheckout(
          memberShare.toFixed(2),
          'Rahul Sharma',
          'rahul.sharma@splitsmart.io',
          `AI Receipt Split for ${billTitle}`
        );
      };
    }

    window.showToast('AI Receipt Extraction complete!');
  }, 1800);
}

/* ============================================================
   VIEW 10: AI SMART SUGGESTIONS
   ============================================================ */
let activeSuggCategory = 'all';

function initSuggestionsView() {
  renderSuggestionsList();

  const filterChips = document.querySelectorAll('.filter-chip[data-sugg-filter]');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeSuggCategory = chip.getAttribute('data-sugg-filter');
      renderSuggestionsList();
    });
  });
}

function renderSuggestionsList() {
  const container = document.getElementById('suggestions-list-container');
  if (!container) return;

  const state = window.splitStore.state;
  let filtered = state.suggestions.filter(s => {
    if (activeSuggCategory !== 'all' && s.category !== activeSuggCategory) {
      return false;
    }
    return true;
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:#64748B;">
        <i class="fa-solid fa-wand-magic-sparkles" style="font-size:36px; margin-bottom:12px; color:#CBD5E1;"></i>
        <h4 style="color:#0F172A; font-weight:700;">All caught up!</h4>
        <p style="font-size:13px;">No suggestions pending right now.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(s => {
    const card = document.createElement('div');
    card.className = 'suggestion-card-item';
    card.id = `sugg-card-${s.id}`;

    card.innerHTML = `
      <button class="dismiss-sugg-btn" title="Dismiss suggestion" data-id="${s.id}">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div style="display:flex; align-items:flex-start; gap:14px; margin-bottom:12px;">
        <div style="width:44px; height:44px; border-radius:12px; background:#EBF4FC; color:#0070BA; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">
          <i class="fa-solid ${s.icon || 'fa-lightbulb'}"></i>
        </div>
        <div style="padding-right:24px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <h4 style="font-size:16px; font-weight:700; color:#003087;">${s.title}</h4>
            <span class="badge badge-info" style="font-size:10px;">${s.badge}</span>
          </div>
          <p style="font-size:13px; color:#64748B; margin-top:4px;">${s.subtitle}</p>
        </div>
      </div>

      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; padding-top:10px; border-top:1px solid #E2E8F0;">
        <div>
          <span style="font-size:11px; text-transform:uppercase; color:#64748B; font-weight:700;">Suggested Amount:</span>
          <div style="font-size:20px; font-weight:900; color:#003087;">$${s.amount.toFixed(2)}</div>
        </div>
        <button class="btn-paypal-blue btn-paypal-sm pay-sugg-btn"
          data-amount="${s.amount.toFixed(2)}"
          data-recipient="${s.recipient}"
          data-email="${s.recipientEmail}"
          data-memo="Settlement from SplitSmart AI Smart Suggestions">
          <i class="fa-brands fa-paypal"></i> Pay with PayPal $${s.amount.toFixed(2)}
        </button>
      </div>
    `;

    // Dismiss button handler
    const dismissBtn = card.querySelector('.dismiss-sugg-btn');
    dismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        state.suggestions = state.suggestions.filter(item => item.id !== s.id);
        window.splitStore.saveState();
        renderSuggestionsList();
      }, 200);
    });

    container.appendChild(card);
  });

  // Attach PayPal Checkout buttons
  const payButtons = container.querySelectorAll('.pay-sugg-btn');
  payButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = btn.getAttribute('data-amount');
      const recipient = btn.getAttribute('data-recipient');
      const email = btn.getAttribute('data-email');
      const memo = btn.getAttribute('data-memo');
      window.triggerPayPalCheckout(amt, recipient, email, memo);
    });
  });
}
