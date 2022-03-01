import { createContext } from "react"
import { CollaborationClient } from "./CollaborationClient"

export const CollaborationClientContext = createContext<CollaborationClient | undefined>(undefined)
