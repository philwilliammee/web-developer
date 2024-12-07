# JavaScript Notebook Editor

This project is a notebook-style web-based editor for writing, executing, and sharing JavaScript code. It allows users to:
1. Write and edit JavaScript code in individual "cells."
2. Execute code with shared context across all cells.
3. Generate code snippets via a bot.
4. Capture and display console outputs within each cell.

---

## **Features**
1. **Dynamic Cells**:
   - Each cell acts as an independent code editor with execution and output display capabilities.
   - Supports addition, deletion, and execution of cells.

2. **Code Generation**:
   - Uses a prompt-based `CodeBot` to generate code snippets dynamically.

3. **Shared Context**:
   - Cells share a common execution context, allowing code in one cell to access variables and functions defined in another.

4. **Console Output Capture**:
   - Captures `console.log`, `console.error`, and other console outputs during code execution and displays them in the cell output section.

---

## **Implementation Details**
### **Project Structure**
- **`cell.js`**:
  - Defines the `Cell` class, which represents an individual notebook cell. Each cell:
    - Has a code editor (`<textarea>`), a prompt input, and execution functionality.
    - Displays the output or any error from code execution.
    - Supports event listeners for execution, code generation, and deletion.
- **`code-bot.js`**:
  - Implements a mock `CodeBot` class for generating code snippets based on prompts.
- **`console-wrapper.js`**:
  - Overrides console methods (`log`, `info`, `warn`, `error`) to capture logs during code execution and restores them afterward.
- **`main.js`**:
  - Initializes the notebook by creating the main `Notebook` instance.
- **`notebook.js`**:
  - Defines the `Notebook` class to manage multiple cells.
  - Handles shared execution context and cell operations (add, delete, execute).
- **`shared-context.js`**:
  - Implements a `SharedContext` class for evaluating code in a shared environment.
  - Updates context variables dynamically after code execution.

---

## **Significant Data Structures**

### **1. Cell**
Represents a single code cell in the notebook.

```typescript
interface Cell {
  id: number;                      // Unique identifier for the cell.
  notebook: Notebook;              // Reference to the parent notebook instance.
  element: HTMLDivElement;         // DOM element representing the cell.
  codeEditor: HTMLTextAreaElement; // Textarea for JavaScript code input.
  outputElement: HTMLElement;      // Output display section.
  promptInput: HTMLInputElement;   // Input for prompts to the code bot.
}
```

### **2. Notebook**
Manages all cells in the editor.
```typescript
interface Notebook {
  container: HTMLElement;          // DOM container for the notebook.
  cells: Map<number, Cell>;        // Collection of cells mapped by ID.
  nextId: number;                  // ID to be assigned to the next cell.
  sharedContext: SharedContext;    // Shared context for executing cell code.
}

### **3. SharedContext**
interface SharedContext {
  context: Record<string, any>;    // Key-value storage for shared variables and functions.

  evaluate(code: string): any;     // Executes a string of JavaScript code in the shared context.
}

```

example prompts:

Solve and chart the equation: x² + 5x - 6 = 0

graph the equation as a function, show the values where x = 0.

generate an example "function" chart with a height of 400.


An airplane accelerates down a runway at 3.20 m/s2 for 32.8 s until is finally lifts off the ground. Determine the distance traveled before takeoff.
- Answer 1720

With what speed in miles/hr (1 m/s = 2.23 mi/hr) must an object be thrown to reach a height of 91.5 m (equivalent to one football field)? Assume negligible air resistance.
- Answer: vi = 94.4 mi/hr

Initial velocity needed: 42.37 m/s
This is equivalent to 94.49 miles per hour

A surveyor wants to know the height of a skyscraper. He places his inclinometer on a tripod  1 m 1m from the ground. At a distance of  50 m 50m from the skyscraper, he records an angle of elevation of  8 2 ∘ 82  ∘  .  What is the height of the skyscraper? Give your answer to one decimal place.
- 356.8m


 A builder is constructing a roof. The wood he is using for the sloped section of the roof is 4m long and the peak of the roof needs to be 2m high. What angle should the piece of wood make with the base of the roof?
 - The wood should make an angle of 30° with the base of the roof.


generate a function that calculates the fibonacci sequence 1 tp 1000 and chart it.
