import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ExtractedOpportunity, StudentProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { opportunity, profile }: { opportunity: ExtractedOpportunity; profile: StudentProfile } = await req.json();

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Write a professional, concise cover letter / expression of interest email for this opportunity.

APPLICANT PROFILE:
- Name: ${profile.name}
- Degree: ${profile.degree}, Semester ${profile.semester}
- CGPA: ${profile.cgpa}
- Skills: ${profile.skills.join(", ")}
- Location: ${profile.location}
- Experience: ${profile.experience || "Student"}

OPPORTUNITY:
- Title: ${opportunity.title}
- Organization: ${opportunity.organization}
- Type: ${opportunity.type}
- Eligibility: ${opportunity.eligibility ?? "Not specified"}
- Deadline: ${opportunity.deadline ?? "Not specified"}
- Required Docs: ${opportunity.requiredDocs.join(", ") || "None listed"}

Instructions:
- Write a real, ready-to-send email. Not a template with [brackets].
- 3 short paragraphs: intro + why this fits + closing with call to action.
- Formal but not stiff. 200-250 words max.
- Start with "Subject: ..." on line 1, then a blank line, then the email body.
- End with the applicant's name.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });

    const letter = response.choices[0].message.content ?? "";
    return NextResponse.json({ letter });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
