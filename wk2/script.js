function calculateBill() {
    // let example
    let customerName = document.getElementById("customerName").value;
    let product = document.getElementById("product").value;
    let price = Number(document.getElementById("price").value);
    let quantity = Number(document.getElementById("quantity").value);

    if (!customerName || !product || price <= 0 || quantity <= 0) {
        alert("Please enter valid details for all fields.");
        return;
    }

    const GST = 0.18;

    let subtotal = price * quantity;
    let gstAmount = subtotal * GST;
    let total = subtotal + gstAmount;

    const bill = {
        customerName,
        product,
        subtotal,
        gstAmount,
        total
    };

    document.getElementById("res-customer").textContent = bill.customerName;
    document.getElementById("res-product").textContent = bill.product;
    document.getElementById("res-subtotal").textContent = bill.subtotal.toFixed(2);
    document.getElementById("res-gst").textContent = bill.gstAmount.toFixed(2);
    document.getElementById("res-total").textContent = bill.total.toFixed(2);

    document.getElementById("result").style.display = "block";

    console.log("Calculation completed.");
    console.log("Bill generated for:", bill.customerName);
    console.log("Total Amount:", bill.total);
}