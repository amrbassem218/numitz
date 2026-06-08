#!/usr/bin/env python3
"""Import Egyptian Math League contest from data/problems.csv through the contests API."""

from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


SCRIPT_DIR = Path(__file__).resolve().parent
CSV_PATH = SCRIPT_DIR.parent / "data" / "problems.csv"
API_URL = "http://localhost:3000/api/contests"
CONTEST_LENGTH_MINUTES = 90
DIFFICULTY = 1400
DESCRIPTION = "Egyptian Math League contest"


def read_rows(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open(newline="", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        if not reader.fieldnames or len(reader.fieldnames) < 2:
            raise ValueError("CSV must have at least two columns.")

        name_field = reader.fieldnames[0]
        latex_field = reader.fieldnames[1]
        rows: list[dict[str, str]] = []

        for line_number, row in enumerate(reader, start=2):
            name = (row.get(name_field) or "").strip()
            latex = (row.get(latex_field) or "").strip()

            if not name or not latex:
                print(
                    f"Skipping row {line_number}: missing name or latex.",
                    file=sys.stderr,
                )
                continue

            rows.append({"name": name, "latex": latex})

    return rows


def build_problem(row: dict[str, str], index: int) -> dict[str, Any]:
    return {
        "name": row["name"],
        "description_latex": row["latex"],
        "difficulty": DIFFICULTY,
        "points": None,
        "editorial": "",
        "answer": None,
        "index_in_contest": index,
    }


def build_contest(rows: list[dict[str, str]]) -> dict[str, Any]:
    contest_start = datetime(
        2026, 6, 8, 15, 0, 0, tzinfo=timezone.utc
    )  # 6pm UTC+3
    contest_end = datetime(
        2026, 6, 8, 16, 30, 0, tzinfo=timezone.utc
    )  # 7:30pm UTC+3

    return {
        "name": "Egyptian Math League",
        "description": DESCRIPTION,
        "difficulty": DIFFICULTY,
        "mode": "live",
        "status": "private",
        "start_date": contest_start.isoformat().replace("+00:00", "Z"),
        "end_date": contest_end.isoformat().replace("+00:00", "Z"),
        "length_in_minutes": CONTEST_LENGTH_MINUTES,
        "problems": [
            build_problem(row, index) for index, row in enumerate(rows)
        ],
    }


def post_contest(api_url: str, contest: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(contest).encode("utf-8")
    request = Request(
        api_url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    with urlopen(request, timeout=30) as response:
        response_body = response.read().decode("utf-8")
        return json.loads(response_body) if response_body else {}


def main() -> int:
    if not CSV_PATH.exists():
        print(f"CSV file not found: {CSV_PATH}", file=sys.stderr)
        return 1

    rows = read_rows(CSV_PATH)
    print(f"Read {len(rows)} problem(s) from CSV.", file=sys.stderr)

    if len(rows) == 0:
        print("No problems found in CSV.", file=sys.stderr)
        return 1

    contest = build_contest(rows)

    try:
        result = post_contest(API_URL, contest)
    except HTTPError as error:
        error_body = error.read().decode("utf-8", errors="replace")
        print(
            f"Failed to create contest: HTTP {error.code} {error_body}",
            file=sys.stderr,
        )
        return 1
    except URLError as error:
        print(f"Failed to reach {API_URL}: {error.reason}", file=sys.stderr)
        return 1

    contest_id = result.get("contest", {}).get("id", "unknown")
    print(f"Created Egyptian Math League with id {contest_id}")
    print(f"Contest has {len(contest['problems'])} problem(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
