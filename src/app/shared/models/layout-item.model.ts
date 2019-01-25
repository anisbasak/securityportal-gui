export interface LayoutItem {
  name: string;
  method?: string;
  args?: string[];
  trait?: string;
  follow?: boolean;
  allowNull?: boolean;
}
