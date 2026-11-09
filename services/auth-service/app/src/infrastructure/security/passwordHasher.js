import bcrypt from 'bcryptjs';

export class PasswordHasher {
  hash(plain) {
    return bcrypt.hash(plain, 12);
  }

  verify(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}
