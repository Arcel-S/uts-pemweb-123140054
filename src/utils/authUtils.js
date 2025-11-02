const USERS_KEY = 'newsportal_users';
const LOGGED_IN_USER_KEY = 'newsportal_current_user';

// Mengambil semua user dari localStorage
const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

// Mengambil user yang sedang login
export const getCurrentUser = () => {
    const username = localStorage.getItem(LOGGED_IN_USER_KEY);
    return username;
};

// Fungsi Pendaftaran (Diperbarui)
export const registerUser = (username, password) => {
    const users = getUsers();

    // --- VALIDASI BARU ---
    if (username.length < 3) {
        return { success: false, message: 'Username harus minimal 3 karakter.' };
    }
    if (password.length < 8) {
        return { success: false, message: 'Password harus minimal 8 karakter.' };
    }
    // --- AKHIR VALIDASI ---

    if (users[username]) {
        return { success: false, message: 'Username sudah terdaftar.' };
    }
    
    // Hash sederhana (untuk keperluan demo UTS)
    users[username] = { 
        passwordHash: btoa(password), // Menggunakan Base64 sebagai hash dummy
        favorites: [] // Setiap user memiliki list favorites kosong
    }; 

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Pendaftaran Berhasil!' };
};

// Fungsi Login
export const loginUser = (username, password) => {
    const users = getUsers();
    const user = users[username];

    if (!user || user.passwordHash !== btoa(password)) {
        return { success: false, message: 'Username atau Password salah.' };
    }

    // Set status login
    localStorage.setItem(LOGGED_IN_USER_KEY, username);
    return { success: true, message: 'Login Berhasil!', username };
};

// Fungsi Logout
export const logoutUser = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
};

// Fungsi untuk mengelola Favorites
export const updateFavorites = (username, favoritesList) => {
    const users = getUsers();
    if (users[username]) {
        users[username].favorites = favoritesList;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
};

export const getFavorites = (username) => {
    const users = getUsers();
    return users[username] ? users[username].favorites : [];
};