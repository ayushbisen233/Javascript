document.addEventListener('DOMContentLoaded', () => {
    const userParaInput = document.getElementById('userPara');
    
    // Outputs
    const out1 = document.getElementById('out-tool-1');
    const out2 = document.getElementById('out-tool-2');
    const out3 = document.getElementById('out-tool-3');
    const out4 = document.getElementById('out-tool-4');
    const out5 = document.getElementById('out-tool-5');
    const out6 = document.getElementById('out-tool-6');
    const out7 = document.getElementById('out-tool-7');

    let initialParagraph = "";

    // Save initial paragraph on submit button click
    document.getElementById('btnSubmitPara').addEventListener('click', () => {
        initialParagraph = userParaInput.value;
        alert("Paragraph submitted!");
    });

    // Helper: Escape HTML
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

    // 1. Original Paragraph
    document.getElementById('btnShowOriginal').addEventListener('click', () => {
        if (initialParagraph) {
            out1.innerHTML = `<p>${escapeHtml(initialParagraph)}</p>`;
        } else {
            out1.innerHTML = "<p>No original text submitted yet.</p>";
        }
    });

    // 2. Vowels
    document.getElementById('btnFindVowels').addEventListener('click', () => {
        const text = userParaInput.value;
        if (!text) {
            out2.innerHTML = "<p>Please enter text.</p>";
            return;
        }

        let total = 0;
        const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
        let highlighted = "";

        for (let char of text) {
            let lower = char.toLowerCase();
            if (['a', 'e', 'i', 'o', 'u'].includes(lower)) {
                counts[lower]++;
                total++;
                highlighted += `<span class="highlight">${escapeHtml(char)}</span>`;
            } else {
                highlighted += escapeHtml(char);
            }
        }

        out2.innerHTML = `
            <p>Total Vowels: ${total}</p>
            <p>A: ${counts.a}, E: ${counts.e}, I: ${counts.i}, O: ${counts.o}, U: ${counts.u}</p>
            <p>${highlighted}</p>
        `;
    });

    // 3. Replace Word
    document.getElementById('btnReplaceWord').addEventListener('click', () => {
        const text = userParaInput.value;
        const find = document.getElementById('findWordInput').value;
        const replace = document.getElementById('replaceWordInput').value;

        if (!text || !find) {
            out3.innerHTML = "<p>Please enter paragraph and word to find.</p>";
            return;
        }

        const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const matches = text.match(regex);
        const count = matches ? matches.length : 0;
        const newText = text.replace(regex, `<span class="highlight">${escapeHtml(replace)}</span>`);

        out3.innerHTML = `
            <p>Replacements made: ${count}</p>
            <p>${newText}</p>
        `;
    });

    // 4. Position of Word
    document.getElementById('btnFindPosition').addEventListener('click', () => {
        const text = userParaInput.value;
        const word = document.getElementById('posWordInput').value;

        if (!text || !word) {
            out4.innerHTML = "<p>Please enter paragraph and search word.</p>";
            return;
        }

        let pos = text.toLowerCase().indexOf(word.toLowerCase());
        const positions = [];
        while (pos !== -1) {
            positions.push(pos);
            pos = text.toLowerCase().indexOf(word.toLowerCase(), pos + 1);
        }

        out4.innerHTML = `
            <p>Positions found at index: ${positions.length > 0 ? positions.join(', ') : 'None'}</p>
        `;
    });

    // 5. Regex Email Validation
    document.getElementById('btnValidateEmail').addEventListener('click', () => {
        const email = document.getElementById('emailValInput').value;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (regex.test(email)) {
            out5.innerHTML = `<p style="color: green;">Valid email address.</p>`;
        } else {
            out5.innerHTML = `<p style="color: red;">Invalid email address.</p>`;
        }
    });

    // 6. Regex Extract Emails
    document.getElementById('btnExtractEmails').addEventListener('click', () => {
        const text = userParaInput.value;
        const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
        const matches = text.match(regex);

        if (matches) {
            const unique = [...new Set(matches)];
            out6.innerHTML = `<p>Found: ${unique.join(', ')}</p>`;
        } else {
            out6.innerHTML = `<p>No emails found.</p>`;
        }
    });

    // 7. Reverse Paragraph
    document.getElementById('btnReverseChars').addEventListener('click', () => {
        const text = userParaInput.value;
        out7.innerHTML = `<p>${escapeHtml(text.split('').reverse().join(''))}</p>`;
    });

    document.getElementById('btnReverseWords').addEventListener('click', () => {
        const text = userParaInput.value;
        out7.innerHTML = `<p>${escapeHtml(text.split(/\\s+/).reverse().join(' '))}</p>`;
    });
});
