from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from PyPDF2 import PdfReader
import os

app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return {
        "status": "online",
        "service": "Pixel Notes AI"
    }
@app.route("/check-key")
def check_key():
    if os.getenv("GROQ_API_KEY"):
        return {"status": "found"}
    return {"status": "missing"}
# Put your Groq API Key here
import os

from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@app.route("/summarize", methods=["POST"])
def summarize():

    file = request.files["file"]
    mode = request.form.get("mode", "summary")

    # Read PDF
    reader = PdfReader(file)

    text = ""

    for page in reader.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted + "\n"

    # Different Study Modes

    if mode == "summary":

        prompt = f"""
Create clear study notes from the following content.

Use:
- Headings
- Bullet points
- Important concepts
- Easy explanations

Notes:

{text}
"""

    elif mode == "flashcards":

        prompt = f"""
Create exactly 10 flashcards.

Output ONLY in this format:

Card 1
Question: question here
Answer: answer here

Card 2
Question: question here
Answer: answer here

Card 3
Question: question here
Answer: answer here

Continue until Card 10.

Do NOT write:
- introductions
- explanations
- extra text
- bullet points

Notes:

{text}
"""

    elif mode == "quiz":

        prompt = f"""
Create a study quiz.

Include:
- 10 MCQs
- 4 options each
- Correct answer after each question

Notes:

{text}
"""

    elif mode == "deepstudy":

        prompt = f"""
Explain the notes in deep study mode.

Include:
- Detailed explanations
- Concepts
- Examples
- Important facts
- Exam-focused understanding

Notes:

{text}
"""

    elif mode == "lastminute":

        prompt = f"""
Create a last-minute revision sheet.

Include:
- Only the most important points
- Short notes
- Key facts
- Easy memorization format

Notes:

{text}
"""

    else:

        prompt = f"""
Summarize the notes.

{text}
"""

    # Groq AI Call
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.5
    )

    result = completion.choices[0].message.content

    return jsonify({
        "result": result
    })


if __name__ == "__main__":
    app.run(debug=True)