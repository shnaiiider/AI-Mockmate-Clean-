"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { evaluateAndSaveAnswer } from "../../../../action";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setloading] = useState(false);
  const { user } = useUser();
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join(" ");
          setUserAnswer(transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
        };

        recognitionRef.current = recognition;
      } else {
        console.error(
          "Speech Recognition API is NOT supported in this browser."
        );
      }
    }
  }, []);

  const handleRecording = async () => {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition is not available.");
      return;
    }

    if (isRecording) {
      setloading(true);
      recognitionRef.current.stop();
      setIsRecording(false);

      if (!userAnswer || userAnswer.length < 5) {
        toast.error("Answer is too short. Please try again.");
        return;
      }

      toast.success("Answer recorded successfully!");
      // Optionally store the answer in DB here
      const feedbackPrompt =
        "Question" +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ",Useranswer " +
        userAnswer +
        "Depending upon user answer for the given interview question give us overall rating out of 10" +
        ",in JSON format";

      const feedback = await evaluateAndSaveAnswer({
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        mockId: interviewData?.mockId,
        userEmail: user?.primaryEmailAddress?.emailAddress
      });

      toast.success("Answer evaluated & saved!");

      if (resp) {
        toast("User Answer Recorded");
      }
      setloading(false);

      const JsonFeedbackresp = JSON.parse(mockJsonresp);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-secondary rounded-lg p-5">
      <Webcam
        mirrored={true}
        style={{ height: 300, width: "100%", zIndex: 10 }}
      />
      <Button
        variant={isRecording ? "destructive" : "outline"}
        className="my-10"
        onClick={handleRecording}
      >
        {isRecording ? "🔴 Recording..." : "🎤 Start Recording"}
      </Button>
      <p className="text-lg mt-4">{userAnswer}</p>
    </div>
  );
};

export default RecordAnswerSection;
