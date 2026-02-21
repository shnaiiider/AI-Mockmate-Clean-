"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getInterviewForStart } from "../../../action";

const StartInterview = () => {
  const { interviewId } = useParams();
  const [interviewData, setinterviewData] = useState();
  const [mockInterviewQuestion, setmockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setactiveQuestionIndex] = useState(0);
  useEffect(() => {
    GetInterviewDetails();
  }, []);
  const GetInterviewDetails = async () => {
    try {
      const result = await getInterviewForStart(interviewId);

      if (!result) {
        console.error("⚠️ No interview found!");
        return; // ⬅️ THIS MUST STOP EXECUTION
      }

      const rawText = result.jsonMockResp;

      const parsedData = JSON.parse(
        rawText.replaceAll("```json", "").replaceAll("```", "").trim()
      );

      setmockInterviewQuestion(parsedData);
      setinterviewData(result);
    } catch (error) {
      console.error("❌ Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-cols md:flex-row gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setactiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
          <Button
            onClick={() => setactiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
