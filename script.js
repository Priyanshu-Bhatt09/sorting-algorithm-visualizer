// DOM Elements
const newArrayBtn = document.getElementById("new-array-btn");
const sortBtn = document.getElementById("sort-btn");
const algoSelect = document.getElementById("algo-select");
const sizeSlider = document.getElementById("size-slider");
const speedSlider = document.getElementById("speed-slider");
const barContainer = document.getElementById("bar-container");
const caseSelect = document.getElementById("case-select"); // NEW
const caseInfo = document.getElementById("case-info");     // NEW

// State
let array = [];
let isSorting = false;
let speed = 50;
let arraySize = 50;
let caseType = "average"; // default case type

// --- Colors ---
const PRIMARY_COLOR = '#95a5a6'; // Default bar color
const COMPARE_COLOR = '#e74c3c'; // Color for bars being compared
const SWAP_COLOR = '#f1c40f';    // Color for bars being swapped
const SORTED_COLOR = '#2ecc71';  // Color for sorted bars

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
    arraySize = parseInt(sizeSlider.value);
    speed = 101 - parseInt(speedSlider.value);
    generateNewArray();
    updateCaseInfo();
});

newArrayBtn.addEventListener("click", () => !isSorting && generateNewArray());
sortBtn.addEventListener("click", () => !isSorting && array.length > 0 && startSorting());
sizeSlider.addEventListener("input", e => !isSorting && (arraySize = parseInt(e.target.value), generateNewArray()));
speedSlider.addEventListener("input", e => speed = 101 - parseInt(e.target.value));
caseSelect.addEventListener("change", e => {   // NEW
    caseType = e.target.value;
    generateNewArray();
    updateCaseInfo();
});
window.addEventListener('resize', () => !isSorting && renderBars());

// --- Helper Functions ---
function generateNewArray() {
    if (caseType === "average") {
        array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 96) + 5);
    } else if (caseType === "best") {
        // Already sorted (ascending)
        array = Array.from({ length: arraySize }, (_, i) => Math.floor((i / arraySize) * 96) + 5);
    } else if (caseType === "worst") {
        // Reverse sorted (descending)
        array = Array.from({ length: arraySize }, (_, i) => Math.floor(((arraySize - i) / arraySize) * 96) + 5);
    }
    renderBars();
}

function renderBars() {
    barContainer.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${array[i]}%`;
        bar.style.backgroundColor = PRIMARY_COLOR;
        barContainer.appendChild(bar);
    }
}

function updateCaseInfo() {
    const info = {
        best: "Best Case: Nearly sorted input (minimum time complexity).",
        worst: "Worst Case: Reverse sorted input (maximum time complexity).",
        average: "Average Case: Random input (typical performance)."
    };
    caseInfo.innerText = info[caseType];
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function toggleControls(state) {
    isSorting = state;
    newArrayBtn.disabled = state;
    sortBtn.disabled = state;
    sizeSlider.disabled = state;
    algoSelect.disabled = state;
    caseSelect.disabled = state;
}

// --- Main Sorting Logic ---
async function startSorting() {
    toggleControls(true);
    const selectedAlgo = algoSelect.value;
    const bars = document.getElementsByClassName("bar");

    const algorithms = {
        bubble: bubbleSort,
        selection: selectionSort,
        insertion: insertionSort,
        shell: shellSort,
        cocktail: cocktailShakerSort,
        pancake: pancakeSort,
        radix: radixSort,
        merge: () => mergeSort(0, array.length - 1, bars),
        quick: () => quickSort(0, array.length - 1, bars),
        heap: heapSort
    };

    await algorithms[selectedAlgo](bars);

    // Final sorted animation
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = SORTED_COLOR;
    }
    
    toggleControls(false);
}

// --- Sorting Algorithms (rest same as before) ---


// --- Sorting Algorithms (Original) ---

async function bubbleSort(bars) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = COMPARE_COLOR;
            bars[j + 1].style.backgroundColor = COMPARE_COLOR;
            await delay(speed);

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}%`;
                bars[j + 1].style.height = `${array[j + 1]}%`;
            }
            await delay(speed);
            bars[j].style.backgroundColor = PRIMARY_COLOR;
            bars[j + 1].style.backgroundColor = PRIMARY_COLOR;
        }
        bars[array.length - 1 - i].style.backgroundColor = SORTED_COLOR;
    }
    bars[0].style.backgroundColor = SORTED_COLOR;
}

async function selectionSort(bars) { /* ... original code ... */ }
async function insertionSort(bars) { /* ... original code ... */ }
async function mergeSort(l, r, bars) { /* ... original code ... */ }
async function merge(l, m, r, bars) { /* ... original code ... */ }
async function quickSort(low, high, bars) { /* ... original code ... */ }
async function partition(low, high, bars) { /* ... original code ... */ }
async function heapSort(bars) { /* ... original code ... */ }
async function heapify(n, i, bars) { /* ... original code ... */ }


// --- NEW Sorting Algorithms ---

async function shellSort(bars) {
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j = i;
            
            bars[j].style.backgroundColor = COMPARE_COLOR;
            await delay(speed);

            while (j >= gap && array[j - gap] > temp) {
                bars[j].style.backgroundColor = COMPARE_COLOR;
                bars[j - gap].style.backgroundColor = SWAP_COLOR;
                await delay(speed);

                array[j] = array[j - gap];
                bars[j].style.height = `${array[j]}%`;
                
                bars[j - gap].style.backgroundColor = PRIMARY_COLOR;
                bars[j].style.backgroundColor = PRIMARY_COLOR;
                j -= gap;
            }
            array[j] = temp;
            bars[j].style.height = `${array[j]}%`;
            bars[i].style.backgroundColor = PRIMARY_COLOR;
        }
    }
}

async function cocktailShakerSort(bars) {
    let swapped = true;
    let start = 0;
    let end = array.length;

    while (swapped) {
        swapped = false;
        for (let i = start; i < end - 1; ++i) {
            bars[i].style.backgroundColor = COMPARE_COLOR;
            bars[i + 1].style.backgroundColor = COMPARE_COLOR;
            await delay(speed);
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                bars[i].style.height = `${array[i]}%`;
                bars[i+1].style.height = `${array[i+1]}%`;
                swapped = true;
            }
            bars[i].style.backgroundColor = PRIMARY_COLOR;
            bars[i + 1].style.backgroundColor = PRIMARY_COLOR;
        }
        if (!swapped) break;
        swapped = false;
        end--;
        bars[end].style.backgroundColor = SORTED_COLOR;

        for (let i = end - 1; i >= start; --i) {
            bars[i].style.backgroundColor = COMPARE_COLOR;
            bars[i + 1].style.backgroundColor = COMPARE_COLOR;
            await delay(speed);
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                bars[i].style.height = `${array[i]}%`;
                bars[i+1].style.height = `${array[i+1]}%`;
                swapped = true;
            }
            bars[i].style.backgroundColor = PRIMARY_COLOR;
            bars[i + 1].style.backgroundColor = PRIMARY_COLOR;
        }
        start++;
        bars[start-1].style.backgroundColor = SORTED_COLOR;
    }
    for(let i=0; i<bars.length; i++) bars[i].style.backgroundColor = SORTED_COLOR;
}

async function pancakeSort(bars) {
    const flip = async (k) => {
        let l = 0;
        while(l < k) {
            bars[l].style.backgroundColor = SWAP_COLOR;
            bars[k].style.backgroundColor = SWAP_COLOR;
            [array[l], array[k]] = [array[k], array[l]];
            bars[l].style.height = `${array[l]}%`;
            bars[k].style.height = `${array[k]}%`;
            await delay(speed);
            bars[l].style.backgroundColor = PRIMARY_COLOR;
            bars[k].style.backgroundColor = PRIMARY_COLOR;
            l++;
            k--;
        }
    };

    let n = array.length;
    for (let currSize = n; currSize > 1; --currSize) {
        let maxIndex = 0;
        for (let i = 1; i < currSize; ++i) {
            bars[i].style.backgroundColor = COMPARE_COLOR;
            bars[maxIndex].style.backgroundColor = COMPARE_COLOR;
            await delay(speed);
            bars[i].style.backgroundColor = PRIMARY_COLOR;
            bars[maxIndex].style.backgroundColor = PRIMARY_COLOR;
            if (array[i] > array[maxIndex]) {
                maxIndex = i;
            }
        }
        if (maxIndex !== currSize - 1) {
            await flip(maxIndex);
            await flip(currSize - 1);
        }
        bars[currSize - 1].style.backgroundColor = SORTED_COLOR;
    }
    bars[0].style.backgroundColor = SORTED_COLOR;
}

async function radixSort(bars) {
    const getMax = () => Math.max(...array);

    const countingSort = async (exp) => {
        let output = new Array(array.length);
        let count = new Array(10).fill(0);

        for (let i = 0; i < array.length; i++) {
            const digit = Math.floor(array[i] / exp) % 10;
            count[digit]++;
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = array.length - 1; i >= 0; i--) {
            bars[i].style.backgroundColor = COMPARE_COLOR;
            await delay(speed);
            const digit = Math.floor(array[i] / exp) % 10;
            output[count[digit] - 1] = array[i];
            count[digit]--;
            bars[i].style.backgroundColor = PRIMARY_COLOR;
        }

        for (let i = 0; i < array.length; i++) {
            array[i] = output[i];
            bars[i].style.height = `${array[i]}%`;
            bars[i].style.backgroundColor = SWAP_COLOR;
        }
        await delay(speed * 2);
        for(let bar of bars) bar.style.backgroundColor = PRIMARY_COLOR;
    };

    const m = getMax();
    for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
        await countingSort(exp);
    }
}

// NOTE: To save space, the original sorting algorithms are collapsed.
// You should copy the full functions from the previous answer into this file where the `/* ... original code ... */` comments are.
// For convenience, here is the bubble sort again.
async function selectionSort(bars) {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        bars[minIndex].style.backgroundColor = SWAP_COLOR;
        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = COMPARE_COLOR;
            await delay(speed);
            if (array[j] < array[minIndex]) {
                bars[minIndex].style.backgroundColor = PRIMARY_COLOR;
                minIndex = j;
                bars[minIndex].style.backgroundColor = SWAP_COLOR;
            } else {
                 bars[j].style.backgroundColor = PRIMARY_COLOR;
            }
        }
        await delay(speed);
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        bars[i].style.height = `${array[i]}%`;
        bars[minIndex].style.height = `${array[minIndex]}%`;
        bars[minIndex].style.backgroundColor = PRIMARY_COLOR;
        bars[i].style.backgroundColor = SORTED_COLOR;
    }
    bars[array.length - 1].style.backgroundColor = SORTED_COLOR;
}

async function insertionSort(bars) {
    bars[0].style.backgroundColor = SORTED_COLOR;
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = COMPARE_COLOR;
        await delay(speed);

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}%`;
            bars[j + 1].style.backgroundColor = SWAP_COLOR;
            await delay(speed);
            bars[j + 1].style.backgroundColor = SORTED_COLOR;
            j--;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;
        bars[j + 1].style.backgroundColor = SORTED_COLOR;
        await delay(speed);
    }
}

async function mergeSort(l, r, bars) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(l, m, bars);
    await mergeSort(m + 1, r, bars);
    await merge(l, m, r, bars);
}

async function merge(l, m, r, bars) {
    const n1 = m - l + 1;
    const n2 = r - m;
    let L = array.slice(l, l + n1);
    let R = array.slice(m + 1, m + 1 + n2);
    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        bars[l + i].style.backgroundColor = COMPARE_COLOR;
        bars[m + 1 + j].style.backgroundColor = COMPARE_COLOR;
        await delay(speed);
        
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        bars[k].style.height = `${array[k]}%`;
        bars[k].style.backgroundColor = SWAP_COLOR;
        await delay(speed);
        for(let x=l; x<=r; x++) bars[x].style.backgroundColor = PRIMARY_COLOR; // Reset range color
        k++;
    }

    while (i < n1) { array[k] = L[i]; bars[k].style.height = `${array[k]}%`; i++; k++; await delay(speed); }
    while (j < n2) { array[k] = R[j]; bars[k].style.height = `${array[k]}%`; j++; k++; await delay(speed); }
}

async function quickSort(low, high, bars) {
    if (low < high) {
        let pi = await partition(low, high, bars);
        await quickSort(low, pi - 1, bars);
        await quickSort(pi + 1, high, bars);
    } else { // Color single elements when subarray is size 1
        if(low >= 0 && high >= 0 && low < bars.length && high < bars.length) {
            bars[high].style.backgroundColor = SORTED_COLOR;
        }
    }
}

async function partition(low, high, bars) {
    let pivot = array[high];
    let i = low - 1;
    bars[high].style.backgroundColor = COMPARE_COLOR;

    for (let j = low; j < high; j++) {
        bars[j].style.backgroundColor = SWAP_COLOR;
        await delay(speed);
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i]}%`;
            bars[j].style.height = `${array[j]}%`;
            await delay(speed);
        }
        bars[j].style.backgroundColor = PRIMARY_COLOR;
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}%`;
    bars[high].style.height = `${array[high]}%`;
    bars[high].style.backgroundColor = PRIMARY_COLOR;
    bars[i + 1].style.backgroundColor = SORTED_COLOR;
    await delay(speed * 2);

    return i + 1;
}

async function heapSort(bars) {
    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i, bars);

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        bars[0].style.height = `${array[0]}%`;
        bars[i].style.height = `${array[i]}%`;
        bars[i].style.backgroundColor = SORTED_COLOR;
        await delay(speed);
        await heapify(i, 0, bars);
    }
    bars[0].style.backgroundColor = SORTED_COLOR;
}

async function heapify(n, i, bars) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
        bars[l].style.backgroundColor = COMPARE_COLOR;
        bars[largest].style.backgroundColor = COMPARE_COLOR;
        await delay(speed);
        if (array[l] > array[largest]) largest = l;
        bars[l].style.backgroundColor = PRIMARY_COLOR;
        bars[i].style.backgroundColor = PRIMARY_COLOR;
    }
    if (r < n) {
        bars[r].style.backgroundColor = COMPARE_COLOR;
        bars[largest].style.backgroundColor = COMPARE_COLOR;
        await delay(speed);
        if (array[r] > array[largest]) largest = r;
        bars[r].style.backgroundColor = PRIMARY_COLOR;
        bars[i].style.backgroundColor = PRIMARY_COLOR;
    }

    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        bars[i].style.height = `${array[i]}%`;
        bars[largest].style.height = `${array[largest]}%`;
        await delay(speed);
        await heapify(n, largest, bars);
    }
}