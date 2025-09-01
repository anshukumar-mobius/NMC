// Types for the auditEvents.json data
export interface AuditEventData {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  outcome: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  details: {
    description: string;
    changes?: Array<{
      field: string;
      oldValue: string;
      newValue: string;
    }>;
    metadata?: Record<string, any>;
  };
  category: string;
  severity: string;
  compliance: string[];
  location: string;
  deviceType: string;
}

// Mock API utility to debug and fix the audit events data
export function debugAuditEvents(jsonData: any): AuditEventData[] {
  try {
    if (!jsonData || !jsonData.auditEvents || !Array.isArray(jsonData.auditEvents)) {
      console.error('Invalid audit events data structure', jsonData);
      return [];
    }
    
    console.log('Raw audit events count:', jsonData.auditEvents.length);
    
    // Map the JSON data to the expected structure
    return jsonData.auditEvents.map((event: any): AuditEventData => ({
      id: event.id || '',
      timestamp: event.timestamp || new Date().toISOString(),
      userId: event.userId || '',
      userName: event.userName || '',
      userRole: event.userRole || '',
      action: event.action || '',
      resource: event.resource || '',
      resourceId: event.resourceId || '',
      outcome: event.outcome || 'success',
      ipAddress: event.ipAddress || '',
      userAgent: event.userAgent || '',
      sessionId: event.sessionId || '',
      details: {
        description: event.details?.description || '',
        changes: event.details?.changes || [],
        metadata: event.details?.metadata || {}
      },
      category: event.category || 'data_access',
      severity: event.severity || 'low',
      compliance: Array.isArray(event.compliance) ? event.compliance : [],
      location: event.location || '',
      deviceType: event.deviceType || 'desktop'
    }));
  } catch (error) {
    console.error('Error processing audit events:', error);
    return [];
  }
}
