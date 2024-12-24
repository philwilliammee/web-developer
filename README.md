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

handles parsing errors with retries.

# catch console errors show in chat and ask if send to bot

# truncate long outputs

## Notes


generate an invalid json response to test our auto error retry mechanism

need to send full chatcontext to the web design assistant

data loading


Here are a few good test prompts that would showcase different aspects of the data and different visualization capabilities:

Interactive Dashboard Prompt:
"Create an interactive dashboard showing sales performance across all dimensions. Include:
1. A line chart showing daily sales trends
2. A pie chart showing sales distribution by region
3. A bar chart comparing product categories
4. A gauge chart showing average customer satisfaction
Make it interactive so users can hover for more details."

Sales Analysis Prompt:
"Generate a sales analysis visualization that shows the relationship between customer satisfaction and sales amount. Include:
1. A scatter plot with sales_amount vs customer_satisfaction
2. Color points by product_category
3. Size the points by profit_margin
4. Add tooltips showing product details on hover"

Regional Performance Prompt:
"Create a regional performance dashboard that shows:
1. A map or grid of regions
2. Color-code regions by total sales
3. Show customer satisfaction averages
4. Include small sparklines for each region's daily sales trend
Make it visually appealing with a clean, modern design."

Customer Insights Prompt:
"Visualize customer behavior patterns:
1. Group data by customer_type (New, Returning, Loyal)
2. Show average purchase amounts
3. Compare satisfaction scores
4. Include promotion effectiveness
Use animations for transitions and make it interactive."

My recommendation would be to start with this comprehensive prompt:

"Create an interactive sales dashboard with the following features:
1. A main chart showing daily sales trends with toggles for different product categories
2. A donut chart showing sales distribution by region
3. Key metrics displayed as cards (total sales, avg satisfaction, total units)
4. A bar chart comparing performance by customer type
Add tooltips, hover effects, and make it responsive. Use a professional color scheme and ensure all numbers are properly formatted (e.g., sales as currency)."

```csv
date,region,product_category,product_name,sales_amount,units_sold,customer_satisfaction,in_stock,profit_margin,customer_age,customer_type,promotion_active
2024-01-01,North,Electronics,Smart Watch Pro,299.99,12,4.8,true,0.35,28,New,false
2024-01-01,South,Electronics,Wireless Earbuds,159.99,25,4.6,true,0.45,34,Returning,true
2024-01-01,East,Home,Smart Speaker,129.99,18,4.7,true,0.38,45,Loyal,false
2024-01-02,West,Electronics,4K Camera,899.99,5,4.9,false,0.28,39,New,false
2024-01-02,North,Accessories,Phone Case,29.99,50,4.2,true,0.65,22,Returning,true
2024-01-02,South,Home,Robot Vacuum,499.99,8,4.5,true,0.32,51,Loyal,false
2024-01-03,East,Electronics,Gaming Console,499.99,15,4.8,true,0.25,19,New,true
2024-01-03,West,Accessories,Charging Cable,19.99,75,4.0,true,0.70,29,Returning,false
2024-01-03,North,Home,Smart Bulb Set,79.99,30,4.6,true,0.48,42,Loyal,true
2024-01-04,South,Electronics,Tablet Pro,699.99,10,4.7,false,0.30,36,New,false
2024-01-04,East,Accessories,Laptop Bag,49.99,22,4.3,true,0.55,31,Returning,true
2024-01-04,West,Home,Security Camera,199.99,14,4.4,true,0.42,47,Loyal,false
2024-01-05,North,Electronics,Smartwatch Basic,199.99,28,4.5,true,0.40,25,New,true
2024-01-05,South,Accessories,Screen Protector,15.99,100,4.1,true,0.75,33,Returning,false
2024-01-05,East,Home,Smart Thermostat,249.99,12,4.8,false,0.35,44,Loyal,true
2024-01-06,West,Electronics,Bluetooth Speaker,89.99,35,4.6,true,0.50,27,New,true
2024-01-06,North,Home,Video Doorbell,189.99,20,4.7,true,0.38,49,Returning,false
2024-01-06,South,Electronics,Fitness Tracker,129.99,40,4.4,true,0.45,31,Loyal,true
2024-01-07,East,Accessories,Power Bank,39.99,60,4.3,true,0.60,24,New,false
2024-01-07,West,Home,Smart Lock,159.99,15,4.8,false,0.33,46,Returning,true
```

### RPG game prompt

Generate an interactive RPG style game where I can do things like woodcutting and mining. There should be an experience and leveling system. It should be a 2D game where I can move around and interact with trees and rocks. Make it look super visually appealing and beautiful. I should be able to use WASD to move around and E to interact with things. The game should be a grid on a black background. Make sure I can see my current levels and experience. Use emojis for me, the rocks, and the trees inside the grid.

@todo:
better file names
csv data add that as an extra message on the user not inline.
reduce the assistant response data
css and js files are not properly syntax highlighted and autoformated in the editor.
