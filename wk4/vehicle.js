function validateVehicleReg() {
    const input = document.getElementById("vehicleInput").value;
    const resultElement = document.getElementById("resultMessage");

    try {
        if (!input) {
            throw new Error("Registration number should not be empty.");
        }

        if (input.length !== 10) {
            throw new Error("Length should be exactly 10 characters.");
        }

        const stateCode = input.substring(0, 2);
        if (!/^[A-Z]{2}$/.test(stateCode)) {
            throw new Error("First two characters must be uppercase alphabets (State Code).");
        }

        const districtCode = input.substring(2, 4);
        if (!/^\d{2}$/.test(districtCode)) {
            throw new Error("Next two characters must be digits (District Code).");
        }

        const series = input.substring(4, 6);
        if (!/^[A-Z]{2}$/.test(series)) {
            throw new Error("Next two characters must be uppercase alphabets (Series).");
        }

        const vehicleNumber = input.substring(6, 10);
        if (!/^\d{4}$/.test(vehicleNumber)) {
            throw new Error("Last four characters must be digits (Vehicle Number).");
        }

        resultElement.textContent = "Valid: Registration number is correct.";
        resultElement.className = "success";
    } catch (err) {
        resultElement.textContent = "Invalid: " + err.message;
        resultElement.className = "error";
    }
}
