export interface Schedule {
  name: string;
  origin: {
    name: string;
    instance: string;
    label: string;
  };
  isEnabled: boolean;
  upsert: string;
  removal: string;
}
