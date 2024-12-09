# AI Web Design Assistant

This project is a notebook-style web-based editor designed for generating, editing, and visualizing HTML, CSS, and JavaScript content dynamically. Powered by an AI assistant, it enables users to:
1. Write and edit web design code (HTML, CSS, and JavaScript) in a Monaco Editor.
2. Execute code and visualize outputs in an isolated iframe.
3. Generate web design snippets dynamically using AI prompts.
4. Display user and assistant interactions in a chat context.

---

## **Features**
1. **Dynamic Code Generation**:
   - Leverages the `WebDesignAssistant` AI bot to generate code snippets based on user-provided prompts.

2. **Real-Time Execution**:
   - Executes code in the Monaco Editor and renders the result in an iframe.
   - Captures logs and errors during execution.

3. **Interactive Chat Context**:
   - Tracks user questions and AI responses in a conversational format.

---

## **Implementation Details**
### **Project Structure**
- **`web-design-assistant.ts`**:
  - Manages the editor, chat context, and iframe rendering.
  - Includes methods for:
    - Handling user prompts.
    - Generating web design code via the AI assistant.
    - Executing and rendering code dynamically.
- **`design-assistant-bot.ts`**:
  - Implements AI-powered code generation for web design snippets based on prompts.
- **`console-wrapper.ts`**:
  - Captures `console.log`, `console.error`, and other console outputs during code execution and displays them in the chat context.
- **`components/MonacoEditor.ts`**:
  - Integrates the Monaco Editor for real-time code editing.

---

## **Significant Classes**

### **1. WebDesignAssistant**
Manages the entire application, consolidating the notebook, editor, and execution logic.

```typescript
class WebDesignAssistant {
  private codeEditor: MonacoEditor | null;
  private chatContextElement: HTMLElement | null;
  private outputElement: HTMLElement | null;

  constructor(containerId: string);

  generateCode(prompt: string): void;
  executeCode(): void;
  appendToChatContext(role: "user" | "assistant", message: string): void;
}
```

### **2. ConsoleWrapper**
Captures console logs and errors during code execution.

```typescript
class ConsoleWrapper {
  capture(): void;
  getLogs(): string;
  restore(): void;
}
```

---

## **Example Prompts**
### Web Design Prompts:
- **"Make a simple example page."**
  - Generates a basic HTML structure with linked CSS and JavaScript.
- **"Create a contact form with name, email, and message fields."**
  - Outputs a styled HTML form with appropriate fields and a submit button.

### JavaScript and Visualization Prompts:
- **"Solve and chart the equation: x² + 5x - 6 = 0."**
  - Generates a script to solve the equation and visualize it using a chart library.
- **"Generate a function that calculates the Fibonacci sequence from 1 to 1000 and chart it."**
  - Outputs a script that calculates and charts the Fibonacci sequence.

### Physics/Math Problems:
- **"An airplane accelerates down a runway at 3.20 m/s² for 32.8 s. Determine the distance traveled before takeoff."**
  - Outputs JavaScript code to calculate and display the result.
- **"A builder is constructing a roof. The wood he is using is 4m long, and the peak of the roof needs to be 2m high. What angle should the piece of wood make with the base of the roof?"**
  - Generates code to calculate and display the result dynamically.

---

## **How to Use**
1. **Start the Development Server**:
   - Run the following commands:
     ```bash
     npm install
     npm run dev
     ```

2. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`.

3. **Generate Code**:
   - Use the chat panel to input prompts.
   - View the generated code in the Monaco Editor.

4. **Execute Code**:
   - Modify the generated code if needed.
   - Click the `Execute` button to render the output.

---

## **Example Outputs**
### 1. Simple Web Page:
**Prompt**: *"Make a simple example page."*

```html
<html>
  <head>
    <title>Simple Example</title>
    <style>
      .container {
        text-align: center;
        margin-top: 50px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to My Page</h1>
      <button onclick="alert('Hello!')">Click Me</button>
    </div>
  </body>
</html>
```

```javascript
console.log('Web Page Generated Successfully!');
```

---
Use this data: Application Name: 2022GradWebSurvey.fmp12  Application Identifier: 2022GradWebSurvey.fmp12  Application Description: Post-grad survey (Web survey db)  Application URL:  Test URL:  Development URL:  Retired Date:  Has Integrations: No  In Scope Of SCL Audit: No  SOC Required: No  PCI Compliance: No  HIPAA Cornell Health Compliance: No  Contains High Risk Data: No  Contains Regulated Data: No  Athletics Compliance: No  Is SSIT Developed: No  Owner: Alumni Affairs & Development  SSIT Service Manager: Tony Salerno ( as22 )  Application Admins:  Daniel Longaker (dwl24) Emily Nestor Truckenbrod (ejn27) Application Business Analysis  Steven Kuhns (sk2784) Ben Heintz (bah235) Application Developers:  Lisa Jensen (lcp4) Application Owner Contacts:  Lisa Jensen (lcp4) to be shown a admin details page. Use modern design think Google, Nike, or Apple influenced styles. Display all information in a modern well thought out interface.


## Bouncing balls
Create an interactive physics sandbox with bouncing balls that includes gravity, elasticity, and air resistance controls. Include features like adding balls on click, toggling gravity, and displaying FPS.

## Tetris

## Snake Game



## Robot arm
Create a 4-DOF (Degrees of Freedom) robotic arm simulator with interactive controls for base rotation, shoulder, elbow, and wrist joints. Show real-time end effector position coordinates and visualize the arm movement in 2D space.

Create a 4-DOF (Degrees of Freedom) robotic arm simulator with interactive X,Y,Z endpoint controls. Use Inverse Kinematics to calculate the base rotation, shoulder, elbow, and wrist joints. Show real-time end effector position coordinates and visualize the arm movement in 3D space.

 ## For the Double Slit Experiment:

 Create an interactive quantum mechanics simulator showing the double-slit experiment. Include controls for wavelength, slit separation, and the ability to switch between single and double slits. Display the resulting interference pattern

## More

Show me something interesting with electronics.

A responsive bar chart created using Chart.js showing sample data with different colors for each bar and a y-axis starting at zero.

A rotating 3D green cube rendered with Three.js, featuring directional lighting and responsive window resizing.

A modern user profile card with avatar, stats, bio, and an interactive follow button. Features a gradient header, responsive design, and hover effects.

create a snake game.

A complete Tetris game featuring score tracking, levels, next piece preview, and both keyboard and touch controls. The error has been fixed by properly defining the nextPiece canvas element with width and height attributes.

A sophisticated, interactive chart system using Chart.js with multiple features including: dynamic chart type switching (line, bar, radar, scatter), multiple color schemes, animated data updates, custom legend, ability to add/remove datasets, and responsive design. The Chart.js library is now properly included via CDN and the code is wrapped in a window load event listener.

# @todo handle parsing errors with retries.

# catch console errors show in chat and ask if send to bot

# truncate long outputs
