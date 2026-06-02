const steps = [
  {
    id: 1,
    title: "Workspace Details",
    subtitle: "Complete basic configuration",
    state: "complete" as const,
  },
  {
    id: 2,
    title: "Setup Information",
    subtitle: "Add ownership and project details",
    state: "active" as const,
  },
  {
    id: 3,
    title: "Upload Documents",
    subtitle: "Attach supporting files",
    state: "pending" as const,
  },
  {
    id: 4,
    title: "Review & Submit",
    subtitle: "Confirm and finalize submission",
    state: "pending" as const,
  },
];

export default function StepsPanel() {
  return (
    <aside className="steps-panel" aria-label="Form steps">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className={`step-item ${step.state}`}>
            <div className="step-marker-wrap">
              <span className="step-marker">{step.state === "complete" ? "v" : step.id}</span>
              {!isLast && <span className="step-line" aria-hidden="true" />}
            </div>
            <div className="step-text">
              <p>{step.title}</p>
              <small>{step.subtitle}</small>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
