<h1>AI Web Design Assistant</h1>

<p>An AI-powered web development tool that transforms natural language prompts into interactive web pages. Create visualizations, games, and complex web applications through simple text descriptions.</p>

<blockquote>
  <p><strong>Note</strong>: This is a development tool and proof-of-concept. Not intended for production use.</p>
</blockquote>

<h2>Features</h2>

<ul>
  <li>AI-powered code generation from natural language</li>
  <li>Real-time code editing with separate HTML, CSS, and JavaScript editors</li>
  <li>Data visualization support with CSV import</li>
  <li>Live preview with instant updates</li>
  <li>Pre-loaded libraries (D3.js, Chart.js, Three.js)</li>
  <li>Automatic error recovery and retry mechanisms</li>
</ul>

<h2>Quick Start</h2>

<ol>
  <li>Clone and setup environment:
    <pre><code>git clone https://github.com/philwilliammee/web-developer
cd ai-web-design-assistant
cp example.env .env</code></pre>
  </li>

  <li>Configure AWS credentials in <code>.env</code>:
    <pre><code>VITE_AWS_REGION=your-aws-region
VITE_BEDROCK_MODEL_ID=your-model-id
VITE_AWS_ACCESS_KEY=your-aws-access-key
VITE_AWS_SECRET_KEY=your-aws-secret-key</code></pre>
  </li>

  <li>Install and run:
    <pre><code>npm install
npm run dev</code></pre>
  </li>

  <li>Open <code>http://localhost:5173</code> in your browser</li>
</ol>


<h2>API Integration</h2>

<p>Currently, this project uses AWS Bedrock as its AI provider, specifically designed to work with Amazon's Large Language Models through the Bedrock API. However, the project is structured to potentially support other AI providers.</p>

<h3>Supported:</h3>
<ul>
  <li>AWS Bedrock API</li>
</ul>

<h3>Potential Future Integrations:</h3>
<ul>
  <li>OpenAI API</li>
  <li>Ollama (local inference)</li>
  <li>Google Vertex AI</li>
  <li>Anthropic Claude API</li>
  <li>Other Open Source Models</li>
</ul>

<p><strong>Contributing Integrations:</strong> Pull requests for additional AI provider integrations are welcome! The project's architecture is designed to be extensible. Ollama integration would be particularly valuable as it would allow users to run models locally without cloud API costs.</p>

<h4>To add a new integration:</h4>
<ol>
  <li>Implement the core API service interface</li>
  <li>Add appropriate environment configuration</li>
  <li>Provide documentation for API setup</li>
  <li>Include example prompts optimized for the new model</li>
</ol>

<p>Check the <code>src/bedrock/bedrock.service.ts</code> file for an example of how API integration is currently implemented.</p>


<h2>Working with Data</h2>

<p>The application supports CSV data import for creating data-driven visualizations. To get started, you can use the example data provided in <code>public/example_product_data.csv</code>.</p>

<h3>Example Data Structure</h3>

<p>Header fields:</p>
<pre><code>date,region,product_category,product_name,sales_amount,units_sold,customer_satisfaction,in_stock,profit_margin,customer_age,customer_type,promotion_active</code></pre>

<p>Sample record:</p>
<pre><code>2024-01-01,North,Electronics,Smart Watch Pro,299.99,12,4.8,true,0.35,28,New,false</code></pre>

<h3>Using the Data</h3>
<ol>
  <li>Click the "Upload CSV" button in the interface</li>
  <li>Select your CSV file or use the provided example data</li>
  <li>The data structure will be passed to the AI attached to each user prompt</li>
</ol>

<h3>Data Visualization Examples</h3>

<h4>1. Sales Dashboard</h4>
<pre><code>Create an interactive dashboard showing:
1. A line chart showing daily sales trends with toggles for different product categories
2. A donut chart showing sales distribution by region
3. Key metrics displayed as cards (total sales, avg satisfaction, total units)
4. A bar chart comparing performance by customer type
Add tooltips, hover effects, and make it responsive.</code></pre>

<h4>2. Customer Insights</h4>
<pre><code>Visualize customer behavior patterns:
1. Group data by customer_type (New, Returning, Loyal)
2. Show average purchase amounts
3. Compare satisfaction scores by product category
4. Include promotion effectiveness analysis
Use animations for transitions and make it interactive.</code></pre>

<h4>3. Product Performance</h4>
<pre><code>Create a product analysis dashboard showing:
1. Scatter plot of sales_amount vs customer_satisfaction
2. Color points by product_category
3. Size points by profit_margin
4. Add tooltips showing product details on hover
Make it visually appealing with a clean, modern design.</code></pre>

<h2>Creative Examples</h2>
<p>Beyond data visualization, you can create interactive games, simulations, and 3D graphics:</p>

<h3>Interactive Games</h3>
<pre><code>Create a classic Snake game with:
- WASD controls
- Score tracking
- Increasing difficulty
- Game over screen</code></pre>

<h3>Physics Simulations</h3>
<pre><code>Create a particle system with:
- Gravity effects
- Collision detection
- User interaction
- Color transitions</code></pre>

<h3>3D Graphics</h3>
<pre><code>Generate a rotating 3D scene with:
- Textured cube
- Orbit controls
- Ambient lighting
- Responsive canvas</code></pre>

<h2>Technical Architecture</h2>

<ul>
  <li>Built with TypeScript and Vite</li>
  <li>Uses Monaco Editor for code editing</li>
  <li>AWS Bedrock integration for AI capabilities</li>
  <li>Component-based architecture</li>
  <li>Signal-based state management</li>
  <li>CSS-in-JS with style encapsulation</li>
</ul>

<h3>Key Components</h3>

<ul>
  <li>Chat Interface: Handles user prompts and AI responses</li>
  <li>Code Editor: Multiple editor views (HTML, CSS, JS, Combined)</li>
  <li>Preview: Sandboxed iframe for code execution</li>
  <li>Data Management: CSV parsing and data store</li>
  <li>Error Handling: Automatic retry mechanism for API failures</li>
</ul>

<h2>Limitations</h2>

<ul>
  <li>Development tool only, not production-ready</li>
  <li>Requires AWS Bedrock access</li>
  <li>Limited to client-side code generation</li>
  <li>Maximum token limitations apply</li>
  <li>No server-side functionality</li>
</ul>

<h2>Contributing</h2>

<ol>
  <li>Fork the repository</li>
  <li>Create a feature branch</li>
  <li>Commit your changes</li>
  <li>Push to the branch</li>
  <li>Create a Pull Request</li>
</ol>

<h2>Development Roadmap</h2>

<ul>
  <li>[ ] Improved error handling and validation</li>
  <li>[ ] Additional library integrations</li>
  <li>[ ] Enhanced data visualization templates</li>
  <li>[ ] Code snippet library</li>
  <li>[ ] Custom theme support</li>
  <li>[ ] Offline capability</li>
  <li>[ ] Pass the rendered html back to the AI model for feedback</li>
</ul>


# Feature Branches Updated

1. [x] COMPLETE: git checkout -b feature/simplified-components
   - Remove base Component class
   - Move HTML structure to index.html
   - Update components to work with DOM directly
   - Test functionality
   - Create PR for review

2. [x] COMPLETE: git checkout -b feature/store-consolidation
   - Review and consolidate AppStore usage
   - Ensure consistent state management
   - Remove unnecessary signals
   - Clean up data flow
   - Create PR for review

3. git checkout -b feature/error-handling
   - Implement standardized error handling
   - Add error reporting to store
   - Improve error UI feedback
   - Test error scenarios
   - Create PR for review

4. [x] COMPLETE: git checkout -b feature/css-modernization
   - Move styles to scoped CSS files
   - Remove CSS-in-JS where possible
   - Implement better style organization
   - Test styling across components
   - Create PR for review

5. git checkout -b feature/code-cleanup
   - Clean up remaining technical debt
   - Improve documentation
   - Add test coverage
   - Optimize performance
   - Create PR for review


More examples:
show me something interesting about this data.
> Interactive weather dashboard showing temperature and humidity trends over time with key statistics including average temperature, maximum wind speed, and humidity range

Available data structure: { time: string, temperature_2m: number, relative_humidity_2m: number, wind_speed_10m: number }. Data has 168 records.
also chart wind speed

> Comprehensive weather dashboard featuring a multi-axis line chart showing temperature, humidity, and wind speed trends over time, along with statistical cards displaying averages and ranges for each metric

Available data structure: { time: string, temperature_2m: number, relative_humidity_2m: number, wind_speed_10m: number }. Data has 168 records.
can we make some correlation between the temperature and the windspeed and humidity?

> Correlation analysis dashboard showing scatter plots of temperature vs wind speed and temperature vs humidity, with calculated correlation coefficients and interpretation of correlation strength

Available data structure: { time: string, temperature_2m: number, relative_humidity_2m: number, wind_speed_10m: number }. Data has 168 records.
What insights does this give us? Correlation Analysis Temperature-Wind Correlation: -0.427 Moderate negative correlation

> Temperature-Humidity Correlation: 0.406 Moderate positive correlation
Comprehensive analysis of weather patterns showing relationships between temperature, wind speed, and humidity, with detailed insights about correlations and their practical implications
