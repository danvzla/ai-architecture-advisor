/**
 * agent-05-data-platform.js
 * Data & Platform Agent — RAG pipeline design, data readiness assessment, platform architecture.
 * Receives: Agents 01-04 results.
 * Output feeds into Agent 06 (Governance) and Agent 07 (Roadmap).
 */
window.Agent05DataPlatform = {
  id:      'data',
  name:    'Data & Platform Agent',
  icon:    'ti-database',
  color:   'var(--teal)',
  mission: 'RAG pipeline design · data readiness · platform architecture',
  tokens:  2500,

  buildPrompt(answers, prior) {
    const architecture = prior['architecture'] || {};
    const capability   = prior['capability']   || {};
    return `You are a Senior AI Data Architecture and Platform Engineer.
Assess data readiness, design the RAG pipeline, and define the platform architecture.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 25 words.

CONTEXT:
Industry: ${answers.industry}
Data sources: ${(answers.knowledgeSources || []).join(', ')}
Data quality: ${answers.dataQuality}
Sensitive data: ${answers.sensitiveData}
Access control: ${answers.accessControl}
Deployment model: ${answers.deploymentModel}
Cloud platform: ${answers.cloudPlatform}
Integrations: ${(answers.integrations || []).join(', ')}
Architecture pattern: ${architecture.architecturePattern || capability.recommendedPattern || ''}

Return:
{
  "dataReadinessAssessment": {
    "overall": "Ready or Partially Ready or Not Ready",
    "score": 60,
    "gaps": ["gap 1", "gap 2"],
    "remediationRequired": ["action 1 before production", "action 2"]
  },
  "ragPipelineDesign": {
    "ingestionStrategy": "how documents and data are ingested",
    "chunkingStrategy": "chunking approach and chunk size recommendation",
    "embeddingModel": "specific embedding model recommended",
    "vectorStore": "specific vector store recommended and why",
    "retrievalStrategy": "hybrid search or dense or sparse — and why",
    "rerankingStrategy": "reranking approach if needed",
    "contextWindowManagement": "how context is managed for the LLM"
  },
  "platformArchitecture": {
    "inferenceLayer": "where and how LLM inference runs",
    "orchestrationLayer": "orchestration framework and why",
    "observabilityStack": ["tool 1 — purpose", "tool 2 — purpose"],
    "cachingStrategy": "caching approach for cost and latency"
  },
  "integrationDesign": [
    {
      "system": "system name",
      "integrationMethod": "REST API or Webhook or Event stream or Batch",
      "dataFlow": "what data flows and in which direction",
      "authMethod": "OAuth2 or API Key or mTLS"
    }
  ],
  "dataGovernanceRequirements": ["requirement 1", "requirement 2", "requirement 3"]
}

Include 2-3 integration designs for the specified systems. Be specific about technology choices for ${answers.cloudPlatform}.`;
  },

  async run(apiKey, answers, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
