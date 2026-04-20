import sqlite3
import os

# This file creates the database and all tables
# Run this file ONCE before starting the app
# Command: py -3.9 database.py

DATABASE = 'forgepc.db'

def get_connection():
    """Returns a connection to the SQLite database"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # lets us access columns by name
    return conn

def create_tables():
    """Creates all tables if they don't already exist"""
    conn = get_connection()
    cursor = conn.cursor()

    # ── USERS TABLE ──────────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id     INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            email       TEXT    UNIQUE NOT NULL,
            password    TEXT    NOT NULL,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # ── ADMINS TABLE ─────────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            admin_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            email       TEXT    UNIQUE NOT NULL,
            password    TEXT    NOT NULL
        )
    ''')

    # ── COMPONENTS TABLE ──────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS components (
            component_id  INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL,
            brand         TEXT    NOT NULL,
            type          TEXT    NOT NULL,
            price         REAL    NOT NULL,
            specs         TEXT,
            image_url     TEXT,
            stock         INTEGER DEFAULT 10,
            added_by      INTEGER,
            FOREIGN KEY (added_by) REFERENCES admins(admin_id)
        )
    ''')

    # ── BUILDS TABLE ─────────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS builds (
            build_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            build_name  TEXT    NOT NULL,
            purpose     TEXT,
            total_price REAL,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')

    # ── BUILD ITEMS TABLE ─────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS build_items (
            item_id       INTEGER PRIMARY KEY AUTOINCREMENT,
            build_id      INTEGER NOT NULL,
            component_id  INTEGER NOT NULL,
            quantity      INTEGER DEFAULT 1,
            FOREIGN KEY (build_id)     REFERENCES builds(build_id),
            FOREIGN KEY (component_id) REFERENCES components(component_id)
        )
    ''')

    # ── ORDERS TABLE ──────────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            order_id      INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id       INTEGER NOT NULL,
            total_amount  REAL    NOT NULL,
            status        TEXT    DEFAULT 'Pending',
            ordered_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')

    # ── ORDER ITEMS TABLE ─────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id      INTEGER NOT NULL,
            component_id  INTEGER NOT NULL,
            quantity      INTEGER NOT NULL,
            unit_price    REAL    NOT NULL,
            FOREIGN KEY (order_id)     REFERENCES orders(order_id),
            FOREIGN KEY (component_id) REFERENCES components(component_id)
        )
    ''')

    # ── REVIEWS TABLE ─────────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            review_id    INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id      INTEGER NOT NULL,
            component_id INTEGER NOT NULL,
            rating       INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
            comment      TEXT,
            created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id)      REFERENCES users(user_id),
            FOREIGN KEY (component_id) REFERENCES components(component_id)
        )
    ''')

    conn.commit()
    print("✅ All tables created successfully!")
    return conn, cursor

def seed_components(cursor, conn):
    """Inserts sample component data into the database"""

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM components")
    count = cursor.fetchone()[0]
    if count > 0:
        print("ℹ️  Components already seeded, skipping...")
        return

    components = [
        # ── CPUs ──────────────────────────────────────────────
        ('Intel Core i3-12100F',    'Intel',  'CPU',         12500, '4 cores, 3.3GHz, LGA1700, 58W'),
        ('Intel Core i5-12400F',    'Intel',  'CPU',         18500, '6 cores, 2.5GHz, LGA1700, 65W'),
        ('Intel Core i5-13400F',    'Intel',  'CPU',         22500, '10 cores, 2.5GHz, LGA1700, 65W'),
        ('Intel Core i7-13700F',    'Intel',  'CPU',         38000, '16 cores, 2.1GHz, LGA1700, 65W'),
        ('Intel Core i9-13900F',    'Intel',  'CPU',         65000, '24 cores, 2.0GHz, LGA1700, 65W'),
        ('AMD Ryzen 5 5600X',       'AMD',    'CPU',         19500, '6 cores, 3.7GHz, AM4, 65W'),
        ('AMD Ryzen 5 7600X',       'AMD',    'CPU',         27000, '6 cores, 4.7GHz, AM5, 105W'),
        ('AMD Ryzen 7 5700X',       'AMD',    'CPU',         24000, '8 cores, 3.4GHz, AM4, 65W'),
        ('AMD Ryzen 7 7700X',       'AMD',    'CPU',         42000, '8 cores, 4.5GHz, AM5, 105W'),
        ('AMD Ryzen 9 7900X',       'AMD',    'CPU',         58000, '12 cores, 4.7GHz, AM5, 170W'),

        # ── GPUs ──────────────────────────────────────────────
        ('Nvidia GTX 1650',         'Nvidia', 'GPU',         16000, '4GB GDDR6, 75W'),
        ('Nvidia RTX 3060',         'Nvidia', 'GPU',         32000, '12GB GDDR6, 170W'),
        ('Nvidia RTX 3060 Ti',      'Nvidia', 'GPU',         38000, '8GB GDDR6, 200W'),
        ('Nvidia RTX 3070',         'Nvidia', 'GPU',         48000, '8GB GDDR6, 220W'),
        ('Nvidia RTX 4060',         'Nvidia', 'GPU',         42000, '8GB GDDR6, 115W'),
        ('Nvidia RTX 4060 Ti',      'Nvidia', 'GPU',         56000, '8GB GDDR6, 165W'),
        ('Nvidia RTX 4070',         'Nvidia', 'GPU',         72000, '12GB GDDR6X, 200W'),
        ('AMD RX 6600',             'AMD',    'GPU',         24000, '8GB GDDR6, 132W'),
        ('AMD RX 6700 XT',          'AMD',    'GPU',         38000, '12GB GDDR6, 230W'),
        ('AMD RX 7600',             'AMD',    'GPU',         30000, '8GB GDDR6, 165W'),

        # ── RAM ───────────────────────────────────────────────
        ('Corsair Vengeance 8GB',       'Corsair',   'RAM',  3200,  '8GB, DDR4, 3200MHz'),
        ('Corsair Vengeance 16GB',      'Corsair',   'RAM',  5800,  '16GB, DDR4, 3200MHz'),
        ('Corsair Vengeance DDR5 16GB', 'Corsair',   'RAM',  8500,  '16GB, DDR5, 5200MHz'),
        ('G.Skill Ripjaws 16GB',        'G.Skill',   'RAM',  5500,  '16GB, DDR4, 3600MHz'),
        ('G.Skill Trident Z 32GB',      'G.Skill',   'RAM',  10500, '32GB, DDR4, 3600MHz'),
        ('G.Skill Trident Z5 32GB',     'G.Skill',   'RAM',  15000, '32GB, DDR5, 6000MHz'),
        ('Kingston Fury 8GB',           'Kingston',  'RAM',  2900,  '8GB, DDR4, 3200MHz'),
        ('Kingston Fury 16GB',          'Kingston',  'RAM',  5200,  '16GB, DDR4, 3200MHz'),
        ('TeamGroup T-Force 16GB',      'TeamGroup', 'RAM',  4800,  '16GB, DDR4, 3200MHz'),
        ('Adata XPG 32GB',              'Adata',     'RAM',  9500,  '32GB, DDR4, 3600MHz'),

        # ── Storage ───────────────────────────────────────────
        ('WD Blue 1TB HDD',             'Western Digital', 'Storage', 3500,  '1TB, HDD, SATA, 7200RPM'),
        ('Seagate Barracuda 2TB',       'Seagate',         'Storage', 5500,  '2TB, HDD, SATA, 7200RPM'),
        ('Kingston A400 480GB SSD',     'Kingston',        'Storage', 3800,  '480GB, SSD, SATA'),
        ('Samsung 870 EVO 1TB',         'Samsung',         'Storage', 8500,  '1TB, SSD, SATA'),
        ('Kingston NV2 500GB NVMe',     'Kingston',        'Storage', 4500,  '500GB, SSD, NVMe'),
        ('Samsung 980 1TB NVMe',        'Samsung',         'Storage', 9500,  '1TB, SSD, NVMe'),
        ('WD Black SN770 1TB',          'Western Digital', 'Storage', 10500, '1TB, SSD, NVMe'),
        ('Seagate FireCuda 2TB NVMe',   'Seagate',         'Storage', 18000, '2TB, SSD, NVMe'),
        ('Adata S70 Blade 1TB',         'Adata',           'Storage', 9000,  '1TB, SSD, NVMe'),
        ('WD Green 240GB SSD',          'Western Digital', 'Storage', 2800,  '240GB, SSD, SATA'),

        # ── Motherboards ──────────────────────────────────────
        ('Gigabyte H610M S2H',          'Gigabyte', 'Motherboard', 8500,  'LGA1700, H610, mATX'),
        ('MSI PRO H610M-G',             'MSI',      'Motherboard', 9000,  'LGA1700, H610, mATX'),
        ('Asus Prime B660M-K',          'Asus',     'Motherboard', 11500, 'LGA1700, B660, mATX'),
        ('MSI MAG B660 Tomahawk',       'MSI',      'Motherboard', 18500, 'LGA1700, B660, ATX'),
        ('Asus Prime B550M-A',          'Asus',     'Motherboard', 10500, 'AM4, B550, mATX'),
        ('Gigabyte B550 Aorus Elite',   'Gigabyte', 'Motherboard', 16000, 'AM4, B550, ATX'),
        ('MSI MAG B550 Tomahawk',       'MSI',      'Motherboard', 17000, 'AM4, B550, ATX'),
        ('Asus ROG Strix B650-A',       'Asus',     'Motherboard', 28000, 'AM5, B650, ATX'),
        ('Gigabyte B650 Aorus Elite',   'Gigabyte', 'Motherboard', 25000, 'AM5, B650, ATX'),
        ('Gigabyte B660M DS3H',         'Gigabyte', 'Motherboard', 12000, 'LGA1700, B660, mATX'),

        # ── PSUs ──────────────────────────────────────────────
        ('Cooler Master MWE 450W',      'Cooler Master', 'PSU', 4500,  '450W, 80+ White'),
        ('Corsair CV550',               'Corsair',       'PSU', 5500,  '550W, 80+ Bronze'),
        ('Seasonic S12III 550W',        'Seasonic',      'PSU', 6500,  '550W, 80+ Bronze'),
        ('Cooler Master MWE 650W',      'Cooler Master', 'PSU', 7000,  '650W, 80+ Bronze'),
        ('Corsair RM750',               'Corsair',       'PSU', 11000, '750W, 80+ Gold'),
        ('Seasonic Focus GX 750W',      'Seasonic',      'PSU', 12500, '750W, 80+ Gold'),
        ('EVGA SuperNOVA 650W',         'EVGA',          'PSU', 9500,  '650W, 80+ Gold'),
        ('Corsair RM850x',              'Corsair',       'PSU', 14000, '850W, 80+ Gold'),
        ('be quiet! Straight Power 850W','be quiet!',    'PSU', 16000, '850W, 80+ Platinum'),
        ('Seasonic Prime TX 850W',      'Seasonic',      'PSU', 22000, '850W, 80+ Titanium'),

        # ── Cases ─────────────────────────────────────────────
        ('Cooler Master Q300L',         'Cooler Master', 'Case', 5500,  'mATX, Max GPU 360mm'),
        ('NZXT H510',                   'NZXT',          'Case', 12000, 'ATX, Max GPU 381mm'),
        ('Corsair 4000D',               'Corsair',       'Case', 13500, 'ATX, Max GPU 360mm'),
        ('Lian Li Lancool 205',         'Lian Li',       'Case', 9500,  'ATX, Max GPU 370mm'),
        ('Phanteks P300A',              'Phanteks',      'Case', 7500,  'ATX, Max GPU 400mm'),
        ('Fractal Design Pop Air',      'Fractal',       'Case', 11000, 'ATX, Max GPU 360mm'),
        ('Cooler Master TD500 Mesh',    'Cooler Master', 'Case', 10500, 'ATX, Max GPU 410mm'),
        ('DeepCool CC560',              'DeepCool',      'Case', 6500,  'ATX, Max GPU 320mm'),
        ('Thermaltake V200',            'Thermaltake',   'Case', 5800,  'ATX, Max GPU 350mm'),
        ('Value Top A1 mATX',           'Value Top',     'Case', 2500,  'mATX, Max GPU 320mm'),

        # ── Monitors ──────────────────────────────────────────
        ('Samsung 24" FHD 75Hz',        'Samsung', 'Monitor', 12000, '24 inch, 1080p, 75Hz, VA'),
        ('LG 24" FHD 144Hz',            'LG',      'Monitor', 18000, '24 inch, 1080p, 144Hz, IPS'),
        ('Asus TUF 27" QHD 165Hz',      'Asus',    'Monitor', 32000, '27 inch, 1440p, 165Hz, IPS'),
        ('MSI G274 27" 165Hz',          'MSI',     'Monitor', 28000, '27 inch, 1080p, 165Hz, IPS'),
        ('Dell S2421HGF 24" 144Hz',     'Dell',    'Monitor', 20000, '24 inch, 1080p, 144Hz, TN'),

        # ── Keyboards ─────────────────────────────────────────
        ('Redragon K552 Mechanical',    'Redragon',  'Keyboard', 3500, 'Mechanical, Wired, Red Switch'),
        ('Corsair K55 RGB',             'Corsair',   'Keyboard', 5500, 'Membrane, Wired, RGB'),
        ('Keychron K2 Wireless',        'Keychron',  'Keyboard', 9500, 'Mechanical, Wireless, Brown Switch'),
        ('Razer BlackWidow V3',         'Razer',     'Keyboard', 14000,'Mechanical, Wired, Green Switch'),
        ('A4Tech Bloody B810R',         'A4Tech',    'Keyboard', 4500, 'Mechanical, Wired, RGB'),

        # ── Mice ──────────────────────────────────────────────
        ('Logitech G102',               'Logitech',  'Mouse', 1800, 'Wired, 8000 DPI, 6 Buttons'),
        ('Redragon M711 Cobra',         'Redragon',  'Mouse', 2200, 'Wired, 10000 DPI, 7 Buttons'),
        ('Razer DeathAdder V2',         'Razer',     'Mouse', 7500, 'Wired, 20000 DPI, 8 Buttons'),
        ('Logitech G502 Hero',          'Logitech',  'Mouse', 8500, 'Wired, 25600 DPI, 11 Buttons'),
        ('A4Tech Bloody W60 Max',       'A4Tech',    'Mouse', 3500, 'Wired, 10000 DPI, Wireless'),
    ]

    cursor.executemany('''
        INSERT INTO components (name, brand, type, price, specs)
        VALUES (?, ?, ?, ?, ?)
    ''', components)

    conn.commit()
    print(f"✅ {len(components)} components seeded successfully!")

def init_db():
    """Main function — creates tables and seeds data"""
    print("🚀 Initializing ForgePC database...")
    conn, cursor = create_tables()
    seed_components(cursor, conn)
    conn.close()
    print("✅ Database ready! File saved as: forgepc.db")

# Run when you execute: py -3.9 database.py
if __name__ == '__main__':
    init_db()
