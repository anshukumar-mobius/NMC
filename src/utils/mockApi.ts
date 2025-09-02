import usersData from '../mock/users.json';
import patientsData from '../mock/patients.json';
import okrsData from '../mock/okrs.json';
import kpisData from '../mock/kpis.json';
import rulesData from '../mock/rules.json';
import encountersData from '../mock/encounters.json';
import codesData from '../mock/codes.json';
import claimsData from '../mock/claims.json';
import sourcesData from '../mock/sources.json';
import agentsData from '../mock/agents.json';
import auditEventsData from '../mock/auditEvents.json';
import { debugAuditEvents } from './auditUtils';

// Simulate API latency
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Users API
  async getUsers() {
    await delay(300);
    return usersData.users;
  },

  async getUserById(id: string) {
    await delay(200);
    return usersData.users.find(user => user.id === id);
  },

  // Patients API
  async getPatients() {
    await delay(600);
    return patientsData.patients;
  },

  async getPatientById(id: string) {
    await delay(400);
    return patientsData.patients.find(patient => patient.id === id);
  },

  async searchPatients(query: string) {
    await delay(350);
    return patientsData.patients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(query.toLowerCase())
    );
  },

  // OKRs API
  async getOKRs() {
    await delay(400);
    return okrsData.okrs;
  },

  // KPIs API
  async getKPIs() {
    await delay(350);
    return kpisData.kpis;
  },

  // Rules API
  async getRules() {
    await delay(500);
    return rulesData.rules;
  },

  async getRuleById(id: string) {
    await delay(300);
    return rulesData.rules.find(rule => rule.id === id);
  },

  // Encounters API
  async getEncounters() {
    await delay(450);
    return encountersData.encounters;
  },

  async getEncountersByPatientId(patientId: string) {
    await delay(350);
    return encountersData.encounters.filter(encounter => encounter.patientId === patientId);
  },

  // Codes API
  async getICDCodes() {
    await delay(300);
    return codesData.icdCodes;
  },

  async getCPTCodes() {
    await delay(300);
    return codesData.cptCodes;
  },

  // Claims API
  async getClaims() {
    await delay(500);
    return claimsData.claims;
  },

  async getPreAuths() {
    await delay(400);
    return claimsData.preAuths;
  },
  
  // Audit Events API
  async getAuditEvents() {
    await delay(450);
    console.log("Mock API - auditEventsData:", auditEventsData);
    try {
      // Use the debug utility to ensure proper structure
      const processedEvents = debugAuditEvents(auditEventsData);
      console.log("Processed audit events:", processedEvents.length);
      return processedEvents;
    } catch (error) {
      console.error("Error processing audit events:", error);
      return [];
    }
  },

  async getAuditEventById(id: string) {
    await delay(300);
    return auditEventsData.auditEvents.find(event => event.id === id);
  },

  // Sources API
  async getSources() {
    await delay(350);
    return sourcesData.sources;
  },

  // Agents API
  // async getAgents() {
  //   await delay(400);
  //   return agentsData.agents;
  // },

  async toggleAgent(id: string) {
    await delay(200);
    const agent = agentsData.agents.find(a => a.id === id);
    if (agent) {
      agent.enabled = !agent.enabled;
      agent.status = agent.enabled ? 'active' : 'inactive';
    }
    return agent;
  }
};