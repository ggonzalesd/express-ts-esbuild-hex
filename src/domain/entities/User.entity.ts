import { UserRoles, UserStates } from '.';
import { CoreError } from '@@core/errors';

export interface UserProps {
  display: string;
  username: string;
  email: string;
  password: string;

  id?: string;
  verified?: boolean;
  role?: UserRoles;
  state?: UserStates;
  createdAt?: Date;
}

export class User implements UserProps {
  readonly id?: string;
  readonly display: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly verified: boolean;
  readonly role: UserRoles;
  readonly state: UserStates;
  readonly createdAt?: Date;

  constructor(props: UserProps) {
    this.validateProps(props);
    this.validateExtraProps(props);

    this.display = props.display;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;

    this.verified = props.verified ?? false;
    this.role = props.role ?? UserRoles.USER;
    this.state = props.state ?? UserStates.ACTIVE;

    if (props.id) {
      this.id = props.id;
    }
    if (props.createdAt) {
      this.createdAt = props.createdAt;
    }
  }

  withPassword(password: string) {
    return new User({
      ...this,
      password,
    });
  }

  withVerified(verified: boolean) {
    return new User({
      ...this,
      verified,
    });
  }

  validateProps(props: UserProps) {
    if (!props.display) {
      throw CoreError.badRequest('Display name is required');
    }

    if (!props.username) {
      throw CoreError.badRequest('Username is required');
    }

    if (!props.email) {
      throw CoreError.badRequest('Email is required');
    }

    if (!props.password) {
      throw CoreError.badRequest('Password is required');
    }
  }

  validateExtraProps(extra: UserProps) {
    if (extra.id && typeof extra.id !== 'string') {
      throw CoreError.badRequest('Id must be a string');
    }

    if (extra.verified && typeof extra.verified !== 'boolean') {
      throw CoreError.badRequest('Verified must be a boolean');
    }

    if (extra.role && !Object.values(UserRoles).includes(extra.role)) {
      throw CoreError.badRequest(
        `Role must be one of ${Object.values(UserRoles).join(', ')}`,
      );
    }

    if (extra.state && !Object.values(UserStates).includes(extra.state)) {
      throw CoreError.badRequest(
        `State must be one of ${Object.values(UserStates).join(', ')}`,
      );
    }

    if (extra.createdAt && !(extra.createdAt instanceof Date)) {
      throw CoreError.badRequest('CreatedAt must be a date');
    }
  }
}
