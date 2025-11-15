// test-api.js - Run with: node test-api.js
const testAPIs = async () => {
  const baseURL = 'http://localhost:3000/api';
  const username = 'neha.mundhada';
  
  try {
    // Test GET endpoint
    console.log('Testing GET /api/save-paper...');
    const getResponse = await fetch(`${baseURL}/save-paper?username=${username}`);
    const getData = await getResponse.json();
    console.log('GET Response:', getData);
    
    // Test POST endpoint
    console.log('Testing POST /api/save-paper...');
    const postResponse = await fetch(`${baseURL}/save-paper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        paperID: 'test-paper-123',
        title: 'Test Paper',
        author: 'Test Author',
        tags: ['test'],
        action: 'save'
      })
    });
    const postData = await postResponse.json();
    console.log('POST Response:', postData);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testAPIs();