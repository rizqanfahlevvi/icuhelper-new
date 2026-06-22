export interface DrugItem {
  id?: string;
  name: string;
  brand_id?: string[];
  brand_id_notes?: string;
  class?: string;
  subclass?: string;
  category?: string[];
  common_in_id?: boolean;
  common_in_id_note?: string;
  mechanism?: string;
  pkpd_type?: string;
  pkpd_note?: string;
  spectrum?: any;
  indications?: any;
  contraindications?: string[];
  precautions?: string[];
  dosing?: any;
  renal_adjustment?: any;
  hepatic_adjustment?: any;
  pregnancy?: any;
  monitoring?: any;
  adverse_effects?: any;
  interactions?: any;
  stewardship?: any;
  high_alert?: boolean;
  high_alert_warnings?: string[];
  high_alert_protocol?: string;
  pump_link?: boolean;
  pump_drug_key?: string;
  evidence?: any[];
}

export type DrugDatabase = Record<string, DrugItem>;
