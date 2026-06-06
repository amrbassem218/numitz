import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, apiError } from "@/lib/api/response";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export async function GET() {
  const supabase = createSupabaseServiceClient();

  // 1. Upsert profile
  const { data: existing, error: lookupError } = await supabase
    .from("profiles")
    .select("id, username, bio, elo_rating, contribution_rating, country, math_club, followers_count, following_count")
    .eq("username", "pikiller219")
    .single();

  let userId: string;
  const profileData = {
    username: "pikiller219",
    bio: "Competitive mathematician. ELO 1934 and climbing. Math is life.",
    elo_rating: 1934,
    contribution_rating: 87,
    country: "Egypt",
    math_club: "Alexandria Math Circle",
    followers_count: 142,
    following_count: 89,
    image_url: null as string | null,
  };

  if (existing) {
    userId = existing.id;
    const { error: updateErr } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId);
    if (updateErr) return apiError(updateErr.message, 500);
  } else {
    const { data: created, error: createErr } = await supabase
      .from("profiles")
      .insert({ ...profileData, email: "pikiller219@example.com", first_name: "Piki", last_name: "Ller" })
      .select("id")
      .single();
    if (createErr) return apiError(createErr.message, 500);
    userId = created!.id;
  }

  // 2. Seed blogs
  const blogTitles = [
    "Why ELO is the best rating system",
    "Solving Diophantine equations with modular arithmetic",
    "My approach to combinatorics problems",
    "Understanding the Riemann zeta function",
    "Top 10 math contest strategies",
  ];
  const blogContents = [
    "ELO rating systems have been used in chess for decades, but they work just as well for competitive mathematics. In this post, I'll explain why...",
    "Diophantine equations can be tricky, but with modular arithmetic, we can simplify them significantly. Let's walk through some examples...",
    "Combinatorics is all about counting. Here's my systematic approach to solving combinatorial problems in contests...",
    "The Riemann zeta function is one of the most important functions in mathematics. Here's an intuitive introduction...",
    "After participating in dozens of math contests, here are my top 10 strategies that have consistently helped me perform well...",
  ];

  const { data: existingBlogs } = await supabase
    .from("blogs")
    .select("id")
    .eq("user_id", userId);
  if (!existingBlogs || existingBlogs.length === 0) {
    const blogInserts = blogTitles.map((title, i) => ({
      user_id: userId,
      title,
      content: blogContents[i],
      created_at: dateStr(i * 30 + 10),
      updated_at: dateStr(i * 30 + 10),
      likes_count: randomInt(5, 50),
      comments_count: randomInt(0, 15),
      published: true,
    }));
    const { error: blogErr } = await supabase.from("blogs").insert(blogInserts);
    if (blogErr) return apiError(blogErr.message, 500);
  }

  // 3. Seed rating history (every ~2 weeks for 1 year)
  const { data: existingRating } = await supabase
    .from("rating_history")
    .select("id")
    .eq("user_id", userId)
    .limit(1);
  if (!existingRating || existingRating.length === 0) {
    const ratingPoints = [
      { rating: 1200, daysAgo: 365 },
      { rating: 1250, daysAgo: 350 },
      { rating: 1320, daysAgo: 335 },
      { rating: 1280, daysAgo: 320 },
      { rating: 1350, daysAgo: 305 },
      { rating: 1420, daysAgo: 290 },
      { rating: 1480, daysAgo: 275 },
      { rating: 1550, daysAgo: 260 },
      { rating: 1600, daysAgo: 245 },
      { rating: 1580, daysAgo: 230 },
      { rating: 1650, daysAgo: 215 },
      { rating: 1700, daysAgo: 200 },
      { rating: 1680, daysAgo: 185 },
      { rating: 1750, daysAgo: 170 },
      { rating: 1800, daysAgo: 155 },
      { rating: 1780, daysAgo: 140 },
      { rating: 1820, daysAgo: 125 },
      { rating: 1880, daysAgo: 110 },
      { rating: 1850, daysAgo: 95 },
      { rating: 1900, daysAgo: 80 },
      { rating: 1920, daysAgo: 65 },
      { rating: 1950, daysAgo: 50 },
      { rating: 1910, daysAgo: 35 },
      { rating: 1934, daysAgo: 20 },
    ];
    const ratingInserts = ratingPoints.map((p) => ({
      user_id: userId,
      rating: p.rating,
      contest_id: null,
      rank_in_contest: randomInt(1, 30),
      created_at: dateStr(p.daysAgo),
    }));
    const { error: ratingErr } = await supabase
      .from("rating_history")
      .insert(ratingInserts);
    if (ratingErr) return apiError(ratingErr.message, 500);
  }

  // 4. Seed submissions (for activity overview)
  const { data: existingSubs } = await supabase
    .from("submissions")
    .select("id")
    .eq("user_id", userId)
    .limit(1);
  if (!existingSubs || existingSubs.length === 0) {
    const subInserts = [];
    for (let daysAgo = 0; daysAgo < 365; daysAgo++) {
      const prob = Math.random();
      const count = prob > 0.7 ? randomInt(1, 8) : 0;
      if (count > 0) {
        const day = new Date();
        day.setDate(day.getDate() - daysAgo);
        for (let i = 0; i < count; i++) {
          const h = randomInt(0, 23);
          const m = randomInt(0, 59);
          const s = randomInt(0, 59);
          day.setHours(h, m, s);
          subInserts.push({
            user_id: userId,
            problem_id: null,
            user_answer: String(randomInt(1, 999)),
            status: Math.random() > 0.4 ? "success" : "failure",
            score: Math.random() > 0.4 ? randomInt(50, 100) : randomInt(0, 49),
            created_at: day.toISOString(),
            display_id: `seed-${daysAgo}-${i}`,
          });
        }
      }
    }
    const { error: subErr } = await supabase
      .from("submissions")
      .insert(subInserts);
    if (subErr) return apiError(subErr.message, 500);
  }

  return json({
    success: true,
    message: "Profile pikiller219 seeded with test data",
  });
}
