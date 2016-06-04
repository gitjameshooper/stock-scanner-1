<h1>Stock Scanner using the Trade King API.</h1>
<p>(You must have a tradeking account to use this)</p>

<p>Currently set up to scan 2800 stocks in 10 secs.</p>

<h3>Steps for Use:</h3>
<ol>
<li> Clone repo.</li>
<li>Install Node.js https://nodejs.org/en/download/</li>
<li>Run 'npm install' in your terminal</li>
<li>Sign Up with tradeking and get a stock trading account.</li>
<li>Follow the steps in the "Getting Set up" section https://developers.tradeking.com/documentation/getting-started</li>
<li>Add the file "tk-creds.json" to the src/json folder. with your keys and tokens.<br />
 <code>
{    
    "consumer_key": "yourconsumerkeygoeshere",
    "consumer_secret": "yourconsumersecretgoeshere",
    "access_token": "youraccesstokengoeshere",
    "access_secret": "youraccesssecretgoeshere"

}</code>
</li>
<li>Run 'gulp serve' in your terminal.</li>
</ol>

<p>Now you can view the app in localhost:2000 in your browser and start/stop scanning</p>

<p>Note: Currently developing tests to put all the stocks through</p>
 
