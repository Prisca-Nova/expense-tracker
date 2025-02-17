async function loadExpenses() {
    try {
        const response = await fetch('/api/expenses');
        const expenses = await response.json();
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = '';
        let totalExpense = 0;

        expenses.forEach(expense => {
            totalExpense += expense.amount;
            const row = `
                <tr>
                    <td>${expense.user}</td>
                    <td>${expense.category}</td>
                    <td>$${expense.amount}</td>
                    <td>
                        <button onclick="deleteExpense('${expense._id}')">🗑️</button>
                    </td>
                </tr>
            `;
            expenseList.innerHTML += row;
        });

        document.getElementById('total-expense').textContent = totalExpense.toFixed(2);
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

// Add new expense
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const expense = {
        user: document.getElementById('user').value,
        category: document.getElementById('category').value,
        amount: Number(document.getElementById('amount').value)
    };

    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });

        if (response.ok) {
            document.getElementById('expense-form').reset();
            loadExpenses();
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
});

// Delete expense
async function deleteExpense(id) {
    try {
        const response = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadExpenses();
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

// Search functionality
document.getElementById('search').addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    try {
        const response = await fetch(`/api/expenses?search=${searchTerm}`);
        const expenses = await response.json();
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = '';
        let totalExpense = 0;

        expenses.forEach(expense => {
            totalExpense += expense.amount;
            const row = `
                <tr>
                    <td>${expense.user}</td>
                    <td>${expense.category}</td>
                    <td>$${expense.amount}</td>
                    <td>
                        <button onclick="deleteExpense('${expense._id}')">🗑️</button>
                    </td>
                </tr>
            `;
            expenseList.innerHTML += row;
        });

        document.getElementById('total-expense').textContent = totalExpense.toFixed(2);
    } catch (error) {
        console.error('Error searching expenses:', error);
    }
});

// Load expenses when page loads
loadExpenses();