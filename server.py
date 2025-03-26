# Author: Konstantinos Anagnostopoulos
from flask import Flask, render_template, request, jsonify, abort
import json, re
from datetime import datetime

app = Flask(__name__)

# Add this at the top, right after your imports
with open("events.json") as f:
    events = json.load(f)


@app.route("/")
def home():
    return render_template("home.html")

@app.route("/search")
def search():
    query = request.args.get("q", "")
    query_stripped = query.strip()
    if not query_stripped:
        # No query; show empty results.
        return render_template("search.html", search_text="", results=[], count=0)
    
    # If "all" is entered, return all events.
    if query_stripped.lower() == "all":
        results = events
    else:
        results = []
        for event in events:
            title = event.get("title", "")
            venue = event.get("venue", "")
            artists = " ".join(event.get("artists", []))
            if (query.lower() in title.lower() or
                query.lower() in venue.lower() or
                query.lower() in artists.lower()):
                results.append(event)

    count = len(results)
    return render_template("search.html", search_text=query, results=results, count=count)

@app.route("/events")
def get_events():
    return jsonify(events)

@app.route("/view/<id>")
def view_item(id):
    # Look for the event with the matching id
    event_data = next((event for event in events if event["id"] == id), None)
    if event_data is None:
        abort(404)
    return render_template("view.html", event=event_data)

# New route for adding an event
@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        data = request.get_json()  # Expect JSON data from Ajax
        errors = {}
        
        # Simple validation: all fields are required and price must be a number.
        required_fields = ["title", "media", "description", "startDate", "venue", "address", "price", "artists"]
        for field in required_fields:
            value = data.get(field, "").strip() if isinstance(data.get(field, ""), str) else data.get(field, "")
            if not value:
                errors[field] = f"{field.capitalize()} is required."
            # For price, check if it's a number (here, a float is allowed)
            if field == "price" and value:
                try:
                    float(value.replace("$", ""))
                except ValueError:
                    errors[field] = "Price must be a number."
        
        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        # Generate new event id (max current id + 1)
        new_id = str(max(int(event["id"]) for event in events) + 1)
        new_event = {
            "id": new_id,
            "title": data["title"].strip(),
            "media": data["media"].strip(),
            "description": data["description"].strip(),
            "startDate": data["startDate"].strip(),
            "venue": data["venue"].strip(),
            "address": data["address"].strip(),
            "price": data["price"].strip(),
            "artists": [a.strip() for a in data["artists"].split(",") if a.strip()]
        }
        events.append(new_event)
        # Optionally write back to file here.

        return jsonify({"success": True, "new_id": new_id})
    
    return render_template("add.html")

# New route to edit an event
@app.route("/edit/<id>", methods=["GET", "POST"])
def edit_event(id):
    event = next((e for e in events if e['id'] == id), None)
    if event is None:
        abort(404)

    if request.method == 'POST':
        data = request.get_json()
        errors = {}

        required_fields = ["title", "media", "description", "startDate", "venue", "address", "price", "artists"]
        for field in required_fields:
            value = data.get(field, "").strip() if isinstance(data.get(field, ""), str) else data.get(field, "")
            if not value:
                errors[field] = f"{field.capitalize()} is required."
            if field == "price" and value:
                # Remove the "$" symbol and validate the price
                price_value = value.replace("$", "").strip()
                try:
                    float(price_value)  # Ensure the price is a valid number
                except ValueError:
                    errors[field] = "Price must be a valid number (e.g., 61.96)."

        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        # Update event fields
        event.update({
            "title": data["title"].strip(),
            "media": data["media"].strip(),
            "description": data["description"].strip(),
            "startDate": data["startDate"].strip(),
            "venue": data["venue"].strip(),
            "address": data["address"].strip(),
            "price": f"${data['price'].replace('$', '').strip()}",  # Ensure the price has a "$" symbol
            "artists": [a.strip() for a in data["artists"].split(",") if a.strip()]
        })

        return jsonify({"success": True, "id": event["id"]})

    return render_template("edit.html", event=event)


@app.template_filter('datetimeformat')
def datetimeformat(value, format='%B %d, %Y at %I:%M %p'):
    dt = datetime.fromisoformat(value)
    return dt.strftime(format)

@app.template_filter('highlight')
def highlight(text, query):
    if not query:
        return text
    pattern = re.compile(re.escape(query), re.IGNORECASE)
    highlighted = pattern.sub(lambda m: f'<span class="highlight">{m.group(0)}</span>', text)
    return highlighted

if __name__ == '__main__':
    app.run(debug=True, port=5001)
