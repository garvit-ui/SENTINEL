# Auth Testing Playbook (Sentinel admin)

Step 1: MongoDB Verification
```
mongosh
use <database_name>
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, indexes exist on users.email (unique), login_attempts.identifier, waitlist.email (unique).

Step 2: API Testing
```
curl -c cookies.txt -X POST <BACKEND_URL>/api/auth/login -H "Content-Type: application/json" -d '{"email":"<admin email>","password":"<admin password>"}'
cat cookies.txt
curl -b cookies.txt <BACKEND_URL>/api/auth/me
```
Login should return the admin user object and set `access_token` + `refresh_token` httpOnly cookies. `/me` returns the same user. Admin endpoints (`/api/admin/waitlist`, `/api/admin/waitlist/export`) require the access cookie; `/api/auth/refresh` rotates the access token using the refresh cookie. 5 failed logins lock the account for 15 minutes.
