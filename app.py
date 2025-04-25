from flask import Flask, render_template, request, jsonify
from chat import get_response

app = Flask(__name__)

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    
    if not text or not text.strip():
        return jsonify({"answer": "Please enter a valid message."})
    
    responses = get_response(text.strip().lower())
    
    # Join list into single string separated by newlines
    message = {"answer": "\n".join(responses)}
    
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)
