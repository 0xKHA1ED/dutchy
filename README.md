# Dutch Dash

Dutch Dash is a web-based language learning application focused on reading comprehension and vocabulary acquisition through "comprehensible input". It presents short stories in Dutch (with a focus on Noir and Thriller genres) and provides tools to track known vocabulary, translate words, and study sentences using a Spaced Repetition System (SRS).

## Features

*   **Story Library**: A collection of engaging short stories in Dutch, sorted by "readability" (percentage of known words).
*   **Comprehensible Input Tracking**: Tracks your known vocabulary and dynamically calculates the readability of every story in the library.
*   **Interactive Reader**:
    *   Click on any word to see its translation.
    *   Mark words as "Known" or "Unknown" to update your stats.
    *   Words are color-coded (Amber for new, Transparent for known).
*   **Study Mode (SRS)**:
    *   Study sentences from a story using flashcards.
    *   Spaced Repetition System (SRS) ensures you review sentences at optimal intervals.
    *   Text-to-Speech (TTS) audio for Dutch sentences.
    *   Word-for-word gloss and full translations on the back of cards.
*   **Audio Player**: Listen to the audio narration of the stories.
*   **Tag Filtering**: Filter stories by genre tags (e.g., Noir, Mystery, Horror).

## Project Structure

*   `index.html`: The main application entry point. Contains all the frontend logic, UI rendering, and state management in a single file for simplicity.
*   `data/`: Contains the content and data files.
    *   `stories.json`: The collection of stories with metadata, text, and translations.
    *   `frequency.json`: A dictionary mapping Dutch words to English translations.
*   `assets/`: Contains static assets.
    *   `helpers/`: Helper scripts.
        *   `compress_images.py`: A Python script to batch convert PNG images to WebP.
        *   `completion_simulator.html`: A tool to simulate the "known words" sorting logic.

## Setup and Usage

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Serve the application**:
    Because the application uses `fetch` to load JSON data, it must be served via a local web server (opening `index.html` directly in the file explorer may cause CORS errors).

    You can use Python's built-in HTTP server:
    ```bash
    python3 -m http.server 8000
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:8000` in your web browser.

## Development

### Adding New Stories

1.  Add a new entry to `data/stories.json`.
2.  Ensure the `id` is unique.
3.  Add the story text to the `body` field.
4.  Optionally add `sentence_translations` for the study mode.

### Modifying the Dictionary

1.  Update `data/frequency.json` to add new words or correct translations.

### Image Compression

To optimize images for the web:
1.  Place your PNG images in `assets/helpers/`.
2.  Run the compression script:
    ```bash
    python3 assets/helpers/compress_images.py
    ```

## Technologies

*   **HTML5 / CSS3 / JavaScript (ES6+)**: Core technologies.
*   **Tailwind CSS**: Utility-first CSS framework (loaded via CDN).
*   **Font Awesome**: Icons (loaded via CDN).
*   **Web Speech API**: For Text-to-Speech functionality.
*   **LocalStorage**: For persisting user progress (known words, SRS data).

## Documentation

The codebase is fully documented with JSDoc (for JavaScript) and Google Style Docstrings (for Python).
