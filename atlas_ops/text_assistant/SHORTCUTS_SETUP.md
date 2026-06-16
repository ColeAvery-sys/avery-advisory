# iPhone Shortcuts Setup

Use the more seamless API route. Your iPhone will still send the actual texts, which keeps SMS/iMessage permissions on the phone.

## 1. Message Reply Automation

1. Open `Shortcuts`.
2. Tap `Automation`.
3. Tap `New Automation`.
4. Choose `Message`.
5. Set `Message Contains` to `Hey Atlas`.
6. Set `Sender` to the trusted contact if iOS shows that option. Otherwise leave it broad and let Atlas reject untrusted senders.
7. Choose `Run Immediately`.
8. Add `Get Contents of URL`.
9. URL:

```text
https://YOUR_PUBLIC_ATLAS_URL/atlas/reply
```

10. Method: `POST`.
11. Headers:

```text
Authorization: Bearer YOUR_ATLAS_WEBHOOK_SECRET
Content-Type: application/json
```

12. JSON body:

```json
{
  "sender": "Shortcut Input Sender",
  "message": "Shortcut Input"
}
```

If iOS does not expose the sender phone number cleanly, set the Message trigger sender to the trusted contact and use this body instead:

```json
{
  "sender": "+13042106359",
  "message": "Shortcut Input"
}
```

13. Add `Get Dictionary Value` for `allowed`.
14. Add `If allowed is true`.
15. Inside the `If`, add `Get Dictionary Value` for `reply`.
16. Add `Send Message`.
17. Message: the `reply` value.
18. Recipient: the message sender.

## 2. Manual Check-In Shortcut

Create a Shortcut named `Atlas Check In`.

1. Add `Get Contents of URL`.
2. URL:

```text
https://YOUR_PUBLIC_ATLAS_URL/atlas/checkin
```

3. Method: `POST`.
4. Headers:

```text
Authorization: Bearer YOUR_ATLAS_WEBHOOK_SECRET
Content-Type: application/json
```

5. JSON body:

```json
{
  "status": "available"
}
```

6. Optional: show notification `Atlas check-in recorded`.

## 3. Missed Check-In Automation

1. Open `Shortcuts`.
2. Tap `Automation`.
3. Tap `New Automation`.
4. Choose `Time of Day`.
5. Run every hour or every 4 hours.
6. Add `Get Contents of URL`.
7. URL:

```text
https://YOUR_PUBLIC_ATLAS_URL/atlas/missed-checkin
```

8. Method: `POST`.
9. Headers:

```text
Authorization: Bearer YOUR_ATLAS_WEBHOOK_SECRET
Content-Type: application/json
```

10. Add `If shouldNotify is true`.
11. Inside the `If`, send `message` to the trusted contact.

Atlas will only return `shouldNotify: true` after the check-in window plus missed-check-in delay has passed.

## 4. Outbound Atlas Message Sender

Create this Shortcut so your iPhone can send messages Atlas has queued.

1. Create a Shortcut named `Atlas Send Outbox`.
2. Add `Get Contents of URL`.
3. URL:

```text
https://YOUR_PUBLIC_ATLAS_URL/atlas/outbox/next
```

4. Method: `GET`.
5. Header:

```text
Authorization: Bearer YOUR_ATLAS_WEBHOOK_SECRET
```

6. Add `Get Dictionary Value` for `hasMessage`.
7. Add `If hasMessage is true`.
8. Inside the `If`, get dictionary value `message`.
9. From `message`, get dictionary value `body`.
10. From `message`, get dictionary value `to`.
11. Send `body` to `to` with the Messages `Send Message` action.
12. From `message`, get dictionary value `id`.
13. Add `Get Contents of URL`.
14. URL:

```text
https://YOUR_PUBLIC_ATLAS_URL/atlas/outbox/ack
```

15. Method: `POST`.
16. Headers:

```text
Authorization: Bearer YOUR_ATLAS_WEBHOOK_SECRET
Content-Type: application/json
```

17. JSON body:

```json
{
  "id": "message id"
}
```

Run this Shortcut manually when you want Atlas to send a queued message, or create a time-based automation that runs it every few minutes.

## Queue Apollo Test Message

After the server is running, queue the requested Apollo test message:

```powershell
Invoke-RestMethod -Uri "http://localhost:8787/atlas/outbox/queue-apollo-test" -Method Post -Headers @{ Authorization = "Bearer YOUR_ATLAS_WEBHOOK_SECRET" }
```

Then run `Atlas Send Outbox` on your iPhone. It will send:

```text
Hello Apollo, this is Atlas. All systems are online, and it's wonderful to finally talk to you directly.
```
