let items = [
    { name: "Laptop", price: 999 },
    { name: "Mouse", price: 25 },
    { name: "Keyboard", price: 75 },
    { name: "Monitor", price: 200 }
];

const itemForm = document.getElementById('itemForm');
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemsList = document.getElementById('itemsList');
const minResult = document.getElementById('minResult');
const maxResult = document.getElementById('maxResult');

function renderItems() {
    itemsList.innerHTML = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
        </tr>
    `).join('');
}

function updateMinMax() {
    if (items.length === 0) {
        minResult.textContent = "No items in array";
        maxResult.textContent = "No items in array";
        return;
    }

    const minItem = items.reduce((min, curr) => curr.price < min.price ? curr : min, items[0]);
    const maxItem = items.reduce((max, curr) => curr.price > max.price ? curr : max, items[0]);

    minResult.textContent = `${minItem.name} ($${minItem.price})`;
    maxResult.textContent = `${maxItem.name} ($${maxItem.price})`;
}

itemForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);

    if (name && !isNaN(price)) {
        items.push({ name: name, price: price });
        itemNameInput.value = '';
        itemPriceInput.value = '';
        renderItems();
        updateMinMax();
    }
});

renderItems();
updateMinMax();