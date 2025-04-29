# Token Boosts API Server

This is a simple Python Flask server that serves as a backend for the XAI Finance application. It provides an API for fetching token data from DexScreener.

## Features

- Fetches top token boosts from the DexScreener API
- Implements caching to reduce API calls
- Provides formatted token data with names, logos, prices, and contract addresses
- Includes CORS support for cross-origin requests
- Health check endpoint for monitoring

## Installation

1. Make sure you have Python 3.8+ installed
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Running the Server

### Development

For development purposes, you can run the server using:

```bash
python api_server.py
```

This will start the server on port 5000 with debug mode enabled.

### Production

For production, it's recommended to use a WSGI server like Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
```

## API Endpoints

### GET /api/token-boosts

Returns a list of trending tokens with their details.

**Response Format:**

```json
{
  "tokens": [
    {
      "name": "Token Name",
      "symbol": "TKN",
      "address": "0x1234567890abcdef...",
      "logo": "https://example.com/logo.png",
      "price": 1.23,
      "chain": "ethereum"
    },
    ...
  ],
  "count": 10,
  "success": true,
  "timestamp": 1624312345.67
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": 1624312345.67
}
```

## Integration with Next.js Frontend

To connect the frontend with this API:

1. Run this server on port 5000
2. Update the Next.js app's environment variables or proxy settings to point to this API
3. Use the fetch API in your frontend components to retrieve data from this server

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Successful response
- 500: Server error (with error details in the response body)

## Caching

The API implements a simple in-memory cache with a 5-minute expiration time to reduce the number of calls to the external DexScreener API. 