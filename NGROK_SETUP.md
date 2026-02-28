# NGROK SETUP FOR LOCALHOST TESTING

## Steps:

1. **Start ngrok** (in a new terminal):
```bash
ngrok http 3001
```

2. **Copy the URL** from ngrok output (looks like: https://abc-123-xyz.ngrok-free.app)

3. **Update backend/.env**:
```
BASE_URL=https://YOUR-NGROK-URL-HERE
```

4. **Restart backend server**:
```bash
cd backend
npm start
```

5. **Test the call** - Click "Test Call Now" button

Now Twilio can reach your localhost through ngrok!

## Why This Works:
- Localhost: Your computer (Twilio can't reach it)
- Ngrok: Public URL that tunnels to your localhost
- Twilio → Ngrok → Your localhost → Voice response
