const APIs = [
    { 
      name: 'Random User', 
      url: 'https://randomuser.me/api/',
      fallbackData: { results: [{ name: { first: 'John', last: 'Doe' }, email: 'john.doe@example.com' }] }
    },
    { 
      name: 'JSON Placeholder Posts', 
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      fallbackData: { title: 'No post available', body: 'Unable to fetch post' }
    },
    { 
      name: 'Trivia Question', 
      url: 'https://opentdb.com/api.php?amount=1&type=multiple',
      fallbackData: { results: [{ question: 'No question available', correct_answer: 'N/A', incorrect_answers: ['N/A', 'N/A', 'N/A'] }] }
    }
  ];
  
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(id);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
  
  async function fetchDataFromAPI(api, retries = 3, backoff = 1000) {
    try {
      const data = await fetchWithTimeout(api.url);
      return {
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching data from ${api.name}:`, error.message);
      if (error.message.includes('HTTP error! status: 429') && retries > 0) {
        console.log(`Retrying ${api.name} in ${backoff}ms...`);
        await delay(backoff);
        return fetchDataFromAPI(api, retries - 1, backoff * 2);
      }
      return {
        success: false,
        data: api.fallbackData,
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  async function checkInternetConnectivity() {
    try {
      const response = await fetch('https://www.google.com', { mode: 'no-cors' });
      return response.type === 'opaque' || response.status === 200;
    } catch (error) {
      return false;
    }
  }
  
  async function fetchDataFromAPIs() {
    const results = {};
    
    const isConnected = await checkInternetConnectivity();
    if (!isConnected) {
      for (const api of APIs) {
        results[api.name] = {
          success: false,
          data: api.fallbackData,
          error: 'No internet connection',
          errorType: 'NetworkError',
          timestamp: new Date().toISOString()
        };
        await chrome.storage.local.set({ [api.name]: results[api.name] });
      }
      return results;
    }
    
    for (const api of APIs) {
      results[api.name] = await fetchDataFromAPI(api);
      await chrome.storage.local.set({ [api.name]: results[api.name] });
      await delay(1000); // Add a 1-second delay between API calls
    }
  
    return results;
  }
  
  // Handle alarms
  chrome.alarms.create('fetchData', { periodInMinutes: 15 });
  
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'fetchData') {
      await fetchDataFromAPIs();
    }
  });
  
  // Handle messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getData') {
      fetchDataFromAPIs().then(data => {
        sendResponse(data);
      });
      return true; // Will respond asynchronously
    }
  });
  
  // Initial fetch
  fetchDataFromAPIs();
  
  
  

  