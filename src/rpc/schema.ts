import {
  boolean,
  maxLength,
  minLength,
  nullable,
  object,
  optional,
  pipe,
  string,
} from "valibot";

export type {
  AddressFilters,
  BankAccountFilters,
  BranchFilters,
  BranchTreeNode,
  BranchType,
  ComplianceCategory,
  ComplianceFilters,
  ComplianceStatus,
  ConnectionFilters,
  ConnectionStatus,
  ConnectionType,
  CreateAddressInput,
  CreateBankAccountInput,
  CreateBranchInput,
  CreateComplianceDocumentInput,
  CreateConnectionInput,
  OrganizationStatus,
  UpdateAddressInput,
  UpdateBankAccountInput,
  UpdateBranchInput,
  UpdateBrandingInput,
  UpdateComplianceDocumentInput,
  UpdateConnectionInput,
  UpdateOrganizationInput,
} from "@aspen-os/organization";

export const OrganizationUpdateSchema = object({
  accentColor: optional(string()),
  address: optional(nullable(string())),
  email: optional(nullable(string())),
  industry: optional(nullable(string())),
  locale: optional(string()),
  name: optional(pipe(string(), minLength(1), maxLength(255))),
  phone: optional(nullable(string())),
  registrationNumber: optional(nullable(string())),
  taxId: optional(nullable(string())),
  timezone: optional(string()),
  website: optional(nullable(string())),
});

export const BrandingUpdateSchema = object({
  accentColor: optional(string()),
  logo: optional(nullable(string())),
  name: optional(pipe(string(), minLength(1), maxLength(255))),
});

export const ConnectionCreateSchema = object({
  contactEmail: optional(nullable(string())),
  contactPerson: optional(nullable(string())),
  contactPhone: optional(nullable(string())),
  createdBy: pipe(string(), minLength(1)),
  industry: optional(nullable(string())),
  name: pipe(string(), minLength(1)),
  notes: optional(nullable(string())),
  type: string(),
  website: optional(nullable(string())),
});

export const ConnectionUpdateSchema = object({
  contactEmail: optional(nullable(string())),
  contactPerson: optional(nullable(string())),
  contactPhone: optional(nullable(string())),
  industry: optional(nullable(string())),
  name: optional(string()),
  notes: optional(nullable(string())),
  type: optional(string()),
  website: optional(nullable(string())),
});

export const ConnectionFiltersInputSchema = object({
  search: optional(string()),
  status: optional(string()),
  type: optional(string()),
});

export const BranchCreateSchema = object({
  addressLine1: pipe(string(), minLength(1)),
  addressLine2: optional(nullable(string())),
  city: pipe(string(), minLength(1)),
  code: pipe(string(), minLength(2), maxLength(20)),
  country: pipe(string(), minLength(2), maxLength(2)),
  email: optional(nullable(string())),
  name: pipe(string(), minLength(1), maxLength(255)),
  phone: optional(nullable(string())),
  postalCode: optional(nullable(string())),
  state: optional(nullable(string())),
  type: string(),
});

export const BranchUpdateSchema = object({
  addressLine1: optional(string()),
  addressLine2: optional(nullable(string())),
  city: optional(string()),
  code: optional(string()),
  country: optional(string()),
  email: optional(nullable(string())),
  isActive: optional(boolean()),
  name: optional(string()),
  phone: optional(nullable(string())),
  postalCode: optional(nullable(string())),
  state: optional(nullable(string())),
  type: optional(string()),
});

export const BranchFiltersInputSchema = object({
  isActive: optional(boolean()),
  type: optional(string()),
});

export const BankAccountCreateSchema = object({
  accountHolderName: pipe(string(), minLength(1)),
  accountNumber: pipe(string(), minLength(1)),
  accountType: optional(nullable(string())),
  bankName: pipe(string(), minLength(1)),
  branchName: optional(nullable(string())),
  currency: optional(string()),
  isActive: optional(boolean()),
  isPrimary: optional(boolean()),
  routingNumber: optional(nullable(string())),
  swiftCode: optional(nullable(string())),
});

export const BankAccountUpdateSchema = object({
  accountHolderName: optional(string()),
  accountNumber: optional(string()),
  accountType: optional(nullable(string())),
  bankName: optional(string()),
  branchName: optional(nullable(string())),
  currency: optional(string()),
  isActive: optional(boolean()),
  isPrimary: optional(boolean()),
  routingNumber: optional(nullable(string())),
  swiftCode: optional(nullable(string())),
});

export const ComplianceCreateSchema = object({
  branch: optional(nullable(string())),
  category: string(),
  documentNumber: optional(nullable(string())),
  expiryDate: optional(string()),
  issueDate: optional(nullable(string())),
  issuingAuthority: optional(nullable(string())),
  name: pipe(string(), minLength(1)),
  notes: optional(nullable(string())),
  renewalFrequency: optional(string()),
});

export const ComplianceUpdateSchema = object({
  branch: optional(nullable(string())),
  category: optional(string()),
  documentNumber: optional(nullable(string())),
  expiryDate: optional(string()),
  issueDate: optional(nullable(string())),
  issuingAuthority: optional(nullable(string())),
  name: optional(string()),
  notes: optional(nullable(string())),
  renewalFrequency: optional(string()),
});

export const ComplianceFiltersInputSchema = object({
  branch: optional(string()),
  category: optional(string()),
  status: optional(string()),
});
