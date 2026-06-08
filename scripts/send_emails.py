import os
import csv
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

BASE = os.path.dirname(os.path.abspath(__file__))

def load_env(path):
    if not os.path.exists(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

load_env(os.path.join(BASE, "..", ".env"))

SMTP_HOST = "smtp.zoho.com"
SMTP_PORT = 587
SMTP_USER = "support@numitz.com"
SMTP_PASS = os.environ.get("ZOHO_PASSWORD")

if not SMTP_PASS:
    raise ValueError("ZOHO_PASSWORD not set in .env or environment")

TEMPLATE = """Hi {first_name},

Egyptian Math League (EML) is set to today at 5:00pm on Numitz platform. Check here: https://www.numitz.com/ 

If you aren't already join the whatsapp group where you can send any malfunctions you have with the contest, and chat with other participants: https://chat.whatsapp.com/D5WbyUAIBxj3ku1d3Ju8GO

Those are your login credentials:
username: {username}
password: {password}

To login follow the instructions:

1. If you're already signed in, log out of your current account
  on PC: click on your icon on the top right, and choose log out
  on mobile: Click on Profile on the bottom right, scroll a little, click log out.

2. Sign in with the credentials above. Find sign in button on the top right corner. (copy credentials as they are)

How does the contest work?
On 5pm, open the platform, go to live (or upcoming) tab in 'contests' and enter the contest. From there it's straight forwared to navigate. (If you have any issues send in group chat)"""

def send_email(to_email, username, password, first_name):
    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = "Egyptian Math League (EML) - Your Login Credentials"

    body = TEMPLATE.format(first_name=first_name, username=username, password=password)
    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USER, SMTP_PASS)
    server.sendmail(SMTP_USER, to_email, msg.as_string())
    server.quit()

# --- Test with single recipient (comment this block when ready to send bulk) ---
# send_email("amrbeducation@gmail.com", "pikiller219", "amrbassem222", "Amr")
# print("Test email sent to amrbeducation@gmail.com")

# --- Bulk send from CSV ---
csv_path = os.path.join(BASE, "..", "data", "more.csv")

with open(csv_path) as f:
    rows = list(csv.DictReader(f))

fieldnames = rows[0].keys()
if "sent" not in fieldnames:
    fieldnames = list(fieldnames) + ["sent"]

for i, row in enumerate(rows, 1):
    if row.get("sent", "").strip().lower() == "yes":
        print(f"[{i}] Skipping {row['email']} (already sent)")
        continue

    email = row["email"].strip()
    username = row["username"].strip()
    password = row["password"].strip()
    first_name = row["first_name"].strip()
    print(f"[{i}] Sending to {email}...")
    try:
        send_email(email, username, password, first_name)
        row["sent"] = "yes"
        print(f"[{i}] Sent to {email}")
    except Exception as e:
        row["sent"] = f"failed: {e}"
        print(f"[{i}] FAILED for {email}: {e}")

    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    time.sleep(5)
