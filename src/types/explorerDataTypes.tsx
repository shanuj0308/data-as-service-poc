export type ExplorerItem = {
  item_id: string;
  item_name: string;
  item_type?: "pdf" | "zip" | "docx" | "folder";
  size?: number;
  isFolder: boolean;
  items: ExplorerItem[];
};

export type ExplorerData = {
  item_id: string;
  item_name: string;
  isFolder: boolean;
  item_type?: "pdf" | "zip" | "docx" | "folder";
  last_accessed?: string;
  size?: number;
  items: ExplorerItem[];
};
