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

## **How to Use**

1. **Copy the example.env file to .env**:
   - Run the following command:

     ```bash
     cp example.env .env
     ```

2. **Update the Environment Variables**

3. **Start the Development Server**:
   - Run the following commands:

     ```bash
     npm install
     npm run dev
     ```

4. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`.

5. **Generate Code**:
   - Use the chat panel to input prompts.
   - View the generated code in the Monaco Editor.

6. **Execute Code**:
   - Modify the generated code if needed.
   - Click the `Execute` button to render the output.

---

### **Example Outputs**

#### 1. Simple Web Page

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


## Example Prompts

### Bouncing balls

Create an interactive physics sandbox with bouncing balls that includes gravity, elasticity, and air resistance controls. Include features like adding balls on click, toggling gravity, and displaying FPS.

### Robot arm

Create a 4-DOF (Degrees of Freedom) robotic arm simulator with interactive controls for base rotation, shoulder, elbow, and wrist joints. Show real-time end effector position coordinates and visualize the arm movement in 2D space.

Create a 4-DOF (Degrees of Freedom) robotic arm simulator with interactive X,Y,Z endpoint controls. Use Inverse Kinematics to calculate the base rotation, shoulder, elbow, and wrist joints. Show real-time end effector position coordinates and visualize the arm movement in 3D space. The base should rotate in the x-y plane and have a length of zero it should only be used to rotate the arm.

 ### Double Slit Experiment

 Create an interactive quantum mechanics simulator showing the double-slit experiment. Include controls for wavelength, slit separation, and the ability to switch between single and double slits. Display the resulting interference pattern

## More

Generate: something interesting with electronics.

Generate: a responsive bar chart created using Chart.js showing sample data with different colors for each bar and a y-axis starting at zero.

Generate: a rotating 3D textured cube rendered with Three.js, featuring ambient lighting and responsive window resizing.

Generate: a modern user profile card with avatar, stats, bio, and an interactive follow button. Features a gradient header, responsive design, and hover effects.

Generate: the iconic snake game.

Generate: a complete Tetris game featuring score tracking, levels, next piece preview, with keyboard controls.

A sophisticated, interactive chart system using Chart.js with multiple features including: dynamic chart type switching (line, bar, radar, scatter), multiple color schemes, animated data updates, custom legend, ability to add/remove datasets, and responsive design.

A feature-rich sketch board interface with color picker, brush size control, eraser, clear canvas, and save functionality. Supports both mouse and touch inputs, with a responsive canvas and smooth drawing experience.

# @todo handle parsing errors with retries.

# catch console errors show in chat and ask if send to bot

# truncate long outputs


## Notes

move expiremnets into production.
Late Januarry cicking off.
