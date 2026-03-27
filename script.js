class MoneyManagerApp {
    constructor() {
        this.transactions = [];
        this.editingId = null;
        this.currentFilter = {};
        this.init();
    }

    init() {
        this.loadTransactions();
        this.updateSummary();
        this.renderTransactions();
        this.setupEventListeners();
        this.updateSubCategoryFilterOptions();
    }

    loadTransactions() {
        try {
            const saved = localStorage.getItem('transactions');
            if (saved) {
                this.transactions = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading transactions:', e);
            this.transactions = [];
        }
    }

    saveTransactions() {
        try {
            localStorage.setItem('transactions', JSON.stringify(this.transactions));
        } catch (e) {
            console.error('Error saving transactions:', e);
        }
    }

    formatRupees(amount) {
        return `₹${amount.toFixed(2)}`;
    }

    setupEventListeners() {
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateSubCategoryOptions();
            });
        });

        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortBy').addEventListener('change', () => this.applyFilters());
    }

    showAddForm() {
        this.editingId = null;
        document.getElementById('modalTitle').textContent = 'Add Transaction';
        document.getElementById('submitBtn').textContent = 'Add Transaction';
        this.clearForm();
        document.getElementById('date').valueAsDate = new Date();
        document.getElementById('transactionModal').style.display = 'block';
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        this.editingId = id;
        document.getElementById('modalTitle').textContent = 'Edit Transaction';
        document.getElementById('submitBtn').textContent = 'Update Transaction';

        document.getElementById('amount').value = transaction.amount;
        document.getElementById('date').value = transaction.date;
        document.querySelector(`input[name="category"][value="${transaction.category}"]`).checked = true;
        document.getElementById('subCategory').value = transaction.subCategory;
        document.getElementById('description').value = transaction.description || '';

        this.updateSubCategoryOptions();
        document.getElementById('transactionModal').style.display = 'block';
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateSummary();
            this.renderTransactions();
            this.updateSubCategoryFilterOptions();
        }
    }

    closeModal() {
        document.getElementById('transactionModal').style.display = 'none';
        this.clearForm();
        this.clearErrors();
    }

    clearForm() {
        document.getElementById('transactionForm').reset();
        document.getElementById('date').valueAsDate = new Date();
    }

    validateForm() {
        this.clearErrors();
        let isValid = true;

        const amount = parseFloat(document.getElementById('amount').value);
        if (!amount || amount <= 0) {
            this.showError('amountError', 'Amount must be greater than 0');
            isValid = false;
        }

        const date = new Date(document.getElementById('date').value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (date > today) {
            this.showError('dateError', 'Date cannot be in the future');
            isValid = false;
        }

        const category = document.querySelector('input[name="category"]:checked');
        if (!category) {
            this.showError('categoryError', 'Please select a category');
            isValid = false;
        }

        const subCategory = document.getElementById('subCategory').value;
        if (!subCategory) {
            this.showError('subCategoryError', 'Please select a sub-category');
            isValid = false;
        }

        return isValid;
    }

    showError(errorId, message) {
        const errorEl = document.getElementById(errorId);
        const inputId = errorId.replace('Error', '');
        document.getElementById(inputId).classList.add('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });
        const inputs = document.querySelectorAll('.form-group input, .form-group select');
        inputs.forEach(input => input.classList.remove('error'));
    }

    handleFormSubmit() {
        if (!this.validateForm()) return;

        const transaction = {
            id: this.editingId || Date.now(),
            amount: parseFloat(document.getElementById('amount').value),
            date: document.getElementById('date').value,
            category: document.querySelector('input[name="category"]:checked').value,
            subCategory: document.getElementById('subCategory').value,
            description: document.getElementById('description').value.trim() || ''
        };

        if (this.editingId) {
            const index = this.transactions.findIndex(t => t.id === this.editingId);
            this.transactions[index] = transaction;
        } else {
            this.transactions.push(transaction);
        }

        this.saveTransactions();
        this.updateSummary();
        this.renderTransactions();
        this.closeModal();
        this.updateSubCategoryFilterOptions();
    }

    updateSummary() {
        const income = this.transactions
            .filter(t => t.category === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = this.transactions
            .filter(t => t.category === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;

        document.getElementById('totalIncome').textContent = this.formatRupees(income);
        document.getElementById('totalExpenses').textContent = this.formatRupees(expenses);
        document.getElementById('netBalance').textContent = this.formatRupees(balance);
        
        const balanceEl = document.getElementById('netBalance').parentElement;
        balanceEl.className = balance >= 0 ? 'summary-card balance' : 'summary-card expense';
    }

    updateSubCategoryOptions() {
        const category = document.querySelector('input[name="category"]:checked')?.value;
        const subCategorySelect = document.getElementById('subCategory');
        
        const incomeOptions = ['Salary', 'Allowances', 'Bonus', 'Petty Cash', 'Other Income'];
        const expenseOptions = ['Rent', 'Food', 'Shopping', 'Entertainment', 'Transport', 'Utilities', 'Other Expense'];

        subCategorySelect.innerHTML = '<option value="">Select Sub-Category</option>';
        
        const options = category === 'Income' ? incomeOptions : expenseOptions;
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            subCategorySelect.appendChild(opt);
        });
    }

    updateSubCategoryFilterOptions() {
        const subCategoryFilter = document.getElementById('subCategoryFilter');
        const allSubCategories = [...new Set(this.transactions.map(t => t.subCategory))].sort();
        
        subCategoryFilter.innerHTML = '<option value="">All Sub-Categories</option>';
        allSubCategories.forEach(subCat => {
            const opt = document.createElement('option');
            opt.value = subCat;
            opt.textContent = subCat;
            subCategoryFilter.appendChild(opt);
        });
    }

    getFilteredTransactions() {
        let filtered = [...this.transactions];

        const categoryFilter = document.getElementById('categoryFilter').value;
        if (categoryFilter) {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        const subCategoryFilter = document.getElementById('subCategoryFilter').value;
        if (subCategoryFilter) {
            filtered = filtered.filter(t => t.subCategory === subCategoryFilter);
        }

        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        if (dateFrom) {
            filtered = filtered.filter(t => t.date >= dateFrom);
        }
        if (dateTo) {
            filtered = filtered.filter(t => t.date <= dateTo);
        }

        const sortBy = document.getElementById('sortBy').value;
        filtered.sort((a, b) => {
            if (sortBy === 'date-desc') {
                return new Date(b.date) - new Date(a.date);
            } else if (sortBy === 'date-asc') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortBy === 'amount-desc') {
                return b.amount - a.amount;
            } else if (sortBy === 'amount-asc') {
                return a.amount - b.amount;
            }
            return 0;
        });

        return filtered;
    }

    renderTransactions(transactions = null) {
        const tbody = document.getElementById('transactionsBody');
        const filteredTransactions = transactions || this.getFilteredTransactions();

        if (filteredTransactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-transactions">
                        ${transactions ? 'No transactions match your filters.' : 'No transactions yet. Add your first transaction!'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredTransactions.map(transaction => `
            <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${transaction.category}</td>
                <td>${transaction.subCategory}</td>
                <td>${transaction.description || '-'}</td>
                <td class="${transaction.category === 'Income' ? 'income-amount' : 'expense-amount'}">
                    ${transaction.category === 'Income' ? '+' : '-'}${this.formatRupees(transaction.amount)}
                </td>
                <td class="actions">
                    <button class="edit-btn" onclick="app.editTransaction(${transaction.id})">Edit</button>
                    <button class="delete-btn" onclick="app.deleteTransaction(${transaction.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    applyFilters() {
        const filtered = this.getFilteredTransactions();
        this.renderTransactions(filtered);
    }

    clearFilters() {
        document.getElementById('categoryFilter').value = '';
        document.getElementById('subCategoryFilter').value = '';
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('sortBy').value = 'date-desc';
        this.renderTransactions();
    }
}

// Initialize the app when page loads
const app = new MoneyManagerApp();