"use client";

import { useCallback, useEffect, useState } from "react";
import { SituationAttempt, UserMemory } from "@/types";
import { loadMemory, recordAttempt, resetMemory } from "@/lib/storage/userMemory";

export function useUserMemory() {
  const [memory, setMemory] = useState<UserMemory | null>(null);

  useEffect(() => {
    setMemory(loadMemory());
  }, []);

  const saveAttempt = useCallback((attempt: SituationAttempt) => {
    const updated = recordAttempt(attempt);
    setMemory({ ...updated });
  }, []);

  const clear = useCallback(() => {
    resetMemory();
    setMemory(loadMemory());
  }, []);

  return { memory, saveAttempt, clear };
}
