import { ROLES } from "./constants";

type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Permission check: does `role` have `action` on `resource`?
 * This is the RBAC engine — called on every API route and Server Action.
 *
 * The full matrix is defined in 06-NORMALISATION.md §2.
 * This file implements the software-enforced subset.
 */

type Action = "create" | "read" | "update" | "delete" | "validate" | "export";

type Resource =
  | "user"
  | "client"
  | "dossier"
  | "visa"
  | "vol"
  | "hotel"
  | "chambre"
  | "transfer"
  | "programme"
  | "forfait"
  | "facture"
  | "paiement"
  | "depense"
  | "document"
  | "notification"
  | "rapport"
  | "parametre"
  | "agence"
  | "subscription"
  | "audit_log";

/** Permission matrix: role → resource → allowed actions. */
const PERMISSIONS: Record<Role, Record<Resource, Action[]>> = {
  [ROLES.SUPER_ADMIN]: {
    user: ["create", "read", "update", "delete"],
    client: ["create", "read", "update", "delete"],
    dossier: ["create", "read", "update", "delete"],
    visa: ["create", "read", "update", "delete"],
    vol: ["create", "read", "update", "delete"],
    hotel: ["create", "read", "update", "delete"],
    chambre: ["create", "read", "update", "delete"],
    transfer: ["create", "read", "update", "delete"],
    programme: ["create", "read", "update", "delete"],
    forfait: ["create", "read", "update", "delete"],
    facture: ["create", "read", "update", "delete", "validate"],
    paiement: ["create", "read", "update", "delete"],
    depense: ["create", "read", "update", "delete"],
    document: ["create", "read", "update", "delete"],
    notification: ["create", "read", "update", "delete"],
    rapport: ["read", "export"],
    parametre: ["create", "read", "update", "delete"],
    agence: ["create", "read", "update", "delete"],
    subscription: ["create", "read", "update", "delete"],
    audit_log: ["read"],
  },
  [ROLES.ADMIN]: {
    user: ["create", "read", "update", "delete"],
    client: ["create", "read", "update", "delete"],
    dossier: ["create", "read", "update", "delete"],
    visa: ["create", "read", "update", "delete"],
    vol: ["create", "read", "update", "delete"],
    hotel: ["create", "read", "update", "delete"],
    chambre: ["create", "read", "update", "delete"],
    transfer: ["create", "read", "update", "delete"],
    programme: ["create", "read", "update", "delete"],
    forfait: ["create", "read", "update", "delete"],
    facture: ["create", "read", "update", "delete", "validate"],
    paiement: ["create", "read", "update", "delete"],
    depense: ["create", "read", "update", "delete"],
    document: ["create", "read", "update", "delete"],
    notification: ["create", "read", "update", "delete"],
    rapport: ["read", "export"],
    parametre: ["create", "read", "update", "delete"],
    agence: ["read", "update"],
    subscription: ["read"],
    audit_log: ["read"],
  },
  [ROLES.MANAGER]: {
    user: ["read"],
    client: ["create", "read", "update"],
    dossier: ["create", "read", "update", "delete"],
    visa: ["create", "read", "update"],
    vol: ["create", "read", "update"],
    hotel: ["create", "read", "update"],
    chambre: ["read"],
    transfer: ["create", "read", "update"],
    programme: ["create", "read", "update"],
    forfait: ["create", "read", "update"],
    facture: ["read"],
    paiement: ["read"],
    depense: [],
    document: ["create", "read", "update"],
    notification: ["read"],
    rapport: ["read", "export"],
    parametre: [],
    agence: [],
    subscription: [],
    audit_log: ["read"],
  },
  [ROLES.AGENT]: {
    user: ["read"],
    client: ["create", "read", "update"],
    dossier: ["create", "read", "update"],
    visa: ["create", "read", "update"],
    vol: ["read"],
    hotel: ["read"],
    chambre: ["read"],
    transfer: ["read"],
    programme: ["read"],
    forfait: ["read"],
    facture: [],
    paiement: [],
    depense: [],
    document: ["create", "read", "update"],
    notification: ["read"],
    rapport: [],
    parametre: [],
    agence: [],
    subscription: [],
    audit_log: [],
  },
  [ROLES.COMPTABLE]: {
    user: ["read"],
    client: ["read"],
    dossier: ["read"],
    visa: [],
    vol: [],
    hotel: [],
    chambre: [],
    transfer: [],
    programme: [],
    forfait: [],
    facture: ["create", "read", "update", "delete", "validate"],
    paiement: ["create", "read", "update", "delete"],
    depense: ["create", "read", "update", "delete"],
    document: ["read"],
    notification: ["read"],
    rapport: ["read", "export"],
    parametre: [],
    agence: [],
    subscription: [],
    audit_log: ["read"],
  },
  [ROLES.GUIDE]: {
    user: [],
    client: ["read"],
    dossier: ["read"],
    visa: [],
    vol: ["read"],
    hotel: ["read"],
    chambre: [],
    transfer: [],
    programme: ["read"],
    forfait: ["read"],
    facture: [],
    paiement: [],
    depense: [],
    document: ["read"],
    notification: ["read"],
    rapport: [],
    parametre: [],
    agence: [],
    subscription: [],
    audit_log: [],
  },
  [ROLES.COMMERCIAL]: {
    user: [],
    client: ["create", "read"],
    dossier: ["create", "read"],
    visa: [],
    vol: ["read"],
    hotel: ["read"],
    chambre: [],
    transfer: [],
    programme: ["read"],
    forfait: ["read"],
    facture: ["read"],
    paiement: ["read"],
    depense: [],
    document: ["create", "read"],
    notification: ["read"],
    rapport: [],
    parametre: [],
    agence: [],
    subscription: [],
    audit_log: [],
  },
  [ROLES.CLIENT]: {
    user: [],
    client: ["read", "update"],
    dossier: ["read"],
    visa: ["read"],
    vol: ["read"],
    hotel: [],
    chambre: [],
    transfer: [],
    programme: ["read"],
    forfait: ["read"],
    facture: ["read"],
    paiement: ["create", "read"],
    depense: [],
    document: ["create", "read"],
    notification: ["read"],
    rapport: [],
    parametre: [],
    agence: [],
    subscription: [],
    audit_log: [],
  },
};

/**
 * Check if a role can perform an action on a resource.
 */
export function hasPermission(role: Role, action: Action, resource: Resource): boolean {
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  const actions = perms[resource];
  if (!actions) return false;
  return actions.includes(action);
}

/**
 * Check permissions against a user object.
 * Throws ForbiddenError if denied.
 */
export function requirePermission(
  userRole: string,
  action: Action,
  resource: Resource,
): void {
  if (!hasPermission(userRole as Role, action, resource)) {
    const { ForbiddenError } = require("./errors");
    throw new ForbiddenError(
      `Le rôle ${userRole} n'a pas l'action "${action}" sur "${resource}"`,
    );
  }
}
