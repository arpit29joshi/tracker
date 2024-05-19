import { connect } from "@/dbConfig/dbConfig";
import checkToken from "@/helpers/checkToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("jwt")?.value || "";
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("jwt")?.value || "";
    const userId = checkToken(token);
    return NextResponse.json({ userId: "asdf" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
