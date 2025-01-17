export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  archived?: boolean;
};

export type MenuItemType = {
  title: string;
  icon: React.ComponentType;
  url: string;
};