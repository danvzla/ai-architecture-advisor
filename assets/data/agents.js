/**
 * agents.js
 * Agent registry — ordered list of all agents in pipeline sequence.
 * Each entry references the agent object loaded by its individual script file.
 * To add a new agent: create agent-09-xxx.js and add it here.
 */
window.AGENT_REGISTRY = [
  window.Agent01Discovery,
  window.Agent02Outcome,
  window.Agent03Capability,
  window.Agent04Architecture,
  window.Agent05DataPlatform,
  window.Agent06Governance,
  window.Agent07Roadmap,
  window.Agent08Value,
];
