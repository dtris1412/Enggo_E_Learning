# Email Verification System Implementation

## ✅ Completed Changes

### 1. Database Migration

**File**: [server/src/migrations/20260422120000-add-email-verified-at-to-users.cjs](server/src/migrations/20260422120000-add-email-verified-at-to-users.cjs)

Added new column to users table:

- `email_verified_at` (DATE, nullable) - Timestamp when email was verified

### 2. Updated User Model

**File**: [server/src/models/user.js](server/src/models/user.js)

Added field to User model:

```javascript
email_verified_at: DataTypes.DATE,
```

### 3. Refactored Authentication Service

**File**: [server/src/shared/services/authService.js](server/src/shared/services/authService.js)

#### New Helper Function

- `sendOTPEmail(user_email, otp)` - Sends OTP via email using Nodemailer

#### Refactored Functions

**`register()` - Step 1 (Generate OTP, NO DB SAVE)**

- Validates email/password format
- Checks for duplicate username/email
- Generates 6-digit OTP
- Stores OTP in memory with 5-minute expiration
- Sends OTP via email
- Stores registration data temporarily for verification step
- Returns success message (user NOT saved to DB yet)

**`verifyEmail()` - Step 2 (Verify OTP & Create User) - NEW**

- Verifies OTP validity and expiration
- Creates user in database with `email_verified_at` set to current time
- Creates user wallet with free plan tokens
- Creates subscription
- Sends welcome email
- Generates JWT tokens (access + refresh)
- Returns user, tokens, and success message

**`login()` - Updated**

- Added check: `if (!user.email_verified_at)` → Reject login if email not verified
- Error message: "Please verify your email before logging in."

#### Updated Exports

```javascript
export {
  register,
  verifyEmail, // NEW
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
```

### 4. Updated Auth Controller

**File**: [server/src/shared/controllers/authController.js](server/src/shared/controllers/authController.js)

#### New Controller Function

**`verifyEmail(req, res)`**

- Expects POST body: `{ user_email, otp }`
- Calls `verifyEmailService()`
- Returns user data + tokens on success

#### Updated Imports & Exports

- Imported `verifyEmail as verifyEmailService`
- Added `verifyEmail` to exports

### 5. Updated Routes

**File**: [server/src/shared/routes/sharedRoute.js](server/src/shared/routes/sharedRoute.js)

Added new route:

```javascript
router.post("/api/auth/verify-email", verifyEmail);
```

---

## 📋 Updated Registration Flow

### Before

```
User registers → Save to DB → Login → Done
```

### After (NEW)

```
User registers → Validation → Generate OTP → Send email → (NOT saved to DB)
     ↓
User receives OTP in email
     ↓
User submits OTP → Verify OTP → Create user in DB → Assign tokens → Done
     ↓
User can now login with verified email
```

---

## 🔌 API Endpoints

### 1. Step 1: Register (Generate OTP)

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "user_name": "john_doe",
  "user_email": "john@example.com",
  "user_password": "Password123",
  "full_name": "John Doe",
  "user_phone": "0123456789",
  "user_address": "123 Main St",
  "avatar": null,
  "user_status": true,
  "role": 2
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify within 5 minutes."
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Username or email already exists."
}
```

### 2. Step 2: Verify Email (Verify OTP & Create User)

**POST** `/api/auth/verify-email`

**Request Body:**

```json
{
  "user_email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully. Welcome to Enggo Learning!",
  "user": {
    "user_id": 1,
    "user_name": "john_doe",
    "user_email": "john@example.com",
    "full_name": "John Doe",
    "email_verified_at": "2026-04-22T12:34:56.000Z",
    ...
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses (400):**

```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

```json
{
  "success": false,
  "message": "OTP has expired"
}
```

### 3. Step 3: Login (Now checks email verified)

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "user_name": "john_doe",
  "user_password": "Password123",
  "remember": true
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {...},
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Please verify your email before logging in."
}
```

---

## 🔧 OTP Configuration

- **Length**: 6 digits
- **Expiration**: 5 minutes
- **Storage**: In-memory (otpStore object)
- **Email Delivery**: Gmail via Nodemailer

### Environment Variables Needed

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

---

## 📁 Files Modified/Created

### Created

- [server/src/migrations/20260422120000-add-email-verified-at-to-users.cjs](server/src/migrations/20260422120000-add-email-verified-at-to-users.cjs)

### Modified

- [server/src/models/user.js](server/src/models/user.js) - Added `email_verified_at` field
- [server/src/shared/services/authService.js](server/src/shared/services/authService.js) - Major refactor
- [server/src/shared/controllers/authController.js](server/src/shared/controllers/authController.js) - Added `verifyEmail` controller
- [server/src/shared/routes/sharedRoute.js](server/src/shared/routes/sharedRoute.js) - Added verify-email route

---

## 🚀 Running Migrations

Before running the server, you need to run the migration to add the `email_verified_at` column:

```bash
# Using Sequelize CLI
npx sequelize-cli db:migrate

# Or use the following command if sequelize-cli is installed globally
sequelize db:migrate
```

If you don't have sequelize-cli installed, install it:

```bash
npm install --save-dev sequelize-cli
```

---

## ✨ Features

✅ **Two-step registration** - OTP verification before account creation
✅ **Email verification** - Required before login
✅ **Auto-generated OTP** - 6-digit code with 5-minute expiration
✅ **Email delivery** - Via Nodemailer + Gmail
✅ **User wallet creation** - Automatic after email verification
✅ **Free subscription** - Auto-assigned to new users
✅ **Welcome email** - Sent after account creation
✅ **Error handling** - Comprehensive error messages

---

## 🔐 Security Considerations

1. **OTP Storage**: Currently in-memory. For production with multiple servers, consider:
   - Redis for persistent, distributed OTP storage
   - Add OTP attempt rate limiting
   - Add brute force protection

2. **Password Requirements**:
   - Min 6 characters
   - Must contain uppercase + lowercase + digit
   - Hashed with bcrypt (10 salt rounds)

3. **Email Verification**:
   - Link expires after 5 minutes
   - OTP deleted after use (no reuse)
   - Can request new OTP multiple times

---

## 🧪 Testing Guide

### Test Case 1: Successful Registration & Email Verification

```bash
# 1. Register (get OTP in email)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "testuser",
    "user_email": "test@example.com",
    "user_password": "Test123"
  }'

# 2. Verify email (check email for OTP, replace with actual OTP)
curl -X POST http://localhost:8080/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "otp": "123456"
  }'

# 3. Login (now should work)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "testuser",
    "user_password": "Test123"
  }'
```

### Test Case 2: Invalid OTP

```bash
curl -X POST http://localhost:8080/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "otp": "000000"
  }'
# Expected: Error - "Invalid OTP"
```

### Test Case 3: Expired OTP

Wait 5+ minutes, then try to verify

```bash
curl -X POST http://localhost:8080/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "otp": "123456"
  }'
# Expected: Error - "OTP has expired"
```

### Test Case 4: Login before verification

Try to login without verifying email

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "unverifieduser",
    "user_password": "Password123"
  }'
# Expected: Error - "Please verify your email before logging in."
```

---

## 🐛 Troubleshooting

### "Failed to send OTP email"

- Check `EMAIL_USER` and `EMAIL_PASS` environment variables
- Make sure Gmail app-specific password is used (not regular password)
- Enable "Less secure app access" if needed

### "OTP sent but not received"

- Check spam/junk folder
- Verify email address is correct
- Check mail server logs

### "User not found after OTP verification"

- Registration data may have expired
- Try registering again
- Check if `email_verified_at` field exists in database

### Migration fails

- Ensure database connection is working
- Run migration from server directory: `cd server && npx sequelize-cli db:migrate`
- Check database permissions

---

## 📝 Next Steps

For production, consider:

1. **Redis Integration** - Replace in-memory OTP storage

   ```javascript
   import redis from "redis";
   const client = redis.createClient();
   // Store OTP in Redis with expiration
   ```

2. **Rate Limiting** - Prevent OTP brute force

   ```javascript
   const rateLimit = require("express-rate-limit");
   const verifyLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5,
   });
   ```

3. **SMS Verification** - Add phone verification
   - Integrate Twilio or similar service
   - Add `phone_verified_at` field

4. **Audit Logging** - Track verification attempts
   - Log OTP generations
   - Log verification attempts
   - Store in database for audit trail

5. **Email Templates** - Use HTML templates
   - Already implemented (see sendOTPEmail function)
   - Can be moved to template files for cleaner code

---

## 📞 Questions & Support

For issues or questions, check:

- Error messages returned by API
- Server console logs
- Database logs
- Email delivery logs (Gmail settings)
