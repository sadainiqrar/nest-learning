/* eslint-disable @typescript-eslint/no-empty-function */
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { User, UserType } from './user.entity';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should allow access if no roles are defined', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserType.USER } }),
      }),
      getHandler: () => {},
    } as ExecutionContext;

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has the required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([UserType.ADMIN]);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserType.ADMIN } }),
      }),
      getHandler: () => {},
    } as ExecutionContext;

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should deny access if user does not have the required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([UserType.ADMIN]);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserType.USER } }),
      }),
      getHandler: () => {},
    } as ExecutionContext;

    expect(rolesGuard.canActivate(context)).toBe(false);
  });
});
