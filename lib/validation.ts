import { z } from "zod";

const dateString = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const timeEntrySchema = z.object({
  action: z.enum(["start", "stop"])
});

export const calendarEntrySchema = z.object({
  title: z.string().min(2),
  start: dateString,
  end: dateString,
  location: z.string().min(2),
  notes: z.string().optional().nullable(),
  category: z.enum(["probe", "show", "aufbau", "abbau"]),
  assignedUserIds: z.array(z.string()).optional().default([])
});

export const eventSchema = z.object({
  name: z.string().min(2),
  start: dateString,
  end: dateString,
  venue: z.string().min(2),
  contact: z.string().min(2),
  status: z.enum(["geplant", "aktiv", "abgeschlossen"]).optional(),
  notes: z.string().optional().nullable(),
  checklist: z
    .array(z.object({ area: z.string(), text: z.string(), done: z.boolean().optional() }))
    .optional()
    .default([]),
  equipment: z
    .array(
      z.object({
        itemName: z.string(),
        quantity: z.number().int().min(1),
        condition: z.string(),
        storageLocation: z.string(),
        reserved: z.boolean().optional()
      })
    )
    .optional()
    .default([])
});

export const bookingSchema = z.object({
  requesterName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  eventTitle: z.string().min(2),
  start: dateString,
  end: dateString,
  location: z.string().min(2),
  audienceSize: z.number().int().min(1),
  techNeedsCategories: z.array(z.string()).default([]),
  techNeedsText: z.string().optional().nullable(),
  budget: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
  honey: z.string().optional()
});

export const adminVerifySchema = z.object({
  password: z.string().min(6)
});

export const userCreateSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["member", "admin"]),
  active: z.boolean().default(true)
});

export const userUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["member", "admin"]).optional(),
  active: z.boolean().optional()
});

export const requestStatusSchema = z.object({
  status: z.enum(["neu", "in_pruefung", "angenommen", "abgelehnt"]),
  assignedToUserId: z.string().optional().nullable(),
  internalNote: z.string().optional().nullable()
});

export const requestCommentSchema = z.object({
  text: z.string().min(2)
});
