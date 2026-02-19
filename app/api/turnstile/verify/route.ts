import { NextRequest, NextResponse } from "next/server"

type TurnstileResponse = {
  success: boolean
  "error-codes"?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { token } = (await request.json()) as { token?: string }

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 })
    }

    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Server missing TURNSTILE_SECRET_KEY" },
        { status: 500 }
      )
    }

    const forwardedFor = request.headers.get("x-forwarded-for")
    const remoteIp = forwardedFor?.split(",")[0]?.trim()

    const formData = new FormData()
    formData.append("secret", secret)
    formData.append("response", token)
    if (remoteIp) formData.append("remoteip", remoteIp)

    const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      cache: "no-store",
    })

    if (!verifyResponse.ok) {
      return NextResponse.json({ success: false, error: "Turnstile verify failed" }, { status: 502 })
    }

    const result = (await verifyResponse.json()) as TurnstileResponse
    return NextResponse.json(
      {
        success: Boolean(result.success),
        errors: result["error-codes"] ?? [],
      },
      { status: result.success ? 200 : 400 }
    )
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
