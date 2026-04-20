from flask import Flask, request, jsonify, session
from flask_cors import CORS
from database import get_connection
import hashlib

app = Flask(__name__)
app.secret_key = 'forgepc_secret_key'
CORS(app, supports_credentials=True)

# ── Helper ────────────────────────────────────────────────────
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ── AUTH ROUTES ───────────────────────────────────────────────

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            (name, email, hash_password(password))
        )
        conn.commit()
        return jsonify({'message': 'Registration successful!'}), 201
    except Exception:
        return jsonify({'error': 'Email already exists'}), 409
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email    = data.get('email', '').strip()
    password = data.get('password', '').strip()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        (email, hash_password(password))
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        session['user_id'] = user['user_id']
        session['user_name'] = user['name']
        return jsonify({'message': 'Login successful!', 'name': user['name'], 'user_id': user['user_id']}), 200
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200

# ── COMPONENTS ROUTES ─────────────────────────────────────────

@app.route('/api/components', methods=['GET'])
def get_components():
    component_type = request.args.get('type')  # e.g. ?type=CPU
    search         = request.args.get('search', '')

    conn = get_connection()
    cursor = conn.cursor()

    if component_type and component_type != 'All':
        cursor.execute(
            'SELECT * FROM components WHERE type = ? AND name LIKE ?',
            (component_type, f'%{search}%')
        )
    else:
        cursor.execute(
            'SELECT * FROM components WHERE name LIKE ?',
            (f'%{search}%',)
        )

    rows = cursor.fetchall()
    conn.close()

    components = [dict(row) for row in rows]
    return jsonify(components), 200

@app.route('/api/components/<int:component_id>', methods=['GET'])
def get_component(component_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM components WHERE component_id = ?', (component_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify(dict(row)), 200
    return jsonify({'error': 'Component not found'}), 404

# ── BUILDS ROUTES ─────────────────────────────────────────────

@app.route('/api/builds', methods=['POST'])
def save_build():
    data         = request.get_json()
    user_id      = data.get('user_id')
    build_name   = data.get('build_name', 'My Build')
    purpose      = data.get('purpose', '')
    total_price  = data.get('total_price', 0)
    component_ids = data.get('component_ids', [])

    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO builds (user_id, build_name, purpose, total_price) VALUES (?, ?, ?, ?)',
        (user_id, build_name, purpose, total_price)
    )
    build_id = cursor.lastrowid

    for cid in component_ids:
        cursor.execute(
            'INSERT INTO build_items (build_id, component_id) VALUES (?, ?)',
            (build_id, cid)
        )

    conn.commit()
    conn.close()
    return jsonify({'message': 'Build saved!', 'build_id': build_id}), 201

@app.route('/api/builds/<int:user_id>', methods=['GET'])
def get_user_builds(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM builds WHERE user_id = ?', (user_id,))
    builds = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(builds), 200

# ── RUN ───────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)
