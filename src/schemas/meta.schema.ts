import { z } from 'zod';

export const lastUpdateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestampUnix: z.number(),
});

export type LastUpdateResponse = z.infer<typeof lastUpdateResponseSchema>;