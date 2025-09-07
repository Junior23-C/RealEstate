import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: "Socket endpoint available",
      path: "/api/socket"
    })
  } catch (error) {
    console.error('Socket route error:', error)
    return NextResponse.json(
      { error: "Socket route error" },
      { status: 500 }
    )
  }
}