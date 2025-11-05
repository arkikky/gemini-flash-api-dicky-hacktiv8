# Gemini Flash API

Express service that wraps the Google Gemini 2.5 Flash model for text, image, document, and audio prompts. Uploaded files are stored temporarily in the `uploads/` directory and forwarded to Gemini as inline data.

## Requirements

- Node.js 18 or newer (the server uses top-level `await`)
- Yarn or npm
- A Google Gemini API key with access to the 2.5 Flash model

## Setup

1. Install dependencies:
   ```bash
   # choose one package manager
   yarn install
   # npm install
   ```
2. Create a `.env` file in the project root with your credentials:
   ```bash
   API_KEY=your_gemini_api_key
   PORT=3000 # optional, defaults to 3000
   ```
3. Start the server:
   ```bash
   node index.js
   ```
   The API will report `Server ready on http://localhost:3000`.

## Endpoints

- `POST /generate-text`  
  Accepts JSON `{ "prompt": "..." }` and returns `response.text` from the Gemini model.

- `POST /generate-from-image`  
  Multipart form upload with an `image` file and a `prompt` string. The image is converted to base64 before being sent to Gemini alongside the prompt.

- `POST /generate-from-document`  
  Multipart form upload with a `document` file and optional `prompt`. When the prompt is omitted, it defaults to asking for the document title.

- `POST /generate-from-audio`  
  Multipart form upload with an `audio` file and optional `prompt`. The server infers the MIME type for common audio extensions before submitting the request to Gemini.

Each endpoint responds with JSON shaped like:

```json
{
  "result": "Model response text"
}
```

## Try It With curl

Update the absolute paths after `@` to point to files on your machine before running these commands.

```bash
# Generate text
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Apa itu API?"}'

# Generate from an image
curl -X POST http://localhost:3000/generate-from-image \
  -F "image=@/Users/mac/Desktop/hacktiv8.png" \
  -F "prompt=Gambar apa ini?"

# Generate from a document
curl -X POST http://localhost:3000/generate-from-document \
  -F "document=@/Users/mac/Desktop/guide.pdf" \
  -F "prompt=Apa judul dari dokumen ini?"

# Generate from audio
curl -X POST http://localhost:3000/generate-from-audio \
  -F "audio=@/Users/mac/Desktop/music.mp3" \
  -F "prompt=Tolong transkripsikan dengan singkat isi rekaman ini."
```

## Notes

- Uploaded files remain in `uploads/`; remove them periodically if storage is a concern.
- Handle API quota errors and rate limiting according to your Gemini plan.
- Consider enabling HTTPS or an API gateway before exposing the service publicly.
