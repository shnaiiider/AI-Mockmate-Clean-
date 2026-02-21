"use server";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { UserAnswer } from "@/utils/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq, desc } from "drizzle-orm";

export async function createMockInterview({
  aiResponse,
  jobRole,
  jobDesc,
  jobExperience,
  createdBy
}) {
  const resp = await db
    .insert(MockInterview)
    .values({
      mockId: uuidv4(),
      jsonMockResp: aiResponse,
      jobPosition: jobRole,
      jobDesc: jobDesc,
      jobExperience: jobExperience,
      createdBy,
      createdAt: moment().format("YYYY-MM-DD")
    })
    .returning({ mockId: MockInterview.mockId });

  return resp;
}

export async function getUserInterviews(email) {
  if (!email) return [];

  return await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));
}

export async function getInterviewById(interviewId) {
  if (!interviewId) return null;

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.mockId, interviewId));

  return result.length > 0 ? result[0] : null;
}

export async function getInterviewForStart(interviewId) {
  console.log("🧠 interviewId from URL:", interviewId);

  const all = await db.select().from(MockInterview);
  console.log("📦 ALL ROWS IN DB:", all);

  const match = all.find((r) => r.mockId === interviewId);
  console.log("🎯 MATCH FOUND:", match);

  return match ?? null;
}

export async function evaluateAndSaveAnswer({
  question,
  correctAns,
  userAns,
  mockId,
  userEmail
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt =
    "Question: " +
    question +
    ", User Answer: " +
    userAns +
    ", Give overall rating out of 10 with feedback in JSON";

  const result = await model.generateContent(prompt);
  const text = result.response
    .text()
    .replaceAll("```json", "")
    .replaceAll("```", "");

  const feedbackJson = JSON.parse(text);

  await db.insert(UserAnswer).values({
    mockIdRef: mockId,
    question,
    correctAns,
    userAns,
    feedback: feedbackJson.feedback,
    rating: feedbackJson.rating,
    userEmail,
    createdAt: moment().format("DD-MM-YYYY")
  });

  return feedbackJson;
}
