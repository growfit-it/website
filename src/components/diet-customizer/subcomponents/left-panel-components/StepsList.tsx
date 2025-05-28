import React from 'react';

interface StepsListProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepsList({ currentStep, onStepClick }: StepsListProps) {
  const steps = [
    { number: 1, title: '01 Set your preferences' },
    { number: 2, title: '02 Select meals' },
  ];

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <button
          key={step.number}
          onClick={() => onStepClick(step.number)}
          className={`w-full text-left font-helvetica text-base transition-colors ${
            currentStep === step.number
              ? 'text-[#051425]'
              : 'text-[#051425] opacity-50'
          }`}
        >
          {currentStep === step.number ? `${step.title} →` : step.title}
        </button>
      ))}
    </div>
  );
}