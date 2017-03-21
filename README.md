<h1>Stock Scanner using the Trade King API.</h1>
<p>(You must have a tradeking account to use this)</p>

<p>Currently set up to scan 8000<sup>+</sup> stocks from the NYSE, AMEX, and NASDAQ</p>

<h3>Steps for Use:</h3>
<ol>
<li> Clone repo.</li>
<li>Install Node.js https://nodejs.org/en/download/</li>
<li>Run 'npm install' in your terminal</li>
<li>Sign Up with tradeking and get a stock trading account.</li>
<li>Follow the steps in the "Getting Set up" section https://developers.tradeking.com/documentation/getting-started</li>
<li>Add the file "tk-creds.json" to the server/json folder. with your keys and tokens.<br />
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

<p>Now you can view the app in localhost:3000 in your browser and start scanning</p>

<p>Note: Tests are always evolving to filter stocks for the best setups</p>


 
