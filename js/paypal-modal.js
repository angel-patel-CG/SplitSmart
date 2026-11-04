/* ============================================================
   SplitSmart - Universal Dynamic PayPal Checkout Modal
   ============================================================ */

class PayPalModalManager {
  constructor() {
    this.currentTx = null;
    this.initModalHtml();
    this.bindEvents();
  }

  initModalHtml() {
    if (document.getElementById('paypal-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'paypal-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="paypal-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="pp-modal-title">
        <!-- Header -->
        <div class="paypal-modal-header">
          <div class="paypal-brand-mark">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M26 9.5C25.3 5.5 22.3 3 17.5 3H8.5C7.7 3 7 3.6 6.8 4.4L3 28.6C2.9 29.2 3.4 29.8 4 29.8H10.5L12.5 17H16.2C21.8 17 25.3 14.1 26 9.5Z" fill="#003087"/>
              <path d="M22.8 10.5C22.2 14.5 19.3 17 14.5 17H10.8L8.8 29.8H14.5L16.2 19H19.5C24.5 19 27.6 16.5 28.2 12.5C28.5 10.5 28 8.9 27 7.8C25.8 9.5 24.3 10.5 22.8 10.5Z" fill="#0070BA"/>
            </svg>
            <span>Pay<span style="color:#0070BA;">Pal</span></span>
            <span style="font-size:11px; font-weight:700; background:#EBF4FC; color:#0070BA; padding:2px 8px; border-radius:12px; margin-left:6px;">Smart Checkout</span>
          </div>
          <button id="pp-modal-close-btn" class="nav-icon-btn" aria-label="Close PayPal Modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Body: Interactive Payment Form -->
        <div id="pp-checkout-form" class="paypal-modal-body">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="width:36px; height:36px; border-radius:50%; background:#003087; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px;" id="pp-recipient-avatar">
                RS
              </div>
              <div>
                <div style="font-size:14px; font-weight:700; color:#0F172A;" id="pp-recipient-name">Recipient Name</div>
                <div style="font-size:12px; color:#64748B;" id="pp-recipient-email">recipient@splitsmart.io</div>
              </div>
            </div>
            <span class="badge badge-info" style="font-size:11px;">
              <i class="fa-solid fa-shield-halved"></i> Verified Recipient
            </span>
          </div>

          <!-- Pre-loaded Dynamic Amount Display (No manual typing needed!) -->
          <div class="checkout-dynamic-amount-box">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.5px; font-weight:700; color:#003087; margin-bottom:4px;">
              Settlement Amount (Auto-Calculated)
            </div>
            <div class="checkout-amount-display" id="pp-display-amount">$45.00</div>
            <div style="font-size:12px; color:#64748B; margin-top:4px;" id="pp-display-memo">
              Goa Vacation 2026 - Seafood Dinner Split
            </div>
          </div>

          <!-- Line item breakdown & zero fee guarantee -->
          <div class="checkout-line-items">
            <div class="checkout-line-row">
              <span>SplitSmart Direct Settlement</span>
              <span id="pp-breakdown-subtotal">$45.00</span>
            </div>
            <div class="checkout-line-row">
              <span>PayPal Peer-to-Peer Transfer Fee</span>
              <span style="color:#00875A; font-weight:700;">$0.00 (Zero Fee)</span>
            </div>
            <div class="checkout-line-row total-row">
              <span>Total to Pay</span>
              <span id="pp-breakdown-total">$45.00</span>
            </div>
          </div>

          <!-- Payment Method Selector -->
          <div style="margin-bottom:18px;">
            <div style="font-size:12px; font-weight:700; color:#0F172A; margin-bottom:8px;">
              Choose Payment Method:
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border:1.5px solid #0070BA; background:#EBF4FC; border-radius:10px; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <input type="radio" name="pp-pay-method" value="balance" checked style="accent-color:#0070BA;">
                  <div>
                    <div style="font-size:13px; font-weight:700; color:#003087;">PayPal Balance</div>
                    <div style="font-size:11px; color:#64748B;">Available: $3,420.50 USD</div>
                  </div>
                </div>
                <i class="fa-brands fa-paypal" style="color:#003087; font-size:18px;"></i>
              </label>

              <label style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border:1px solid #E2E8F0; background:#FFFFFF; border-radius:10px; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <input type="radio" name="pp-pay-method" value="bank" style="accent-color:#0070BA;">
                  <div>
                    <div style="font-size:13px; font-weight:700; color:#0F172A;">Chase Checking (•••• 4829)</div>
                    <div style="font-size:11px; color:#64748B;">Instant Bank Debit</div>
                  </div>
                </div>
                <i class="fa-solid fa-building-columns" style="color:#64748B; font-size:16px;"></i>
              </label>
            </div>
          </div>

          <!-- PayPal Smart Action Buttons -->
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button id="pp-confirm-pay-gold" class="btn-paypal-gold">
              <i class="fa-brands fa-paypal" style="font-size:18px;"></i>
              <span>Pay with <strong style="color:#003087;">PayPal</strong></span>
            </button>
            <button id="pp-confirm-pay-card" class="btn-paypal-blue">
              <i class="fa-solid fa-credit-card"></i>
              <span>Debit or Credit Card</span>
            </button>
          </div>

          <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:14px; font-size:11px; color:#64748B;">
            <i class="fa-solid fa-lock" style="color:#00875A;"></i>
            <span>Secured with PayPal 256-Bit SSL End-to-End Encryption</span>
          </div>
        </div>

        <!-- Body: Processing Spinner State -->
        <div id="pp-spinner-state" class="paypal-spinner-view">
          <div class="pp-spinner"></div>
          <h3 style="font-size:18px; font-weight:800; color:#003087; margin-bottom:6px;">Connecting to PayPal...</h3>
          <p style="font-size:13px; color:#64748B;" id="pp-spinner-desc">Authorizing instant peer-to-peer settlement via SplitSmart API...</p>
        </div>

        <!-- Body: Success Confirmation Receipt -->
        <div id="pp-success-state" class="paypal-success-view" style="padding: 24px;">
          <div class="pp-success-check">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2 style="font-size:22px; font-weight:900; color:#003087; margin-bottom:4px;">Payment Completed!</h2>
          <p style="font-size:13px; color:#64748B; margin-bottom:18px;">Your settlement was transferred instantly via PayPal.</p>

          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:20px; text-align:left; font-size:13px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="color:#64748B;">Transaction ID:</span>
              <strong style="font-family:monospace; color:#003087;" id="pp-success-txid">PP-8924719-TX</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="color:#64748B;">Recipient:</span>
              <strong id="pp-success-recipient">Priya Patel</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="color:#64748B;">Amount Paid:</span>
              <strong style="color:#00875A; font-size:15px;" id="pp-success-amount">$45.00 USD</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#64748B;">Status:</span>
              <span class="badge badge-success">Completed & Settled</span>
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button id="pp-download-receipt-btn" class="btn-secondary" style="flex:1;">
              <i class="fa-solid fa-download"></i> Receipt
            </button>
            <button id="pp-success-done-btn" class="btn-paypal-blue" style="flex:1;">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  bindEvents() {
    const overlay = document.getElementById('paypal-modal-overlay');
    const closeBtn = document.getElementById('pp-modal-close-btn');
    const payGoldBtn = document.getElementById('pp-confirm-pay-gold');
    const payCardBtn = document.getElementById('pp-confirm-pay-card');
    const doneBtn = document.getElementById('pp-success-done-btn');
    const downloadBtn = document.getElementById('pp-download-receipt-btn');

    if (closeBtn) closeBtn.onclick = () => this.close();
    if (overlay) {
      overlay.onclick = (e) => {
        if (e.target === overlay) this.close();
      };
    }

    if (payGoldBtn) payGoldBtn.onclick = () => this.processPayment('PayPal Balance');
    if (payCardBtn) payCardBtn.onclick = () => this.processPayment('Debit Card');
    if (doneBtn) doneBtn.onclick = () => this.close();
    if (downloadBtn) downloadBtn.onclick = () => this.downloadSimulatedReceipt();
  }

  /**
   * Open the modal preloaded with dynamic amount
   * @param {Object} options
   * @param {number|string} options.amount - Dynamic exact amount, e.g. 45.00
   * @param {string} options.recipient - Recipient name
   * @param {string} options.recipientEmail - Recipient email
   * @param {string} options.memo - Purpose / memo description
   * @param {string} options.transactionId - Transaction ID if applicable
   * @param {Function} options.onSettled - Optional callback
   */
  open({ amount, recipient, recipientEmail, memo, transactionId, onSettled }) {
    const formattedAmount = '$' + (parseFloat(amount) || 0).toFixed(2);
    this.currentTx = {
      amount: parseFloat(amount) || 0,
      recipient: recipient || 'Group Member',
      recipientEmail: recipientEmail || 'member@splitsmart.io',
      memo: memo || 'SplitSmart Peer-to-Peer Settlement',
      transactionId: transactionId || 'tx-' + Date.now(),
      onSettled: onSettled || null
    };

    // Update UI elements
    document.getElementById('pp-recipient-name').textContent = this.currentTx.recipient;
    document.getElementById('pp-recipient-email').textContent = this.currentTx.recipientEmail;
    document.getElementById('pp-recipient-avatar').textContent = this.currentTx.recipient
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    document.getElementById('pp-display-amount').textContent = formattedAmount;
    document.getElementById('pp-breakdown-subtotal').textContent = formattedAmount;
    document.getElementById('pp-breakdown-total').textContent = formattedAmount;
    document.getElementById('pp-display-memo').textContent = this.currentTx.memo;

    // Reset view states
    document.getElementById('pp-checkout-form').style.display = 'block';
    document.getElementById('pp-spinner-state').style.display = 'none';
    document.getElementById('pp-success-state').style.display = 'none';

    // Show modal
    const overlay = document.getElementById('paypal-modal-overlay');
    overlay.classList.add('active');
  }

  close() {
    const overlay = document.getElementById('paypal-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  processPayment(method) {
    document.getElementById('pp-checkout-form').style.display = 'none';
    document.getElementById('pp-spinner-state').style.display = 'block';

    const spinnerDesc = document.getElementById('pp-spinner-desc');
    spinnerDesc.textContent = `Authorizing instant settlement with ${method}...`;

    setTimeout(() => {
      spinnerDesc.textContent = 'Verifying PayPal cryptographic token & completing zero-fee transfer...';
    }, 900);

    setTimeout(() => {
      // Completed!
      const generatedTxId = 'PP-' + Math.floor(10000000 + Math.random() * 90000000) + '-TX';
      document.getElementById('pp-spinner-state').style.display = 'none';
      document.getElementById('pp-success-state').style.display = 'block';

      document.getElementById('pp-success-txid').textContent = generatedTxId;
      document.getElementById('pp-success-recipient').textContent = this.currentTx.recipient;
      document.getElementById('pp-success-amount').textContent = '$' + this.currentTx.amount.toFixed(2) + ' USD';

      // Update state store
      if (window.splitStore) {
        window.splitStore.settleExpense(this.currentTx.transactionId, this.currentTx.amount, this.currentTx.recipient);
      }

      if (typeof this.currentTx.onSettled === 'function') {
        this.currentTx.onSettled({
          txId: generatedTxId,
          amount: this.currentTx.amount,
          recipient: this.currentTx.recipient
        });
      }

      // Show toast
      if (window.showToast) {
        window.showToast(`Paid $${this.currentTx.amount.toFixed(2)} to ${this.currentTx.recipient} via PayPal!`);
      }
    }, 1800);
  }

  downloadSimulatedReceipt() {
    if (!this.currentTx) return;
    const receiptContent = `======================================================
SPLITSMART - OFFICIAL PAYPAL PAYMENT RECEIPT
======================================================
Transaction ID : PP-${Math.floor(10000000 + Math.random() * 90000000)}-TX
Date/Time      : ${new Date().toLocaleString()}
Payment Status : COMPLETED (Settled)
Payer          : Alex Johnson (alex.j@splitsmart.io)
Recipient      : ${this.currentTx.recipient} (${this.currentTx.recipientEmail})
Memo / Purpose : ${this.currentTx.memo}
Settlement Amt : $${this.currentTx.amount.toFixed(2)} USD
PayPal P2P Fee : $0.00 USD (SplitSmart Zero Fee Protection)
Total Paid     : $${this.currentTx.amount.toFixed(2)} USD
------------------------------------------------------
Payment Method : PayPal Instant Balance / Verified Bank Transfer
Gateway Security: 256-Bit SSL End-to-End Encryption
Thank you for using SplitSmart Powered by PayPal!
======================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SplitSmart_Receipt_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Global singleton instance
window.payPalModal = new PayPalModalManager();

// Global helper for opening modal
window.triggerPayPalCheckout = function(amount, recipient, recipientEmail, memo, transactionId) {
  window.payPalModal.open({
    amount,
    recipient,
    recipientEmail,
    memo,
    transactionId
  });
};
