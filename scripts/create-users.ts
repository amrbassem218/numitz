import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { parse } from "csv-parse/sync";

dotenv.config({ path: path.resolve(__dirname, "../client/.env") });
dotenv.config({ path: path.resolve(__dirname, "../client/.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function parseFullName(
  fullName: string,
): { firstName: string; middleName: string | null; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) {
    return { firstName: "", middleName: null, lastName: "" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], middleName: null, lastName: parts[0] };
  }
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const middleName = parts.length > 2 ? parts.slice(1, -1).join(" ") : null;
  return { firstName, middleName, lastName };
}

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `eml_${suffix}`;
}

function sanitizeUsername(username: string): string {
  return username
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

async function buildAuthUserEmailMap(): Promise<Map<string, string>> {
  const emailToId = new Map<string, string>();
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) {
      console.error("Error listing auth users:", error);
      break;
    }
    for (const user of data.users) {
      if (user.email) {
        emailToId.set(user.email.toLowerCase(), user.id);
      }
    }
    if (data.users.length < perPage) break;
    page++;
  }

  console.log(`Found ${emailToId.size} existing auth users`);
  return emailToId;
}

async function main() {
  const csvPath = path.resolve(__dirname, "../data/eml.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[];

  console.log(`Loaded ${records.length} records from CSV`);

  const authUserMap = await buildAuthUserEmailMap();

  const outputRows: { email: string; username: string; password: string }[] = [];

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const fullName = record["Full Name"] || "";
    const usernameRaw = record["Username"] || "";
    const email = (record["Email"] || "").trim().toLowerCase();
    const phoneNumber = record["Phone number"] || "";
    const address = record["Address (Your address)"] || "";
    const city = record["City (Your address)"] || "";
    const country = record["Country (Your address)"] || "";
    const mathClub = record["Your Math club (optional, leave blank if not part of a club)"] || "";

    if (!email) {
      console.log(`Row ${i + 1}: Skipped - no email`);
      skipped++;
      continue;
    }

    const { firstName, middleName, lastName } = parseFullName(fullName);
    const username = sanitizeUsername(usernameRaw);

    // Check if profile already exists by email
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          username,
          email,
          country,
          math_club: mathClub || null,
          phone_number: phoneNumber || null,
          address: address || null,
          city: city || null,
        })
        .eq("id", existingProfile.id);

      const password = generatePassword();
      const { error: pwdError } = await supabase.auth.admin.updateUserById(
        existingProfile.id,
        { password },
      );

      if (pwdError) {
        console.error(`Row ${i + 1}: Error setting password for ${email}:`, pwdError.message);
        errors++;
      } else {
        console.log(`Row ${i + 1}: Updated ${email} password=${password}`);
        updated++;
      }
      outputRows.push({ email, username, password: pwdError ? "" : password });
      continue;
    }

    // Check if auth user exists
    const authUserId = authUserMap.get(email);

    if (authUserId) {
      await supabase.from("profiles").insert([
        {
          id: authUserId,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          username,
          email,
          country,
          math_club: mathClub || null,
          phone_number: phoneNumber || null,
          address: address || null,
          city: city || null,
        },
      ]);

      const password = generatePassword();
      const { error: pwdError } = await supabase.auth.admin.updateUserById(
        authUserId,
        { password },
      );

      if (pwdError) {
        console.error(`Row ${i + 1}: Error setting password for ${email}:`, pwdError.message);
        errors++;
      } else {
        console.log(`Row ${i + 1}: Set password for ${email} password=${password}`);
      }
      outputRows.push({ email, username, password: pwdError ? "" : password });
    } else {
      const password = generatePassword();
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (authError) {
        console.error(`Row ${i + 1}: Error creating auth user ${email}:`, authError.message);
        errors++;
        continue;
      }

      if (!authData.user) {
        console.error(`Row ${i + 1}: No user returned for ${email}`);
        errors++;
        continue;
      }

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          username,
          email,
          country,
          math_club: mathClub || null,
          phone_number: phoneNumber || null,
          address: address || null,
          city: city || null,
        },
      ]);

      if (profileError) {
        console.error(
          `Row ${i + 1}: Error creating profile for ${email}:`,
          profileError.message,
        );
        errors++;
      } else {
        console.log(`Row ${i + 1}: Created ${email} password=${password}`);
        created++;
      }
      outputRows.push({ email, username, password });
    }
  }

  const outputPath = path.resolve(__dirname, "../data/credentials.csv");
  const header = "email,username,password";
  const lines = outputRows.map(
    (r) => `${r.email},${r.username},${r.password}`,
  );
  fs.writeFileSync(outputPath, [header, ...lines].join("\n"), "utf-8");
  console.log(`\nCredentials written to data/credentials.csv (${outputRows.length} rows)`);

  console.log(`Created: ${created}, Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);
}

main();
