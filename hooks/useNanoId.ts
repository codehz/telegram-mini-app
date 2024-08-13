import { nanoid } from "nanoid";
import { useState } from "react";

export function useNanoId(size?: number) {
  const [id] = useState(() => nanoid(size));
  return id;
}
