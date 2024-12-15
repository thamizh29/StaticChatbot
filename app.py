from flask import Flask, render_template, jsonify, url_for
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def load_data():
    with open("Data.json", "r") as file:
        return json.load(file)

@app.route("/")
@app.route("/home")
def home():
    return render_template('index.html', all_questions=load_data())

@app.route("/Datajson")
def datajson():
    data = load_data()
    for item in data:
        if "image" in item:
            item["image"] = url_for('static', filename=item["image"].lstrip('./'))
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
