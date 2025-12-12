import React from 'react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks?: Task[];
  isAiGenerating?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export enum AppState {
  LANDING = 'LANDING',
  APP = 'APP'
}