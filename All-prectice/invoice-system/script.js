let invoiceItems = [];

// Get all the elements we need from the HTML
const itemForm = document.getElementById('itemForm');
const invoiceItemsBody = document.getElementById('invoiceItemsBody');
const emptyStateRow = document.getElementById('emptyStateRow');
const globalTaxInput = document.getElementById('globalTax');

const subtotalDisplay = document.getElementById('subtotalDisplay');
const discountDisplay = document.getElementById('discountDisplay');
const taxRateDisplay = document.getElementById('taxRateDisplay');
const taxDisplay = document.getElementById('taxDisplay');
const grandTotalDisplay = document.getElementById('grandTotalDisplay');
const displayDate = document.getElementById('displayDate');
const resetBtn = document.getElementById('resetBtn');

// Helper function to format numbers as Currency
function formatCurrency(amount) {
    let formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    });
    return formatter.format(amount);
}

// Function to handle adding a new item
function handleAddItem(event) {
    // Prevent the page from reloading
    event.preventDefault();

    // Get the input elements
    const nameInput = document.getElementById('itemName');
    const qtyInput = document.getElementById('itemQty');
    const priceInput = document.getElementById('itemPrice');
    const discountInput = document.getElementById('itemDiscount');

    // Get the values from the inputs
    const name = nameInput.value.trim();
    const qty = parseFloat(qtyInput.value);
    const price = parseFloat(priceInput.value);
    let discountPerc = parseFloat(discountInput.value);

    // If discount is empty, make it 0
    if (isNaN(discountPerc)) {
        discountPerc = 0;
    }

    // Check if the inputs are valid
    if (name === "") {
        alert("Please enter a valid item name.");
        return;
    }
    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }
    if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
    }
    if (discountPerc < 0 || discountPerc > 100) {
        alert("Please enter a valid discount percentage (0-100).");
        return;
    }

    // Calculate totals for this item
    const grossTotal = qty * price;
    const discountAmount = grossTotal * (discountPerc / 100);
    const netTotal = grossTotal - discountAmount;

    // Create a new item object
    const newItem = {
        id: Date.now().toString(), // Create a unique ID
        name: name,
        qty: qty,
        price: price,
        discountPerc: discountPerc,
        discountAmount: discountAmount,
        total: netTotal
    };

    // Add the new item to our array
    invoiceItems.push(newItem);

    // Clear the form for the next item
    itemForm.reset();

    // Update the screen
    renderTable();
}

// Function to remove an item
function removeItem(idToRemove) {
    // Keep all items except the one with the matching ID using a standard loop
    let newItems = [];
    for (let i = 0; i < invoiceItems.length; i++) {
        if (invoiceItems[i].id !== idToRemove) {
            newItems.push(invoiceItems[i]);
        }
    }
    invoiceItems = newItems;

    // Update the screen
    renderTable();
}

// Make removeItem available globally so the inline onclick works
window.removeItem = removeItem;

// Function to update the table and calculations on the screen
function renderTable() {
    // Clear the current table rows
    invoiceItemsBody.innerHTML = '';

    // If there are no items, show the empty state message
    if (invoiceItems.length === 0) {
        invoiceItemsBody.appendChild(emptyStateRow);
        emptyStateRow.style.display = 'table-row';
    } else {
        // Hide the empty state message
        emptyStateRow.style.display = 'none';

        // Loop through all items and create a row for each
        for (let i = 0; i < invoiceItems.length; i++) {
            const currentItem = invoiceItems[i];

            // Format discount text
            let discountText = '-';
            if (currentItem.discountPerc > 0) {
                discountText = currentItem.discountPerc + '%';
            }

            // Create the HTML for the row
            const tr = document.createElement('tr');
            tr.className = 'item-row';
            tr.innerHTML = `
                <td class="col-item">${currentItem.name}</td>
                <td class="col-qty">${currentItem.qty}</td>
                <td class="col-price">${formatCurrency(currentItem.price)}</td>
                <td class="col-disc text-success">${discountText}</td>
                <td class="col-total">${formatCurrency(currentItem.total)}</td>
                <td class="col-actions">
                    <button class="btn-icon" onclick="removeItem('${currentItem.id}')">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </td>
            `;

            // Add the row to the table
            invoiceItemsBody.appendChild(tr);
        }
    }

    // Now calculate and update the total summary
    calculateTotals();
}

// Function to calculate subtotals, tax, and grand total
function calculateTotals() {
    let subtotal = 0;
    let totalDiscount = 0;

    // Add up the totals from all items
    for (let i = 0; i < invoiceItems.length; i++) {
        const item = invoiceItems[i];
        subtotal = subtotal + (item.qty * item.price);
        totalDiscount = totalDiscount + item.discountAmount;
    }

    // Calculate tax
    let taxRate = parseFloat(globalTaxInput.value);
    if (isNaN(taxRate)) {
        taxRate = 0;
    }

    const preTaxTotal = subtotal - totalDiscount;
    const taxAmount = preTaxTotal * (taxRate / 100);
    const grandTotal = preTaxTotal + taxAmount;

    // Display the values on the screen
    subtotalDisplay.textContent = formatCurrency(subtotal);
    discountDisplay.textContent = "-" + formatCurrency(totalDiscount);
    taxRateDisplay.textContent = taxRate + "%";
    taxDisplay.textContent = formatCurrency(taxAmount);
    grandTotalDisplay.textContent = formatCurrency(grandTotal);
}

// Function to handle the reset button
function handleReset() {
    const userConfirmed = confirm("Are you sure you want to clear the invoice?");
    if (userConfirmed === true) {
        // Empty the array
        invoiceItems = [];
        // Reset the tax input
        globalTaxInput.value = "5.00";
        // Reset the form
        itemForm.reset();
        // Update the screen
        renderTable();
    }
}

// Setup the initial state when the page loads
function init() {
    // Set today's date
    const today = new Date();
    displayDate.textContent = "Date: " + today.toLocaleDateString();

    // Show the empty table
    renderTable();

    // Attach event listeners using standard syntax
    itemForm.addEventListener('submit', handleAddItem);
    globalTaxInput.addEventListener('input', calculateTotals);
    resetBtn.addEventListener('click', handleReset);
}

// Run the setup function when the page is ready
document.addEventListener('DOMContentLoaded', init);
