document.addEventListener('DOMContentLoaded', function() {
    const apiContainer = document.getElementById('api-container');
  
    function formatTimestamp(timestamp) {
      return new Date(timestamp).toLocaleString();
    }
  
    function displayData(data) {
      apiContainer.innerHTML = '';
      
      for (const [apiName, apiResult] of Object.entries(data)) {
        const apiElement = document.createElement('div');
        apiElement.className = 'api-data';
        
        const statusClass = apiResult.success ? 'success' : 'error';
        const statusMessage = apiResult.success ? 'Success' : 'Error';
        
        let content = '';
        if (apiResult.success) {
          switch(apiName) {
            case 'Random User':
              const user = apiResult.data.results[0];
              content = `
                <strong>Name:</strong> ${user.name.first} ${user.name.last}<br>
                <strong>Email:</strong> ${user.email}
              `;
              break;
            case 'JSON Placeholder Posts':
              content = `
                <strong>Title:</strong> ${apiResult.data.title}<br>
                <strong>Body:</strong> ${apiResult.data.body}
              `;
              break;
            case 'Trivia Question':
              const trivia = apiResult.data.results[0];
              content = `
                <strong>Question:</strong> ${trivia.question}<br>
                <strong>Correct Answer:</strong> ${trivia.correct_answer}<br>
                <strong>Incorrect Answers:</strong> ${trivia.incorrect_answers.join(', ')}
              `;
              break;
            default:
              content = `<pre>${JSON.stringify(apiResult.data, null, 2)}</pre>`;
          }
        }
        
        apiElement.innerHTML = `
          <div class="api-header ${statusClass}">
            <h2>${apiName}</h2>
            <span class="status">${statusMessage}</span>
          </div>
          <div class="api-content">
            ${apiResult.error ? 
              `<div class="error-message">
                <strong>Error Type:</strong> ${apiResult.errorType || 'Unknown'}<br>
                <strong>Message:</strong> ${apiResult.error}
               </div>` : 
              content
            }
            <div class="timestamp">Last updated: ${formatTimestamp(apiResult.timestamp)}</div>
          </div>
        `;
        
        apiContainer.appendChild(apiElement);
      }
    }
  
    function showLoading() {
      apiContainer.innerHTML = '<div class="loading">Loading data...</div>';
    }
  
    function getData() {
      showLoading();
      chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
        if (chrome.runtime.lastError) {
          apiContainer.innerHTML = `<div class="error">Error: ${chrome.runtime.lastError.message}</div>`;
          return;
        }
        if (response) {
          displayData(response);
        } else {
          apiContainer.innerHTML = '<div class="error">No data available</div>';
        }
      });
    }
  
    // Get data when popup is opened
    getData();
  
    // Add refresh button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Data';
    refreshButton.className = 'refresh-button';
    refreshButton.addEventListener('click', getData);
    document.body.insertBefore(refreshButton, apiContainer);
  
    // Set up auto-refresh every 60 seconds
    setInterval(getData, 60000);
  });
  
  
  
  
  