CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('superadmin', 'admin', 'staff', 'user')) NOT NULL,
    region VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEHICLES - mashinalar
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    plate_number VARCHAR(15) UNIQUE NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    year SMALLINT,
    vin VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INFRACTION_TYPES - qoidabuzarlik turlari (справочник)
CREATE TABLE infraction_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    law_reference VARCHAR(200),
    base_fine_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. FINES - jarimalar (har bir haydovchiga berilgan)
CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    infraction_type_id INT REFERENCES infraction_types(id),
    inspector_id INT REFERENCES users(id),
    fine_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    location VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'cancelled', 'overdue')) DEFAULT 'pending',
    fine_date TIMESTAMP NOT NULL,
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. LOCATIONS - maydonchalar
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    capacity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TOW_TRUCKS - evakuator mashinalar
CREATE TABLE tow_trucks (
    id SERIAL PRIMARY KEY,
    reg_number VARCHAR(30) UNIQUE NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. STORAGE_RATES - tariflar
CREATE TABLE storage_rates (
    id SERIAL PRIMARY KEY,
    rate_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'UZS',
    description TEXT,
    effective_from DATE NOT NULL,
    effective_to DATE
);

-- 8. IMPOUND_RECORDS - olib kirilgan mashinalar
CREATE TABLE impound_records (
    id SERIAL PRIMARY KEY,
    fine_id INT REFERENCES fines(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    tow_truck_id INT REFERENCES tow_trucks(id),
    location_id INT REFERENCES locations(id),
    storage_rate_id INT REFERENCES storage_rates(id),
    impounded_by INT REFERENCES users(id),
    released_by INT REFERENCES users(id),
    impounded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'stored'
);

-- 9. PAYMENTS - to'lovlar
-- YANGILANDI: fine_id qo'shildi
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    fine_id INT REFERENCES fines(id),
    record_id INT REFERENCES impound_records(id) ON DELETE CASCADE,
    paid_by INT REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. STAFF - xodimlar
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    position VARCHAR(100),
    shift_start TIME,
    shift_end TIME,
    location_id INT REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. LOGS - tizim harakatlari
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. SESSIONS - foydalanuvchi sessiyalari
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    ip_address VARCHAR(50),
    device_info VARCHAR(150),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP
);

-- 13. MAINTENANCE - texnik xizmatlar
CREATE TABLE maintenance (
    id SERIAL PRIMARY KEY,
    tow_truck_id INT REFERENCES tow_trucks(id),
    description TEXT,
    performed_by INT REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. NOTIFICATIONS - ogohlantirishlar
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(100),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. REPORTS - hisobotlar
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    generated_by INT REFERENCES users(id),
    report_type VARCHAR(50),
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. MEDIA_FILES - suratlar, videolar
CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    fine_id INT REFERENCES fines(id),
    record_id INT REFERENCES impound_records(id),
    file_path TEXT,
    file_type VARCHAR(20),
    uploaded_by INT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. ALERTS - favqulodda holatlar
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    alert_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
