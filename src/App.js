import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [urls, setUrls] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchData = () => {
    const searchParams = new URLSearchParams(urls);
    const urlList = searchParams.getAll('url');

    axios
      .get('http://localhost:8008', {
        params: {
          url: urlList,
        },
      })
      .then(response => {
        setResult(response.data);
        setError(null);
      })
      .catch(error => {
        setResult(null);
        setError('Error fetching data from the server.');
      });
  };

  return (
    <div>
      <h1>Number Management App</h1>
      <textarea
        placeholder="Enter URLs (one per line)"
        value={urls}
        onChange={e => setUrls(e.target.value)}
        rows={5}
        cols={50}
      />
      <br />
      <button onClick={handleFetchData}>Fetch Data</button>
      {error && <div>{error}</div>}
      {result && (
        <div>
          <h2>Results:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
