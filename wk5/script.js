const output = document.getElementById('output');

function appendSection(title, content) {
    const section = document.createElement('div');
    section.className = 'section';
    section.innerHTML = `<h2>${title}</h2><pre>${content}</pre>`;
    output.appendChild(section);
}

const numbers = [15, 42, 8, 99, 23, 4];
const minNum = Math.min(...numbers);
const maxNum = Math.max(...numbers);

appendSection("1. Array of Numbers (Min/Max)", 
`Array: [${numbers.join(', ')}]
Min Value: ${minNum}
Max Value: ${maxNum}`);

const students = [
    { name: "Alice", score: 85 },
    { name: "Bob", score: 92 },
    { name: "Charlie", score: 78 },
    { name: "David", score: 88 }
];

const maxStudent = students.reduce((max, student) => student.score > max.score ? student : max);
const minStudent = students.reduce((min, student) => student.score < min.score ? student : min);

appendSection("2. Array of Objects (Min/Max based on score)", 
`Array of Objects: 
${JSON.stringify(students, null, 2)}

Student with Max Score: ${JSON.stringify(maxStudent)}
Student with Min Score: ${JSON.stringify(minStudent)}`);

let fruits = ["Apple", "Banana", "Cherry"];
let steps = `Initial Array: [${fruits.join(', ')}]\n\n`;

fruits.push("Mango");
steps += `push("Mango")     => Adds to end:      [${fruits.join(', ')}]\n`;

fruits.pop();
steps += `pop()             => Removes from end: [${fruits.join(', ')}]\n`;

fruits.unshift("Strawberry");
steps += `unshift("Strawberry") => Adds to start: [${fruits.join(', ')}]\n`;

fruits.shift();
steps += `shift()           => Removes from start:[${fruits.join(', ')}]\n`;

fruits.splice(1, 1, "Orange"); 
steps += `splice(1, 1, "Orange") => Replaces index 1: [${fruits.join(', ')}]\n`;

const slicedFruits = fruits.slice(0, 2);
steps += `\nslice(0, 2)       => Extracts index 0,1: [${slicedFruits.join(', ')}]
Original Array remains unchanged: [${fruits.join(', ')}]`;

appendSection("3. Array Manipulation Methods", steps);

const nums = [1, 2, 3, 4, 5];
let methodsOutput = `Initial Array: [${nums.join(', ')}]\n\n`;

const doubled = nums.map(n => n * 2);
methodsOutput += `map (n * 2):      [${doubled.join(', ')}]\n`;

const evens = nums.filter(n => n % 2 === 0);
methodsOutput += `filter (even num):[${evens.join(', ')}]\n`;

const sum = nums.reduce((total, n) => total + n, 0);
methodsOutput += `reduce (sum all): ${sum}\n`;

let forEachResult = "";
nums.forEach(n => {
    forEachResult += `[${n}] `;
});
methodsOutput += `forEach:          ${forEachResult}`;

appendSection("4. Iteration Methods (map, filter, reduce, forEach)", methodsOutput);