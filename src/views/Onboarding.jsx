import { useState } from "react";

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Understand your gut health patterns",
      text: "Track symptoms in under 1 minute a day and build a clearer picture of your health over time.",
    },
    {
      title: "Get useful weekly insights",
      text: "Your check-ins help generate weekly summaries, symptom trends, trigger patterns, and doctor-ready notes.",
    },
    {
      title: "No perfect entries needed",
      text: "Consistency matters more than precision. A quick check-in is better than no check-in.",
    },
    {
      title: "Start your first check-in",
      text: "Log today’s symptoms to begin building your personal health timeline.",
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  function handleNext() {
    if (isLastStep) {
      onComplete();
      return;
    }

    setStep((current) => current + 1);
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <main className="onboarding-page">
      <section className="onboarding-card">
        <p className="onboarding-step">
          Step {step + 1} of {steps.length}
        </p>

        <h1>{currentStep.title}</h1>
        <p>{currentStep.text}</p>

        <div className="onboarding-progress">
          {steps.map((_, index) => (
            <span
              key={index}
              className={
                index === step
                  ? "onboarding-dot active"
                  : "onboarding-dot"
              }
            />
          ))}
        </div>

        <div className="onboarding-actions">
          {step > 0 && (
            <button type="button" className="secondary-button" onClick={handleBack}>
              Back
            </button>
          )}

          <button type="button" className="primary-button" onClick={handleNext}>
            {isLastStep ? "Start First Check-In" : "Next"}
          </button>
        </div>
      </section>
    </main>
  );
}