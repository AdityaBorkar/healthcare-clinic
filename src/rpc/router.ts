import { getSession } from "./procedures/auth";
import {
  getCurrentOrganization,
  getOrganizationBySubdomain,
  listOrganizations,
  updateCurrentOrganization,
} from "./procedures/organizations";
import { createServiceProvider, listServiceProviders } from "./procedures/service-providers";
import { listTenants, onboardTenant } from "./procedures/tenants";
import { createUser, getUser, listUsers, removeUser, updateUser } from "./procedures/users";

export const router = {
  auth: {
    getSession,
  },
  organizations: {
    bySubdomain: getOrganizationBySubdomain,
    current: getCurrentOrganization,
    list: listOrganizations,
    update: updateCurrentOrganization,
  },
  serviceProviders: {
    create: createServiceProvider,
    list: listServiceProviders,
  },
  tenants: {
    list: listTenants,
    onboard: onboardTenant,
  },
  users: {
    create: createUser,
    get: getUser,
    list: listUsers,
    remove: removeUser,
    update: updateUser,
  },
};
