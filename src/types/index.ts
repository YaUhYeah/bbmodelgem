export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface BBModel {
  id: string;
  name: string;
  prompt: string;
  created_at: string;
  user_id: string;
  status: string;
  preview_url?: string;
}

export interface BBModelResponse {
  model_id: string;
  status: string;
  message?: string;
  preview_url?: string;
  download_url?: string;
}

export interface BBModelElement {
  uuid: string;
  type: string;
  name: string;
  origin: [number, number, number];
  rotation: [number, number, number];
  vertices?: number[][];
  faces?: number[][];
}

export interface BBModelAnimation {
  name: string;
  uuid: string;
  loop: string;
  length: number;
  snapping: number;
  animators: Record<string, any>;
}

export interface BBModelFile {
  meta: Record<string, any>;
  name: string;
  model_format: string;
  box_uv: boolean;
  texture_width: number;
  texture_height: number;
  elements: BBModelElement[];
  outliner: Record<string, any>[];
  animations: BBModelAnimation[];
  resolution: Record<string, number>;
}