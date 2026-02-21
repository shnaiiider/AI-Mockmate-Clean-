import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import React from "react";

const Feedback = ({ mockInterviewQuestion }) => {
  console.log({ mockInterviewQuestion });
  return (
    <div className="p-10">
      {Feedback?.length == 0 ? (
        <h2 className="text-primary text-lg my-3">No Records Found</h2>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-green-500">
            CONGRATULATIONS..
          </h2>
          <h2 className="font-bold text-2xl ">
            Here is your Interview Feedback
          </h2>

          <h2 className="text-primary text-lg my-3">
            Your overall Rating : 7/10
          </h2>

          <h2>
            Find below interview questions with correct answers and feedabck
          </h2>

          <div>
            {/* <Collapsible>
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7"></CollapsibleTrigger>
              <CollapsibleContent></CollapsibleContent>
            </Collapsible> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
