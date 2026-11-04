/* ============================================================
   SplitSmart - Reactive Application State
   ============================================================ */

const SPLITSMART_STORAGE_KEY = 'splitsmart_app_state_v1';

const defaultState = {
  auth: {
    isLoggedIn: false,
    agreedToTerms: false,
    email: 'alex.j@splitsmart.io',
    name: 'Alex Johnson',
    avatar: 'AJ',
    bankUnlocked: false
  },
  
  balances: {
    youOwe: 68.50,
    youAreOwed: 142.00,
    netBalance: 73.50
  },
  
  bankDetails: {
    bankName: 'JPMorgan Chase Bank, N.A.',
    accountType: 'Premier Platinum Checking',
    maskedAccount: '•••• •••• •••• 4829',
    realAccount: '0028 9481 4829',
    maskedRouting: '•••• 0210',
    realRouting: '021000021',
    paypalEmail: 'alex.j@splitsmart.io (PayPal Verified)',
    availableBalance: '$3,420.50 USD',
    autoWithdraw: 'Active - Daily Sweeps'
  },
  
  travel: {
    currentTripId: 'goa2026',
    trips: [
      {
        id: 'goa2026',
        name: 'Goa Vacation 2026',
        location: 'Goa, India',
        totalBudget: 2500.00,
        totalSpent: 1480.00,
        currency: 'USD',
        members: [
          { id: 'rahul', name: 'Rahul Sharma', avatar: 'RS', owesYou: 85.00, youOwe: 0, sharePercent: 25 },
          { id: 'priya', name: 'Priya Patel', avatar: 'PP', owesYou: 0, youOwe: 45.00, sharePercent: 25 },
          { id: 'alex_m', name: 'Alex Morgan', avatar: 'AM', owesYou: 23.50, youOwe: 0, sharePercent: 25 },
          { id: 'you', name: 'You (Alex J)', avatar: 'AJ', owesYou: 0, youOwe: 23.50, sharePercent: 25 }
        ],
        expenses: [
          { id: 'tx-t1', title: 'Sea Breeze Luxury Villa (3 Nights)', amount: 720.00, payer: 'Rahul Sharma', category: 'Hotel', date: 'Oct 28, 2026' },
          { id: 'tx-t2', title: 'Seafood Beach Shack Dinner', amount: 180.00, payer: 'Priya Patel', category: 'Food', date: 'Oct 29, 2026' },
          { id: 'tx-t3', title: 'Airport Cabs & Fuel', amount: 120.00, payer: 'Alex Morgan', category: 'Cabs', date: 'Oct 29, 2026' },
          { id: 'tx-t4', title: 'Scuba Diving & Water Sports', amount: 460.00, payer: 'Rahul Sharma', category: 'Sightseeing', date: 'Oct 30, 2026' }
        ]
      }
    ]
  },
  
  transactions: [
    {
      id: 'tx-101',
      date: 'Nov 02, 2026',
      title: 'Saturday Seafood Dinner',
      group: 'Goa Vacation 2026',
      category: 'Trips',
      icon: 'fa-utensils',
      totalAmount: 180.00,
      yourShare: 45.00,
      payer: 'Priya Patel',
      status: 'Owed',
      recipientEmail: 'priya.patel@splitsmart.io',
      memo: 'Split 4-ways for Saturday seafood BBQ in Goa',
      breakdown: [
        { name: 'Priya Patel', share: 45.00, paid: true },
        { name: 'Rahul Sharma', share: 45.00, paid: true },
        { name: 'Alex Morgan', share: 45.00, paid: true },
        { name: 'You (Alex J)', share: 45.00, paid: false }
      ]
    },
    {
      id: 'tx-102',
      date: 'Nov 01, 2026',
      title: 'Apartment Rent & Wi-Fi',
      group: 'Flat 302 Roommates',
      category: 'Roommates',
      icon: 'fa-home',
      totalAmount: 1200.00,
      yourShare: 300.00,
      payer: 'You (Alex J)',
      status: 'Settled',
      recipientEmail: 'landlord@propertypay.com',
      memo: 'Monthly November rent + high-speed fiber internet',
      breakdown: [
        { name: 'You (Alex J)', share: 300.00, paid: true },
        { name: 'Rahul Sharma', share: 300.00, paid: true },
        { name: 'Priya Patel', share: 300.00, paid: true },
        { name: 'Alex Morgan', share: 300.00, paid: true }
      ]
    },
    {
      id: 'tx-103',
      date: 'Oct 30, 2026',
      title: 'Friday Craft Beer & Burgers',
      group: 'Friday Hangouts',
      category: 'Hangouts',
      icon: 'fa-beer-mug-empty',
      totalAmount: 94.00,
      yourShare: 23.50,
      payer: 'Rahul Sharma',
      status: 'Owed',
      recipientEmail: 'rahul.sharma@splitsmart.io',
      memo: 'Downtown Brewery tab & sliders',
      breakdown: [
        { name: 'Rahul Sharma', share: 23.50, paid: true },
        { name: 'You (Alex J)', share: 23.50, paid: false },
        { name: 'Alex Morgan', share: 23.50, paid: true },
        { name: 'Sam K', share: 23.50, paid: true }
      ]
    },
    {
      id: 'tx-104',
      date: 'Oct 28, 2026',
      title: 'Goa Villa Deposit Settlement',
      group: 'Goa Vacation 2026',
      category: 'Trips',
      icon: 'fa-hotel',
      totalAmount: 340.00,
      yourShare: 85.00,
      payer: 'You (Alex J)',
      status: 'Settled',
      recipientEmail: 'alex.j@splitsmart.io',
      memo: 'Security advance paid to resort manager',
      breakdown: [
        { name: 'Rahul Sharma', share: 85.00, paid: true },
        { name: 'You', share: 85.00, paid: true }
      ]
    },
    {
      id: 'tx-105',
      date: 'Oct 25, 2026',
      title: 'Grocery Restock & Trader Joes',
      group: 'Flat 302 Roommates',
      category: 'Roommates',
      icon: 'fa-basket-shopping',
      totalAmount: 142.00,
      yourShare: 47.33,
      payer: 'Alex Morgan',
      status: 'Settled',
      recipientEmail: 'alex.m@splitsmart.io',
      memo: 'Pantry essentials, fruits, dairy, and cleaning supplies',
      breakdown: [
        { name: 'Alex Morgan', share: 47.34, paid: true },
        { name: 'Rahul Sharma', share: 47.33, paid: true },
        { name: 'You', share: 47.33, paid: true }
      ]
    }
  ],
  
  chat: {
    activeGroup: 'Flat 302 Roommates',
    groups: ['Flat 302 Roommates', 'Goa Vacation 2026', 'Friday Hangouts'],
    messages: [
      {
        id: 'msg-1',
        sender: 'Rahul Sharma',
        avatar: 'RS',
        isMe: false,
        time: '11:20 AM',
        type: 'text',
        text: 'Hey roommates! Just picked up the new air purifier filters and living room lights.'
      },
      {
        id: 'msg-2',
        sender: 'Rahul Sharma',
        avatar: 'RS',
        isMe: false,
        time: '11:21 AM',
        type: 'bitmoji',
        sticker: '🍕💸',
        label: 'Paid Bill'
      },
      {
        id: 'msg-3',
        sender: 'System',
        time: '11:21 AM',
        type: 'expense_card',
        cardData: {
          title: 'Living Room Purifier & Lighting',
          total: 60.00,
          perPerson: 15.00,
          payer: 'Rahul Sharma',
          recipientEmail: 'rahul.sharma@splitsmart.io',
          yourShare: 15.00,
          isSettled: false
        }
      },
      {
        id: 'msg-4',
        sender: 'Priya Patel',
        avatar: 'PP',
        isMe: false,
        time: '11:24 AM',
        type: 'bitmoji',
        sticker: '⏰',
        label: 'Reminder'
      },
      {
        id: 'msg-5',
        sender: 'Priya Patel',
        avatar: 'PP',
        isMe: false,
        time: '11:25 AM',
        type: 'text',
        text: 'Awesome, thanks Rahul! Let us all settle this up before tonight.'
      }
    ]
  },
  
  rates: {
    USD: 1.00,
    INR: 83.20,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
    CAD: 1.36
  },
  
  suggestions: [
    {
      id: 'sugg-1',
      category: 'friends',
      title: 'Frequently Paid: Rahul Sharma',
      subtitle: 'Rahul covered beer & sliders tab ($23.50). Settle up in 1-click via PayPal.',
      amount: 23.50,
      recipient: 'Rahul Sharma',
      recipientEmail: 'rahul.sharma@splitsmart.io',
      icon: 'fa-user-check',
      badge: 'Quick Settle'
    },
    {
      id: 'sugg-2',
      category: 'friends',
      title: 'Pending Goa Seafood BBQ: Priya Patel',
      subtitle: 'Your share from Saturday Dinner is $45.00. Priya prefers PayPal direct settlement.',
      amount: 45.00,
      recipient: 'Priya Patel',
      recipientEmail: 'priya.patel@splitsmart.io',
      icon: 'fa-umbrella-beach',
      badge: 'Travel Due'
    },
    {
      id: 'sugg-3',
      category: 'recurring',
      title: 'Monthly Rent Reminder: Flat 302',
      subtitle: 'Apartment rent due in 2 days ($300.00). Settle early to keep credit tier A+.',
      amount: 300.00,
      recipient: 'Property Management Co.',
      recipientEmail: 'billing@propertypay.com',
      icon: 'fa-calendar-check',
      badge: 'Recurring'
    },
    {
      id: 'sugg-4',
      category: 'optimization',
      title: 'AI Debt Simplification Optimization',
      subtitle: 'Instead of making 3 separate small payments across 3 friends, you can pay $45.00 to Priya to zero-out all group debts!',
      amount: 45.00,
      recipient: 'Priya Patel',
      recipientEmail: 'priya.patel@splitsmart.io',
      icon: 'fa-wand-magic-sparkles',
      badge: 'Smart Route'
    }
  ]
};

class StateStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }
  
  loadState() {
    try {
      const saved = localStorage.getItem(SPLITSMART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default state.', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }
  
  saveState() {
    try {
      localStorage.setItem(SPLITSMART_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage.', e);
    }
    this.notify();
  }
  
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
  
  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }
  
  login(email, name = 'Alex Johnson') {
    this.state.auth.isLoggedIn = true;
    this.state.auth.email = email;
    this.state.auth.name = name;
    this.saveState();
  }
  
  agreeToTerms() {
    this.state.auth.agreedToTerms = true;
    this.saveState();
  }
  
  logout() {
    this.state.auth.isLoggedIn = false;
    this.state.auth.agreedToTerms = false;
    this.state.auth.bankUnlocked = false;
    this.saveState();
  }
  
  unlockBankDetails() {
    this.state.auth.bankUnlocked = true;
    this.saveState();
  }
  
  lockBankDetails() {
    this.state.auth.bankUnlocked = false;
    this.saveState();
  }
  
  // Settle an expense with dynamic amount
  settleExpense(transactionId, amount, recipientName) {
    const tx = this.state.transactions.find(t => t.id === transactionId);
    if (tx) {
      tx.status = 'Settled';
    }
    
    // Reduce 'youOwe' balance
    const settleAmt = parseFloat(amount) || 0;
    this.state.balances.youOwe = Math.max(0, this.state.balances.youOwe - settleAmt);
    this.state.balances.netBalance = this.state.balances.youAreOwed - this.state.balances.youOwe;
    
    // Update travel settlements if matching
    const goa = this.state.travel.trips.find(t => t.id === 'goa2026');
    if (goa) {
      const member = goa.members.find(m => m.name.toLowerCase().includes((recipientName || '').toLowerCase()));
      if (member && member.youOwe > 0) {
        member.youOwe = Math.max(0, member.youOwe - settleAmt);
      }
    }
    
    // Update suggestions if settled
    this.state.suggestions = this.state.suggestions.filter(s => s.amount !== settleAmt || !s.recipient.includes(recipientName || ''));
    
    this.saveState();
  }
  
  addTravelExpense(expense) {
    const goa = this.state.travel.trips.find(t => t.id === 'goa2026');
    if (goa) {
      goa.expenses.unshift(expense);
      goa.totalSpent += parseFloat(expense.amount) || 0;
      this.saveState();
    }
  }
  
  addChatMessage(msg) {
    this.state.chat.messages.push(msg);
    this.saveState();
  }
  
  resetDemo() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
  }
}

// Global singleton instance
window.splitStore = new StateStore();
