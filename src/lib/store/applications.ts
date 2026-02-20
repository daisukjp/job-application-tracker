"use client";

import { create } from "zustand";

export type Application = {
  id: string;
  company: string;
  roleTitle: string;
  status: "Draft" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedAt: string;
  source: string | null;
  location: string | null;
  notesPreview: string | null;
  notes?: string | null;
};

type ApplicationState = {
  applications: Application[];
  getById: (id: string) => Application | undefined;
  createApplication: (application: Application) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
};

// Initial Mock Data
const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-001",
    company: "Notion",
    roleTitle: "Frontend Engineer",
    status: "Applied",
    appliedAt: "2025-12-02T10:00:00.000Z",
    source: "Referral",
    location: "Remote",
    notesPreview: "Sent portfolio and a short intro note.",
    notes: "Sent portfolio and a short intro note."
  },
  {
    id: "app-002",
    company: "Figma",
    roleTitle: "Product Engineer",
    status: "Interviewing",
    appliedAt: "2025-12-10T09:30:00.000Z",
    source: "Company Site",
    location: "San Francisco, CA",
    notesPreview: "Phone screen scheduled for next week.",
    notes: "Phone screen scheduled for next week."
  },
  {
    id: "app-003",
    company: "Linear",
    roleTitle: "UI Engineer",
    status: "Rejected",
    appliedAt: "2025-11-20T18:15:00.000Z",
    source: "LinkedIn",
    location: "Remote",
    notesPreview: "Polite rejection after initial review.",
    notes: "Polite rejection after initial review."
  }
];

// Zustand store
export const useApplicationsStore = create<ApplicationState>((set, get) => ({
  applications: INITIAL_APPLICATIONS,

  getById: (id) => {
    const { applications } = get();
    return applications.find((app) => app.id === id);
  },

  createApplication: (application) => {
    set((state) => ({
      applications: [application, ...state.applications]
    }));
  },

  updateApplication: (id, patch) => {
    set((state) => ({
      applications: state.applications.map((app) => {
        if (app.id === id) {
          return app;
        }

        return {
          ...app,
          ...patch,
          notesPreview:
            typeof patch.notes === "string" ? patch.notes.slice(0, 60) : app.notesPreview
        };
      })
    }));
  }
}));
