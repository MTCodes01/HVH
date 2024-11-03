from flask import Flask, render_template, jsonify

app = Flask(__name__, template_folder='frontend/templates')

# Sample machine data (you can replace this with a database query)
machines_data = [
    {
        "name": "Machine 1",
        "status": "Operational",
        "usage_metrics": "80%",
        "last_maintenance": "2024-10-01",
        "next_maintenance": "2024-12-01"
    },
    {
        "name": "Machine 2",
        "status": "In Maintenance",
        "usage_metrics": "60%",
        "last_maintenance": "2024-08-15",
        "next_maintenance": "2024-11-15"
    },
    {
        "name": "Machine 3",
        "status": "Idle",
        "usage_metrics": "20%",
        "last_maintenance": "2024-09-20",
        "next_maintenance": "2024-11-20"
    }
]

@app.route('/')
def index():
    return render_template('machines.html')

@app.route('/api/machines')
def get_machines():
    return jsonify(machines_data)

if __name__ == '__main__':
    app.run(debug=True)
