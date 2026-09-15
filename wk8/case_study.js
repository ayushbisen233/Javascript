document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gymForm');
    const resultContainer = document.getElementById('resultContainer');
    const resultData = document.getElementById('resultData');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page refresh

        // Reset error messages
        document.querySelectorAll('.error-msg').forEach(msg => msg.style.display = 'none');

        let isValid = true;

        // Validate Name
        const nameInput = document.getElementById('name').value.trim();
        if (nameInput === '') {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }

        // Validate Sex
        const sexRadios = document.querySelectorAll('input[name="sex"]');
        let selectedSex = null;
        sexRadios.forEach(radio => {
            if (radio.checked) selectedSex = radio.value;
        });
        if (!selectedSex) {
            document.getElementById('sexError').style.display = 'block';
            isValid = false;
        }

        // Validate Eye Color
        const eyeColorSelect = document.getElementById('eyeColor').value;
        if (eyeColorSelect === '') {
            document.getElementById('eyeColorError').style.display = 'block';
            isValid = false;
        }

        // Validate Address
        const addressInput = document.getElementById('address').value.trim();
        if (addressInput === '') {
            document.getElementById('addressError').style.display = 'block';
            isValid = false;
        }

        // Get Checkboxes (Not required, just capturing data)
        const attributesCheckboxes = document.querySelectorAll('input[name="attributes"]:checked');
        const selectedAttributes = [];
        attributesCheckboxes.forEach(cb => selectedAttributes.push(cb.value));

        // Validate Athletic Ability
        const abilityInput = document.getElementById('ability').value.trim();
        if (abilityInput === '') {
            document.getElementById('abilityError').style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Display Data
            let resultHtml = `<p><strong>Name:</strong> ${nameInput}</p>`;
            resultHtml += `<p><strong>Sex:</strong> ${selectedSex}</p>`;
            resultHtml += `<p><strong>Eye Color:</strong> ${eyeColorSelect}</p>`;
            resultHtml += `<p><strong>Address:</strong> ${addressInput}</p>`;
            
            if (selectedAttributes.length > 0) {
                resultHtml += `<p><strong>Attributes:</strong> ${selectedAttributes.join(', ')}</p>`;
            } else {
                resultHtml += `<p><strong>Attributes:</strong> None</p>`;
            }

            resultHtml += `<p><strong>Athletic Ability:</strong> ${abilityInput}</p>`;

            resultData.innerHTML = resultHtml;
            resultContainer.style.display = 'block';

            // Optional: show an alert as well
            alert("Form successfully validated and submitted!");
            
            // Clear the form
            form.reset();
        } else {
            // Hide result container if validation fails
            resultContainer.style.display = 'none';
        }
    });

    // Add real-time validation clearing on input/change
    document.getElementById('name').addEventListener('input', function() {
        if(this.value.trim() !== '') document.getElementById('nameError').style.display = 'none';
    });
    document.getElementById('address').addEventListener('input', function() {
        if(this.value.trim() !== '') document.getElementById('addressError').style.display = 'none';
    });
    document.getElementById('ability').addEventListener('input', function() {
        if(this.value.trim() !== '') document.getElementById('abilityError').style.display = 'none';
    });
    document.querySelectorAll('input[name="sex"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('sexError').style.display = 'none';
        });
    });
    document.getElementById('eyeColor').addEventListener('change', function() {
        if(this.value !== '') document.getElementById('eyeColorError').style.display = 'none';
    });
});
