import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';
const isProduction = process.env.NODE_ENV === 'production';

const getAllowedOrigins = (): string[] => {
    const raw = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
    const origins = raw.split(',').map((item) => item.trim()).filter(Boolean);
    if (origins.length === 0) {
        origins.push('http://localhost:5173');
    }
    return origins;
};

const allowedOrigins = getAllowedOrigins();

const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) return true;
    return false;
};

if (isProduction && JWT_SECRET === 'change_me_in_production') {
    console.error('❌ JWT_SECRET не задан. Укажите секрет в переменных окружения хостинга.');
    process.exit(1);
}

app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
}));
app.use(express.json());

if (isProduction) {
    app.set('trust proxy', 1);
}

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
    : new Pool({
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'harbor_db',
        password: process.env.PGPASSWORD || 'admin',
        port: Number(process.env.PGPORT) || 5432,
    });

const initDatabase = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS favorites (
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            property_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, property_id)
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            property_id INTEGER NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            adults INTEGER NOT NULL DEFAULT 1,
            children INTEGER NOT NULL DEFAULT 0,
            infants INTEGER NOT NULL DEFAULT 0,
            pets INTEGER NOT NULL DEFAULT 0,
            total_price INTEGER NOT NULL,
            host_message TEXT,
            payment_timing VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS host_message TEXT;
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_timing VARCHAR(20);
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'confirmed';
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS property_title VARCHAR(255);
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS property_image_url TEXT;
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS property_location VARCHAR(255);
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS property_type VARCHAR(50);
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS host_name VARCHAR(100);
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS price_per_night INTEGER;
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS subtotal INTEGER;
    `);
    await pool.query(`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS taxes INTEGER;
    `);
    await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS host_applications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            city VARCHAR(200) NOT NULL,
            property_type VARCHAR(50) NOT NULL,
            rooms VARCHAR(20),
            description TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

interface AuthRequest extends Request {
    userId?: number;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

const getFavoriteIds = async (userId: number): Promise<number[]> => {
    const result = await pool.query(
        'SELECT property_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
        [userId],
    );
    return result.rows.map((row) => row.property_id as number);
};

app.get('/health', async (_req: Request, res: Response) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'postgresql' });
    } catch {
        res.status(503).json({ status: 'error', database: 'postgresql' });
    }
});

// --- ИЗБРАННОЕ ---
app.get('/favorites', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const propertyIds = await getFavoriteIds(req.userId!);
        res.json({ propertyIds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/favorites', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.body as { propertyId?: number };

        if (typeof propertyId !== 'number') {
            return res.status(400).json({ error: 'propertyId обязателен' });
        }

        await pool.query(
            'INSERT INTO favorites (user_id, property_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.userId, propertyId],
        );

        const propertyIds = await getFavoriteIds(req.userId!);
        res.json({ propertyIds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.delete('/favorites/:propertyId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const propertyId = Number(req.params.propertyId);

        if (!Number.isFinite(propertyId)) {
            return res.status(400).json({ error: 'Некорректный propertyId' });
        }

        await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND property_id = $2',
            [req.userId, propertyId],
        );

        const propertyIds = await getFavoriteIds(req.userId!);
        res.json({ propertyIds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

const readOptionalInt = (value: unknown): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
};

const formatBooking = (row: Record<string, unknown>) => ({
    id: row.id as number,
    propertyId: row.property_id as number,
    checkIn: row.check_in as string,
    checkOut: row.check_out as string,
    adults: row.adults as number,
    children: row.children as number,
    infants: row.infants as number,
    pets: row.pets as number,
    totalPrice: row.total_price as number,
    createdAt: row.created_at as string,
    status: (row.status as string) || 'confirmed',
    propertyTitle: (row.property_title as string) || undefined,
    propertyImageUrl: (row.property_image_url as string) || undefined,
    propertyLocation: (row.property_location as string) || undefined,
    propertyType: (row.property_type as string) || undefined,
    hostName: (row.host_name as string) || undefined,
    hostMessage: (row.host_message as string) || undefined,
    paymentTiming: (row.payment_timing as 'now' | 'later') || undefined,
    pricePerNight: readOptionalInt(row.price_per_night),
    subtotal: readOptionalInt(row.subtotal),
    taxes: readOptionalInt(row.taxes),
});

const formatUser = (row: Record<string, unknown>) => ({
    id: row.id as number,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    phone: (row.phone as string) || '',
    registrationYear: new Date(row.created_at as string).getFullYear(),
});

const hasBookingConflict = async (propertyId: number, checkIn: string, checkOut: string) => {
    const result = await pool.query(
        `SELECT id FROM bookings
         WHERE property_id = $1
         AND COALESCE(status, 'confirmed') = 'confirmed'
         AND check_in < $3::date
         AND check_out > $2::date
         LIMIT 1`,
        [propertyId, checkIn, checkOut],
    );

    return result.rows.length > 0;
};

// --- БРОНИРОВАНИЯ ---
app.get('/bookings', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT * FROM bookings
             WHERE user_id = $1
             AND COALESCE(status, 'confirmed') != 'cancelled'
             ORDER BY check_in ASC`,
            [req.userId],
        );

        res.json({ bookings: result.rows.map(formatBooking) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/bookings/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const bookingId = Number(req.params.id);

        if (!Number.isFinite(bookingId)) {
            return res.status(400).json({ error: 'Некорректный id бронирования' });
        }

        const result = await pool.query(
            `SELECT * FROM bookings
             WHERE id = $1 AND user_id = $2`,
            [bookingId, req.userId],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }

        res.json({ booking: formatBooking(result.rows[0]) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.delete('/bookings/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const bookingId = Number(req.params.id);

        if (!Number.isFinite(bookingId)) {
            return res.status(400).json({ error: 'Некорректный id бронирования' });
        }

        const result = await pool.query(
            `UPDATE bookings
             SET status = 'cancelled'
             WHERE id = $1 AND user_id = $2 AND COALESCE(status, 'confirmed') != 'cancelled'
             RETURNING id`,
            [bookingId, req.userId],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Бронирование не найдено' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/bookings', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const {
            propertyId,
            checkIn,
            checkOut,
            adults,
            children,
            infants,
            pets,
            totalPrice,
            hostMessage,
            paymentTiming,
            propertyTitle,
            propertyImageUrl,
            propertyLocation,
            propertyType,
            hostName,
            pricePerNight,
            subtotal,
            taxes,
        } = req.body as {
            propertyId?: number;
            checkIn?: string;
            checkOut?: string;
            adults?: number;
            children?: number;
            infants?: number;
            pets?: number;
            totalPrice?: number;
            hostMessage?: string;
            paymentTiming?: string;
            propertyTitle?: string;
            propertyImageUrl?: string;
            propertyLocation?: string;
            propertyType?: string;
            hostName?: string;
            pricePerNight?: number;
            subtotal?: number;
            taxes?: number;
        };

        if (
            typeof propertyId !== 'number'
            || !checkIn
            || !checkOut
            || typeof totalPrice !== 'number'
        ) {
            return res.status(400).json({ error: 'Некорректные данные бронирования' });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({ error: 'Дата выезда должна быть позже даты заезда' });
        }

        const conflict = await hasBookingConflict(propertyId, checkIn, checkOut);
        if (conflict) {
            return res.status(409).json({ error: 'На выбранные даты жильё уже занято' });
        }

        const result = await pool.query(
            `INSERT INTO bookings (
                user_id, property_id, check_in, check_out,
                adults, children, infants, pets, total_price,
                host_message, payment_timing, status,
                property_title, property_image_url, property_location,
                property_type, host_name, price_per_night, subtotal, taxes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING *`,
            [
                req.userId,
                propertyId,
                checkIn,
                checkOut,
                adults ?? 1,
                children ?? 0,
                infants ?? 0,
                pets ?? 0,
                totalPrice,
                hostMessage?.trim() || null,
                paymentTiming || null,
                'confirmed',
                propertyTitle?.trim() || null,
                propertyImageUrl?.trim() || null,
                propertyLocation?.trim() || null,
                propertyType?.trim() || null,
                hostName?.trim() || null,
                typeof pricePerNight === 'number' ? pricePerNight : null,
                typeof subtotal === 'number' ? subtotal : null,
                typeof taxes === 'number' ? taxes : null,
            ],
        );

        res.status(201).json({ booking: formatBooking(result.rows[0]) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// --- ЗАЯВКИ ХОЗЯЕВ ---
app.post('/host-applications', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        let userId: number | null = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
                userId = decoded.userId;
            } catch {
                userId = null;
            }
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            city,
            propertyType,
            rooms,
            description,
        } = req.body as {
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            city?: string;
            propertyType?: string;
            rooms?: string;
            description?: string;
        };

        if (
            !firstName?.trim()
            || !lastName?.trim()
            || !email?.trim()
            || !phone?.trim()
            || !city?.trim()
            || !propertyType?.trim()
            || !description?.trim()
        ) {
            return res.status(400).json({ error: 'Заполните все обязательные поля' });
        }

        const result = await pool.query(
            `INSERT INTO host_applications (
                user_id, first_name, last_name, email, phone,
                city, property_type, rooms, description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, created_at`,
            [
                userId,
                firstName.trim(),
                lastName.trim(),
                email.trim(),
                phone.trim(),
                city.trim(),
                propertyType.trim(),
                rooms?.trim() || null,
                description.trim(),
            ],
        );

        res.status(201).json({
            id: result.rows[0].id,
            createdAt: result.rows[0].created_at,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// --- ПРОФИЛЬ ---
app.get('/users/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = $1',
            [req.userId],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({ user: formatUser(result.rows[0]) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.patch('/users/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { firstName, lastName, email, phone } = req.body as {
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
        };

        const trimmedFirstName = firstName?.trim();
        const trimmedLastName = lastName?.trim();
        const trimmedEmail = email?.trim().toLowerCase();
        const trimmedPhone = phone?.trim() ?? '';

        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail) {
            return res.status(400).json({ error: 'Заполните имя, фамилию и email' });
        }

        const result = await pool.query(
            `UPDATE users
             SET first_name = $1, last_name = $2, email = $3, phone = $4
             WHERE id = $5
             RETURNING id, first_name, last_name, email, phone, created_at`,
            [trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPhone || null, req.userId],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({ user: formatUser(result.rows[0]) });
    } catch (err: unknown) {
        console.error(err);
        const pgError = err as { code?: string };
        if (pgError.code === '23505') {
            return res.status(409).json({ error: 'Этот email уже используется' });
        }
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.put('/users/me/password', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body as {
            currentPassword?: string;
            newPassword?: string;
        };

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Введите текущий и новый пароль' });
        }

        if (newPassword.length < 8 || !/\d/.test(newPassword)) {
            return res.status(400).json({ error: 'Новый пароль должен быть не короче 8 символов и содержать цифру' });
        }

        const result = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.userId],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash as string);
        if (!isValid) {
            return res.status(401).json({ error: 'Неверный текущий пароль' });
        }

        const isSame = await bcrypt.compare(newPassword, result.rows[0].password_hash as string);
        if (isSame) {
            return res.status(400).json({ error: 'Новый пароль не должен совпадать с текущим' });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [passwordHash, req.userId],
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// --- РЕГИСТРАЦИЯ ---
app.post('/register', async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body as {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
        };

        const trimmedFirstName = firstName?.trim();
        const trimmedLastName = lastName?.trim();
        const trimmedEmail = email?.trim().toLowerCase();

        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !password) {
            return res.status(400).json({ error: 'Заполните все поля' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен быть не короче 6 символов' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password_hash)
             VALUES ($1, $2, $3, $4)
             RETURNING id, first_name, last_name, email, created_at`,
            [trimmedFirstName, trimmedLastName, trimmedEmail, passwordHash],
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'Регистрация успешна',
            token,
            user: formatUser(user),
        });
    } catch (err: unknown) {
        console.error(err);
        const pgError = err as { code?: string };
        if (pgError.code === '23505') {
            return res.status(409).json({ error: 'Этот email уже зарегистрирован' });
        }
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// --- ВХОД ---
app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        const trimmedEmail = email?.trim().toLowerCase();

        if (!trimmedEmail || !password) {
            return res.status(400).json({ error: 'Введите email и пароль' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: formatUser(user),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

const startServer = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ PostgreSQL подключена');
        await initDatabase();
        console.log('✅ Таблицы готовы');

        app.listen(PORT, () => {
            console.log(`🚀 API: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Не удалось запустить сервер:', err instanceof Error ? err.message : err);
        process.exit(1);
    }
};

startServer();