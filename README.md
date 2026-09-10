# StreamMerge – In-Place Ordered Data Pipeline

> A lightweight JavaScript data-processing engine for efficiently combining two already-sorted data streams into a single ordered dataset.

## 📌 Project Overview

**StreamMerge** demonstrates how ordered datasets can be combined efficiently when one data container already has enough capacity to hold the final result.

Instead of creating a separate array or repeatedly shifting elements, the system processes both streams **from the end toward the beginning**. The largest remaining value is placed directly into its final position.

This makes the pipeline:

* ⚡ Fast
* 💾 Memory efficient
* 🔄 Deterministic
* 📦 Easy to integrate into data-processing workflows

---

## 🌍 Real-World Conceptual Scenario

Imagine a reporting system receiving two already-sorted datasets:

```text
Sales Stream A
[120, 240, 360]

Sales Stream B
[180, 300, 420]
```

The system needs to produce one chronological or value-ordered dataset:

```text
[120, 180, 240, 300, 360, 420]
```

The first storage area already has additional capacity:

```text
[120, 240, 360, _, _, _]
```

Rather than allocating another array, **StreamMerge** fills the available space from right to left.

This concept can represent:

* 📊 Merging sorted analytics records
* 📦 Combining inventory datasets
* 🧾 Consolidating ordered transaction data
* 🔎 Combining indexed search results
* 📈 Merging time-series data
* 🗂️ Consolidating pre-sorted records

---

## 🧠 Core Concept

The project is based on an **in-place two-pointer merge strategy**.

Three pointers are maintained:

| Pointer      | Responsibility                                       |
| ------------ | ---------------------------------------------------- |
| `leftIndex`  | Tracks the last valid element in the primary dataset |
| `rightIndex` | Tracks the last element in the incoming dataset      |
| `writeIndex` | Tracks the next position to fill                     |

The comparison happens from the **largest values toward the smallest values**.

### Why start from the end?

Because the primary dataset contains unused capacity at the end.

For example:

```text
Primary:
[1, 2, 3, 0, 0, 0]
          ↑ unused capacity

Incoming:
[2, 5, 6]
```

Writing from the beginning could overwrite useful data.

Writing from the end avoids that problem:

```text
[1, 2, 3, 0, 0, 0]

Compare 3 and 6 → write 6
Compare 3 and 5 → write 5
Compare 3 and 2 → write 3
...
```

Final result:

```text
[1, 2, 2, 3, 5, 6]
```

---

## ⚙️ How the System Works

### 1. Identify the valid data

Only the first `primaryCount` values of the primary array contain meaningful data.

```text
Primary:
[1, 2, 3, 0, 0, 0]
 └──────┘
 valid data
```

### 2. Set three pointers

```text
leftIndex  → last valid primary element
rightIndex → last incoming element
writeIndex → last available position
```

### 3. Compare from right to left

The larger value is always placed at `writeIndex`.

```text
if primary[leftIndex] > incoming[rightIndex]

    primary[writeIndex] = primary[leftIndex]

else

    primary[writeIndex] = incoming[rightIndex]
```

### 4. Move the appropriate pointer

After writing a value, move:

* the source pointer
* the destination pointer

### 5. Continue until the incoming stream is exhausted

When no incoming values remain, the primary array already contains the complete ordered dataset.

---

## 🔬 Algorithm

**Algorithm:** In-place two-pointer merge

**Data Structure:** Array

### Step-by-Step Logic

```text
Start
  │
  ▼
Point to the last valid item in primary data
  │
  ▼
Point to the last item in incoming data
  │
  ▼
Point to the final available position
  │
  ▼
Compare both current values
  │
  ├── Primary value is larger
  │       ↓
  │   Move primary value
  │
  └── Incoming value is larger/equal
          ↓
      Move incoming value
  │
  ▼
Move write position backward
  │
  ▼
Are incoming values remaining?
  │
 ┌┴───────┐
 │ Yes    │ No
 ▼        ▼
Repeat   Finish
```

---

## ✨ Key Features

* **In-place processing** – Uses the existing primary array.
* **Two-pointer architecture** – Simple and efficient traversal.
* **Backward processing** – Prevents overwriting useful data.
* **Linear performance** – Processes each relevant element at most once.
* **Stable ordering** – Produces a correctly ordered combined dataset.
* **Minimal memory usage** – No secondary result array is required.
* **Reusable design** – The merging logic can be adapted to many ordered-data workflows.

---

## 💻 Example Use Case

### Input

```javascript
const primaryData = [1, 2, 3, 0, 0, 0];
const incomingData = [2, 5, 6];

mergeSortedData(primaryData, 3, incomingData, 3);

console.log(primaryData);
```

### Output

```text
[1, 2, 2, 3, 5, 6]
```

### Another Example

```javascript
const primaryData = [10, 20, 30, 0, 0];
const incomingData = [15, 25];

mergeSortedData(primaryData, 3, incomingData, 2);

console.log(primaryData);
```

Output:

```text
[10, 15, 20, 25, 30]
```

---

## 🧩 GitHub-Ready Implementation

```javascript
/**
 * Merges two sorted datasets into the primary dataset in-place.
 *
 * The primary dataset must have enough trailing capacity
 * to hold every element from the incoming dataset.
 *
 * @param {number[]} primaryData - Destination array.
 * @param {number} primaryCount - Number of valid elements in primaryData.
 * @param {number[]} incomingData - Sorted data to merge.
 * @param {number} incomingCount - Number of elements in incomingData.
 */
function mergeSortedData(
    primaryData,
    primaryCount,
    incomingData,
    incomingCount
) {
    let leftIndex = primaryCount - 1;
    let rightIndex = incomingCount - 1;
    let writeIndex = primaryCount + incomingCount - 1;

    while (rightIndex >= 0) {
        if (
            leftIndex >= 0 &&
            primaryData[leftIndex] > incomingData[rightIndex]
        ) {
            primaryData[writeIndex] = primaryData[leftIndex];
            leftIndex--;
        } else {
            primaryData[writeIndex] = incomingData[rightIndex];
            rightIndex--;
        }

        writeIndex--;
    }
}
```

### Example

```javascript
const salesData = [120, 240, 360, 0, 0, 0];
const newSalesData = [180, 300, 420];

mergeSortedData(salesData, 3, newSalesData, 3);

console.log(salesData);
```

Output:

```text
[120, 180, 240, 300, 360, 420]
```

---

## 📐 Complexity

Let:

* `m` = number of valid elements in the primary dataset
* `n` = number of incoming elements

| Metric      | Complexity   |
| ----------- | ------------ |
| Time        | **O(m + n)** |
| Extra Space | **O(1)**     |

Every relevant element is examined at most once, while the final dataset is constructed directly inside the existing storage.

---

## 🛠️ Technologies Used

* **JavaScript (ES6+)**
* Arrays
* Two-pointer algorithm
* In-place data manipulation

---

## 📁 Project Structure

```text
StreamMerge-In-Place-Ordered-Data-Pipeline/
│
├── src/
│   └── mergeSortedData.js
│
├── examples/
│   └── basicExample.js
│
├── README.md
├── LICENSE
└── package.json
```

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/mirhamzarahman/StreamMerge-In-Place-Ordered-Data-Pipeline.git
```

### 2. Enter the project directory

```bash
cd StreamMerge-In-Place-Ordered-Data-Pipeline
```

### 3. Run the example

```bash
node examples/basicExample.js
```

### 4. Expected output

```text
[120, 180, 240, 300, 360, 420]
```

---

## 📚 Learning Outcomes

This project demonstrates practical understanding of:

* Two-pointer algorithms
* In-place array manipulation
* Ordered data processing
* Memory-efficient programming
* Pointer movement and indexing
* Avoiding unnecessary data structures
* Linear-time algorithm design
* Translating algorithmic concepts into reusable software components

---

## 🔮 Possible Future Improvements

Future versions could extend StreamMerge with:

* [ ] Generic object-based record merging
* [ ] Custom comparison functions
* [ ] Date/time-based ordering
* [ ] Descending-order support
* [ ] Duplicate-handling strategies
* [ ] TypeScript implementation
* [ ] Streaming data support
* [ ] Automated unit tests
* [ ] Performance benchmarking
* [ ] Browser-based visualization of the merge process

---

## 🎯 Design Philosophy

StreamMerge follows a simple principle:

> **Use the storage you already have, process data intelligently, and avoid unnecessary memory allocation.**

The project turns a fundamental array-processing technique into a reusable model for efficient ordered-data consolidation.

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, distribute, and build upon the project with appropriate attribution.
