export interface PortDetailed {
    port_id: number;
    port_name: string;
    coop: {
      coop_code: number;
      coop_name: string;
      region: {
        region_code: number;
        region_name: string;
      };
    };
  }
  