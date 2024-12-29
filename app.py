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
    return render_template('index.html')

@app.route("/Datajson")
def datajson():
    data = load_data()
    for item in data:
        # Prefix top-level question images
        if "image" in item and item["image"]:
            item["image"] = url_for('static', filename=item["image"].lstrip('./'))


        # Handle subquestions
        if "subquestion" in item and isinstance(item["subquestion"], list):
            for sub in item["subquestion"]:
                if "image" in sub and sub["image"]:
                    sub["image"] = url_for('static', filename=sub["image"].lstrip('./'))
                if "subquestion" in sub and isinstance(sub["subquestion"], list):
                    for sub2 in sub["subquestion"]:
                        if "image" in sub2 and sub2["image"]:
                            sub2["image"] = url_for('static', filename=sub2["image"].lstrip('./'))
    print(data)
    return jsonify(data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
