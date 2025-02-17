const API_URL = window.location.origin.includes("5500")
  ? "http://localhost:5000/api/expenses" // ✅ Works when accessed from the browser
  : "http://backend:5000/api/expenses";   // ✅ Works inside Docker Compose

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const searchInput = document.getElementById("search");
const totalExpenseElement = document.getElementById("total-expense");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("user").value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, category, amount })
    });

    const expense = await response.json();
    showExpense(expense);
    updateTotalExpense(); // Update total after adding expense
    form.reset();
});

async function loadExpenses() {
    try {
        const response = await fetch("http://localhost:5000/api/expenses");
        const expenses = await response.json();

        console.log("Fetched Expenses:", expenses); // Debugging line

        const expenseList = document.getElementById("expense-list");
        expenseList.innerHTML = ""; // Clear previous entries

        expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.user}</td>
                <td>${expense.category}</td>
                <td>${expense.amount}</td>
                <td>${expense.date}</td>
            `;
            expenseList.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading expenses:", error);
    }
}


function showExpense(expense) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", expense._id);

    row.innerHTML = `
        <td><input type="text" value="${expense.user}" disabled></td>
        <td><input type="text" value="${expense.category}" disabled></td>
        <td><input type="number" value="${expense.amount}" disabled></td>
        <td>
            <button class="action-btn edit-btn">✏ Edit</button>
            <button class="action-btn save-btn" style="display:none;">💾 Save</button>
            <button class="action-btn delete-btn">🗑 Delete</button>
        </td>
    `;

    const editBtn = row.querySelector(".edit-btn");
    const saveBtn = row.querySelector(".save-btn");
    const deleteBtn = row.querySelector(".delete-btn");
    const inputs = row.querySelectorAll("input");

    // ✅ Enable Editing
    editBtn.addEventListener("click", () => {
        inputs.forEach(input => input.disabled = false);
        editBtn.style.display = "none";
        saveBtn.style.display = "inline-block";
    });

    // ✅ Save Updated Data
    saveBtn.addEventListener("click", async () => {
        const updatedExpense = {
            user: inputs[0].value.trim(),
            category: inputs[1].value.trim(),
            amount: parseFloat(inputs[2].value.trim())
        };

        const response = await fetch(`${API_URL}/${expense._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedExpense)
        });

        if (response.ok) {
            inputs.forEach(input => input.disabled = true);
            editBtn.style.display = "inline-block";
            saveBtn.style.display = "none";
            updateTotalExpense(); // Update total after editing expense
        } else {
            alert("Failed to update expense.");
        }
    });

    // ✅ Delete Expense
    deleteBtn.addEventListener("click", async () => {
        const response = await fetch(`${API_URL}/${expense._id}`, { method: "DELETE" });

        if (response.ok) {
            row.remove();
            updateTotalExpense(); // Update total after deleting expense
        } else {
            alert("Failed to delete expense.");
        }
    });

    expenseList.appendChild(row);
    updateTotalExpense(); // Update total after adding expense
}

// ✅ Function to Update Total Expense
function updateTotalExpense() {
    let total = 0;
    document.querySelectorAll("#expense-list tr").forEach(row => {
        const amount = parseFloat(row.children[2].children[0].value);
        total += isNaN(amount) ? 0 : amount;
    });
    totalExpenseElement.textContent = total.toFixed(2);
}

// ✅ Search Functionality (Filters in Real-Time)
searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#expense-list tr");

    rows.forEach(row => {
        const user = row.children[0].children[0].value.toLowerCase();
        const category = row.children[1].children[0].value.toLowerCase();
        const amount = row.children[2].children[0].value.toLowerCase();

        if (user.includes(filter) || category.includes(filter) || amount.includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

loadExpenses();
