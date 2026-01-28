# TuneLocal MySQL Database Installation Guide

## 📋 Prerequisites
- XAMPP installed and running
- Apache and MySQL services started

## 🚀 Installation Steps

### Step 1: Start XAMPP Services
1. Open **XAMPP Control Panel**
2. Start **Apache** service
3. Start **MySQL** service
4. Both should show green "Running" status

### Step 2: Import Database

#### Option A: Using phpMyAdmin (Recommended - Easy)
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on **"New"** in the left sidebar
3. Database name: `tunelocal`
4. Collation: `utf8mb4_unicode_ci`
5. Click **"Create"**
6. Select the `tunelocal` database from left sidebar
7. Click **"Import"** tab at the top
8. Click **"Choose File"** button
9. Navigate to: `C:\xampp\htdocs\TuneLocal\database\tunelocal.sql`
10. Click **"Go"** button at the bottom
11. Wait for success message: "Import has been successfully finished"

#### Option B: Using MySQL Command Line
1. Open Command Prompt (cmd)
2. Navigate to XAMPP MySQL bin folder:
   ```
   cd C:\xampp\mysql\bin
   ```
3. Login to MySQL:
   ```
   mysql -u root -p
   ```
   (Press Enter when asked for password - default is blank)
4. Run the SQL file:
   ```
   source C:\xampp\htdocs\TuneLocal\database\tunelocal.sql
   ```
5. Verify database created:
   ```
   SHOW DATABASES;
   USE tunelocal;
   SHOW TABLES;
   ```

### Step 3: Verify Installation
1. Go to phpMyAdmin: `http://localhost/phpmyadmin`
2. You should see `tunelocal` database in the left sidebar
3. Click on it to expand
4. You should see these tables:
   - ✅ `music_library` (for offline music)
   - ✅ `playlists` (for your playlists)
   - ✅ `saved_songs` (for saved Spotify/YouTube links)
   - ✅ `settings` (for app settings)
   - ✅ `library_stats` (view for statistics)

### Step 4: Test API Connection
1. Open your browser
2. Go to: `http://localhost/TuneLocal/api/music.php?action=list`
3. You should see JSON response:
   ```json
   {
     "success": true,
     "tracks": [],
     "count": 0
   }
   ```
4. If you see this, your API is working! ✅

### Step 5: Update Website to Use MySQL
The website will now automatically use MySQL instead of IndexedDB!
- All uploads go to MySQL database
- Unlimited storage (limited by your hard drive)
- Access from any browser
- Data persists even if you clear browser cache

## 📁 Database Structure

### music_library Table
- `id` - Unique track ID
- `name` - Track name (without extension)
- `file_name` - Original filename
- `file_type` - MIME type (audio/mpeg, video/mp4, etc.)
- `file_size` - File size in bytes
- `file_data` - Binary file data (LONGBLOB)
- `date_added` - Upload timestamp
- `last_played` - Last played timestamp
- `play_count` - Number of times played

### Storage Capacity
- **LONGBLOB** can store up to **4GB per file**
- **Total database size**: Limited by your hard drive
- Much better than browser storage limits!

## 🔧 Configuration

### Database Credentials
Location: `api/config.php`

Default settings:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Blank for XAMPP default
define('DB_NAME', 'tunelocal');
```

### If You Changed MySQL Password:
Edit `api/config.php` and update `DB_PASS` value.

## ✅ Verification Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `tunelocal` exists in phpMyAdmin
- [ ] All 4 tables are created
- [ ] API test returns JSON (http://localhost/TuneLocal/api/music.php?action=list)
- [ ] Website loads at http://localhost/TuneLocal/

## 🐛 Troubleshooting

### "Connection failed" Error
- Check MySQL is running in XAMPP
- Verify database name is exactly `tunelocal`
- Check credentials in `api/config.php`

### "Database not found" Error
- Re-import the SQL file
- Make sure you selected the correct file path

### API Returns Blank Page
- Check Apache is running
- Verify PHP is installed (XAMPP includes PHP)
- Check error logs: `C:\xampp\apache\logs\error.log`

### Upload Fails
- Check MySQL `max_allowed_packet` setting
- For large files, edit `C:\xampp\mysql\bin\my.ini`:
  ```
  max_allowed_packet=512M
  ```
- Restart MySQL service after changing

## 🎉 Success!

If all steps completed successfully:
1. Your database is ready
2. API is working
3. You can now upload unlimited music
4. Access your library from any browser
5. Data is safely stored in MySQL

## 📞 Need Help?

Check these files for errors:
- `C:\xampp\apache\logs\error.log`
- `C:\xampp\mysql\data\mysql_error.log`

Visit phpMyAdmin to manually inspect database:
- URL: `http://localhost/phpmyadmin`
- Database: `tunelocal`
