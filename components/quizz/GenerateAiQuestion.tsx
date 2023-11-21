import React from "react";
import TextForm from "./TextForm";

const GenerateAiQuestion = ({ countMax }: { countMax: number }) => {
  return (
    <div>
      <TextForm countMax={countMax} />
    </div>
  );
};

export default GenerateAiQuestion;
