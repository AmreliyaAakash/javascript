let items = [];

const $ = id => document.getElementById(id);
const fmt = amt => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);

$('itemForm').onsubmit = (e) => {
    e.preventDefault();
    const name = $('itemName').value.trim();
    const qty = +$('itemQty').value;
    const price = +$('itemPrice').value;
    const disc = +$('itemDiscount').value || 0;

    if (!name || isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0 || disc < 0 || disc > 100)
        return alert("Invalid input.");

    const total = (qty * price) * (1 - (disc / 100));
    const discAmount = (qty * price) * (disc / 100);

    items.push({ id: Date.now(), name, qty, price, disc, discAmount, total });
    $('itemForm').reset();
    render();
};

const remove = id => { items = items.filter(i => i.id !== id); render(); };

$('globalTax').oninput = render;
$('resetBtn').onclick = () => confirm("Are you sure you want to clear the invoice?") && (items = [], $('itemForm').reset(), $('globalTax').value = "5.00", render());

function render() {
    $('invoiceItemsBody').innerHTML = items.length ? '' : $('emptyStateRow').outerHTML;

    let subtotal = 0, totalDisc = 0;

    items.forEach(i => {
        subtotal += (i.qty * i.price);
        totalDisc += i.discAmount;

        $('invoiceItemsBody').insertAdjacentHTML('beforeend', `
            <tr class="item-row">
                <td>${i.name}</td>
                <td class="col-qty">${i.qty}</td>
                <td class="col-price">${fmt(i.price)}</td>
                <td class="col-disc text-success">${i.disc > 0 ? i.disc + '%' : '-'}</td>
                <td class="col-total">${fmt(i.total)}</td>
                <td class="col-actions"><button type="button" class="btn-icon" onclick="remove(${i.id})"><i class="ri-delete-bin-line"></i></button></td>
            </tr>
        `);
    });

    const taxRate = +$('globalTax').value || 0;
    const preTaxTotal = subtotal - totalDisc;
    const tax = preTaxTotal * (taxRate / 100);

    $('subtotalDisplay').textContent = fmt(subtotal);
    $('discountDisplay').textContent = `-${fmt(totalDisc)}`;
    $('taxRateDisplay').textContent = `${taxRate}%`;
    $('taxDisplay').textContent = fmt(tax);
    $('grandTotalDisplay').textContent = fmt(preTaxTotal + tax);
}

$('displayDate').textContent = `Date: ${new Date().toLocaleDateString()}`;
render();
