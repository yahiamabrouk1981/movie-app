import { getGenres } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const genres = await getGenres();
    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}
