// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"; // adjust path (@ = src/)

export const { GET, POST } = handlers;