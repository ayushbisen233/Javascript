document.addEventListener('DOMContentLoaded', () => {
    const inputTextArea = document.getElementById('inputText');
    const outReverse = document.getElementById('outReverse');
    const outVowels = document.getElementById('outVowels');

    // Helper to escape HTML
    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    // 1. Program to Reverse a String
    document.getElementById('btnReverseString').addEventListener('click', () => {
        const text = inputTextArea.value;
        if (!text) {
            outReverse.innerHTML = "<p style='color: red;'>Please enter some text.</p>";
            return;
        }
        
        // Reversing string
        const reversed = text.split('').reverse().join('');
        outReverse.innerHTML = `<p><strong>Reversed String:</strong> <br>${escapeHtml(reversed)}</p>`;
    });

    // 2. WAP to count number of vowels in a paragraph
    document.getElementById('btnCountVowels').addEventListener('click', () => {
        const text = inputTextArea.value;
        if (!text) {
            outVowels.innerHTML = "<p style='color: red;'>Please enter a paragraph.</p>";
            return;
        }

        let totalVowels = 0;
        const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
        let highlightedText = "";

        for (let char of text) {
            let lower = char.toLowerCase();
            if (['a', 'e', 'i', 'o', 'u'].includes(lower)) {
                counts[lower]++;
                totalVowels++;
                highlightedText += `<span class="highlight">${escapeHtml(char)}</span>`;
            } else {
                highlightedText += escapeHtml(char);
            }
        }

        outVowels.innerHTML = `
            <p><strong>Total Vowels Found:</strong> ${totalVowels}</p>
            <ul>
                <li>A: ${counts.a}</li>
                <li>E: ${counts.e}</li>
                <li>I: ${counts.i}</li>
                <li>O: ${counts.o}</li>
                <li>U: ${counts.u}</li>
            </ul>
            <p><strong>Paragraph with vowels highlighted:</strong><br> ${highlightedText}</p>
        `;
    });
});
