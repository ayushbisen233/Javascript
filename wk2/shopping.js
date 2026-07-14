let cart = [];
const GST_RATE = 0.18;

document.addEventListener('DOMContentLoaded', () => {
    updateCartTable();
});

function addItem() {
    const customerNameInput = document.getElementById("customerName");
    const productInput = document.getElementById("product");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");

    const customerName = customerNameInput.value.trim();
    const product = productInput.value.trim();
    const price = parseFloat(priceInput.value);
    const quantity = parseInt(quantityInput.value);

    if (!customerName) {
        alert("Please enter customer name.");
        customerNameInput.focus();
        return;
    }

    if (!product) {
        alert("Please enter product name.");
        productInput.focus();
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price.");
        priceInput.focus();
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        quantityInput.focus();
        return;
    }

    const itemTotal = price * quantity;

    const item = {
        id: Date.now(),
        product,
        price,
        quantity,
        total: itemTotal
    };

    cart.push(item);

    customerNameInput.disabled = true;

    // Clear product inputs
    productInput.value = "";
    priceInput.value = "";
    quantityInput.value = "1";
    productInput.focus();

    updateCartTable();
}

function addToCart(productName, price, qtyInputId) {
    const customerNameInput = document.getElementById("customerName");
    const quantityInput = document.getElementById(qtyInputId);
    
    const customerName = customerNameInput.value.trim();
    const quantity = parseInt(quantityInput.value);

    if (!customerName) {
        alert("Please enter customer name before adding items.");
        customerNameInput.focus();
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        quantityInput.focus();
        return;
    }

    const existingItem = cart.find(item => item.product === productName);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.price * existingItem.quantity;
    } else {
        const itemTotal = price * quantity;
        const item = {
            id: Date.now() + Math.random(),
            product: productName,
            price,
            quantity,
            total: itemTotal
        };
        cart.push(item);
    }
    
    customerNameInput.disabled = true;
    quantityInput.value = "1";
    updateCartTable();
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartTable();

    if (cart.length === 0) {
        document.getElementById("customerName").disabled = false;
        document.getElementById("invoiceSection").style.display = "none";
    }
}

function updateCartTable() {
    const cartBody = document.getElementById("cartBody");
    const cartTable = document.getElementById("cartTable");
    const emptyCartMessage = document.getElementById("emptyCartMessage");

    cartBody.innerHTML = "";

    if (cart.length === 0) {
        cartTable.style.display = "none";
        emptyCartMessage.style.display = "block";
    } else {
        cartTable.style.display = "table";
        emptyCartMessage.style.display = "none";

        cart.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.product}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>₹${item.total.toFixed(2)}</td>
                <td><button class="delete-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button></td>
            `;
            cartBody.appendChild(row);
        });
    }
}

function generateInvoice() {
    if (cart.length === 0) {
        alert("Cart is empty. Please add items to generate invoice.");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();

    // Populate invoice details
    document.getElementById("invCustomer").textContent = customerName;
    document.getElementById("invNumber").textContent = "INV-" + Math.floor(100000 + Math.random() * 900000);

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById("invDate").textContent = "Date: " + new Date().toLocaleDateString('en-IN', options);

    const invoiceBody = document.getElementById("invoiceBody");
    invoiceBody.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        subtotal += item.total;
        totalItems += item.quantity;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.product}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₹${item.total.toFixed(2)}</td>
        `;
        invoiceBody.appendChild(row);
    });

    const gstAmount = subtotal * GST_RATE;
    const grandTotal = subtotal + gstAmount;

    document.getElementById("res-items").textContent = totalItems;
    document.getElementById("res-subtotal").textContent = "₹" + subtotal.toFixed(2);
    document.getElementById("res-gst").textContent = "₹" + gstAmount.toFixed(2);
    document.getElementById("res-total").textContent = "₹" + grandTotal.toFixed(2);

    document.getElementById("invoiceSection").style.display = "block";
    document.getElementById("cartSection").style.display = "none";
    document.getElementById("shopContainer").style.display = "none";
    if (document.querySelector(".manual-add-section")) {
        document.querySelector(".manual-add-section").style.display = "none";
    }
    document.getElementById("mainActions").style.display = "none";
}

function resetForm() {
    cart = [];
    document.getElementById("customerName").value = "";
    document.getElementById("customerName").disabled = false;
    document.getElementById("product").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "1";

    const qtyInputs = document.querySelectorAll('input[id^="qty-"]');
    qtyInputs.forEach(input => input.value = "1");

    document.getElementById("invoiceSection").style.display = "none";
    document.getElementById("cartSection").style.display = "block";
    document.getElementById("shopContainer").style.display = "block";
    if (document.querySelector(".manual-add-section")) {
        document.querySelector(".manual-add-section").style.display = "block";
    }
    document.getElementById("mainActions").style.display = "flex";

    updateCartTable();
}
