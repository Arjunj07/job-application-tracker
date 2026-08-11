import { ChevronRight } from "lucide-react";

function PipelineGrid() {
  const pipelines = [
    { title: "Saved", value: 0 },
    { title: "Applied", value: 0 },
    { title: "Screening", value: 0 },
    { title: "Assessment", value: 0 },
    { title: "Interview", value: 0 },
    { title: "Final Interview", value: 0 },
    { title: "Offer", value: 0 },
  ];
  return (
    <div className="pipeline-section">
      <h3 className="pipeline-section-title">Application Pipeline</h3>
      <div className="pipeline-container">
        {pipelines.map((pipeline, index) => (
          <div key={index} className="pipeline-wrapper">
            <div className="pipeline-card">
              <div className="pipeline-info">
                <p className="pipeline-title">{pipeline.title}</p>
                <h3 className="pipeline-value">{pipeline.value}</h3>
              </div>
            </div>
            {index < pipelines.length - 1 && (
              <ChevronRight className="pipeline-arrow" size={16} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PipelineGrid;
