// Referencias a elementos del DOM
// ==============================
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
// Indica si se detectó una entrada inválida (por ejemplo, notación científica)
let isError = false;
// ==============================
// Funciones de validación
// ==============================
// Elimina los signos + y - y los espacios de un texto
function cleanInputString(str) {
 const regex = /[+-\s]/g;
 return str.replace(regex, '');
}
// Detecta notación científica como 1e3. Devuelve un array si la encuentra, o null si no.
function isInvalidInput(str) {
 const regex = /\d+e\d+/i;
 return str.match(regex);
}
// ==============================
// Agregar entradas al formulario
// ==============================
function addEntry() {
 const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
 const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
 const HTMLString = `
 <label for="${entryDropdown.value}-${entryNumber}-name">
 Entrada ${entryNumber} Nombre
 </label>
 <input
 type="text"
 id="${entryDropdown.value}-${entryNumber}-name"
 placeholder="Nombre"
 />
 <label for="${entryDropdown.value}-${entryNumber}-calories">
 Entrada ${entryNumber} Calorías
 </label>
 <input
 type="number"
 min="0"
 id="${entryDropdown.value}-${entryNumber}-calories"
 placeholder="Calorías"
 />`;
 targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// ==============================
// Sumar las calorías de una lista de inputs
// ==============================
function getCaloriesFromInputs(list) {
 let calories = 0;
 for (const item of list) {
 const currVal = cleanInputString(item.value);
 const invalidInputMatch = isInvalidInput(currVal);
 if (invalidInputMatch) {
 alert(`Entrada inválida: ${invalidInputMatch[0]}`);
 isError = true;
 return null;
 }
 calories += Number(currVal);
 }
 return calories;
}
// ==============================
// Calcular las calorías restantes y mostrar el resultado
// ==============================
function calculateCalories(e) {
 e.preventDefault();
 isError = false;
 const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
 const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
 const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
 const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
 const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");
 const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
 const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
 const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
 const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
 const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
 const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
 if (isError) {
 return;
 }
 const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
 const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
 // Estas dos palabras en inglés son también nombres de clase CSS (surplus / deficit)
 const surplusOrDeficit = remainingCalories < 0 ? 'surplus' : 'deficit';
 const resultLabel = surplusOrDeficit === 'surplus' ? 'superávit' : 'déficit';

  output.innerHTML = `
 <span class="${surplusOrDeficit}">${Math.abs(remainingCalories)} calorías de
${resultLabel}</span>
 <hr>
 <p>${budgetCalories} calorías presupuestadas</p>
 <p>${consumedCalories} calorías consumidas</p>
 <p>${exerciseCalories} calorías quemadas</p>
 `;
 output.classList.remove('hide');
}
// ==============================
// Limpiar el formulario
// ==============================
function clearForm() {
 const inputContainers = Array.from(document.querySelectorAll('.input-container'));
 for (const container of inputContainers) {
 container.innerHTML = '';
 }
 budgetNumberInput.value = '';
 output.innerText = '';
 output.classList.add('hide');
}
// ==============================
// Eventos
// ==============================
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
