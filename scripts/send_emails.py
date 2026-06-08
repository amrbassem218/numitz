import os
import csv
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
SMTP_USER = "amr@numitz.com"
SMTP_PASS = os.environ.get("ZOHO_PASSWORD")

if not SMTP_PASS:
    raise ValueError("ZOHO_PASSWORD not set in .env or environment")

def send_email(to_email, username, password):
    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = "Your Mathforces Account Credentials"

    body = f"Username: {username}\nPassword: {password}"
    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USER, SMTP_PASS)
    server.sendmail(SMTP_USER, to_email, msg.as_string())
    server.quit()

# --- Test with single recipient (comment this block when ready to send bulk) ---
send_email("amrbeducation@gmail.com", "pikiller219", "amrbassem222")
print("Test email sent to amrbeducation@gmail.com")

# --- Bulk send from CSV (uncomment below to use) ---
# with open(os.path.join(BASE, "..", "data", "credentials.csv")) as f:
#     reader = csv.DictReader(f)
#     for row in reader:
#         email = row["email"].strip()
#         username = row["username"].strip()
#         password = row["password"].strip()
#         print(f"Sending to {email}...")
#         send_email(email, username, password)
#         print(f"Sent to {email}")
