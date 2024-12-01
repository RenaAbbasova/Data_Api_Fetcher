# API Data Fetcher Chrome Extension

## Description

API Data Fetcher is a Chrome extension that allows users to fetch and display data from multiple APIs. It provides an easy-to-use interface for viewing data from Random User Generator, JSON Placeholder, and Open Trivia Database APIs.

## Features

- Fetches data from three different APIs:
  - Random User Generator
  - JSON Placeholder Posts
  - Open Trivia Database
- Displays fetched data in an organized and readable format
- Handles errors gracefully and provides fallback data
- Automatically refreshes data every 15 minutes
- Allows manual refresh of data
- Works offline using cached data

## Installation

1. Download the latest release of the extension (`.zip` file) from the [Releases](https://github.com/yourusername/api-data-fetcher/releases) page.
2. Unzip the file to a location on your computer.
3. Open Google Chrome and navigate to `chrome://extensions`.
4. Enable "Developer mode" by toggling the switch in the top right corner.
5. Click on "Load unpacked" and select the directory where you unzipped the extension files.
6. The API Data Fetcher extension should now appear in your list of installed extensions.

## Usage

1. Click on the API Data Fetcher icon in your Chrome toolbar to open the popup.
2. The extension will automatically fetch data from all three APIs and display it.
3. Each API's data is displayed in its own section with a status indicator (Success/Error).
4. If there's an error fetching data from an API, you'll see an error message and fallback data.
5. To manually refresh the data, click the "Refresh Data" button at the top of the popup.
6. The data will automatically refresh every 15 minutes when you're online.

## Development

To set up the project for development:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/api-data-fetcher.git
   ```
2. Navigate to the project directory:
   ```
   cd api-data-fetcher
   ```
3. Make your changes to the source files.
4. Load the extension in Chrome using the installation steps above, but select the project directory instead of a zip file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feel free to reach out to [your-email@example.com](mailto:your-email@example.com).