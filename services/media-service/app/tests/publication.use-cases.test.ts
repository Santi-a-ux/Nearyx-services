import { describe, expect, it } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError, MissingCredentialsError, PublicationNotFoundError } from '../src/application/errors';
import { CreatePublication } from '../src/application/use-cases/publications/CreatePublication';
import { DeletePublication } from '../src/application/use-cases/publications/DeletePublication';
import { GetPublication } from '../src/application/use-cases/publications/GetPublication';
import { ListPublications } from '../src/application/use-cases/publications/ListPublications';
import { RestorePublication } from '../src/application/use-cases/publications/RestorePublication';
import type { AuthUser } from '../src/domain/models/AuthUser';
import type { Publication } from '../src/domain/models/Publication';
import type {
  IPublicationRepository,
  NewPublication,
  PagedItems,
  PublicationChanges,
  PublicationFilters,
} from '../src/domain/repository/IPublicationRepository';
import { requireRole } from '../src/interface/middlewares/requireRole';

class InMemoryPublications implements IPublicationRepository {
  private items: Publication[] = [];

  async list(filters: PublicationFilters, page: number, limit: number): Promise<PagedItems<Publication>> {
    const matching = this.items.filter((p) => filters.state === 'all' || p.state === filters.state);
    return { items: matching.slice((page - 1) * limit, page * limit), total: matching.length };
  }

  async findById(id: string, options?: { includeDeleted?: boolean }): Promise<Publication | null> {
    return (
      this.items.find((p) => p.id === id && (options?.includeDeleted || p.state === 'active')) ?? null
    );
  }

  async create(data: NewPublication): Promise<Publication> {
    const now = new Date();
    const publication: Publication = {
      id: `post-${this.items.length + 1}`,
      ...data,
      state: 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(publication);
    return publication;
  }

  async update(id: string, changes: PublicationChanges): Promise<Publication> {
    return this.replace(id, { ...changes });
  }

  async softDelete(id: string): Promise<void> {
    this.replace(id, { state: 'deleted' });
  }

  async restore(id: string): Promise<Publication> {
    return this.replace(id, { state: 'active' });
  }

  private replace(id: string, patch: Partial<Publication>): Publication {
    const index = this.items.findIndex((p) => p.id === id);
    const updated = { ...this.items[index], ...patch } as Publication;
    this.items[index] = updated;
    return updated;
  }
}

const author: AuthUser = { userId: 'user-author', role: 'student' };
const stranger: AuthUser = { userId: 'user-stranger', role: 'student' };
const admin: AuthUser = { userId: 'user-admin', role: 'admin' };

const newPost = (authorId: string) => ({ authorId, authorName: 'Ana', content: 'Hola mundo' });

describe('publication use cases', () => {
  it('no permite publicar a nombre de otro usuario', async () => {
    const repo = new InMemoryPublications();
    await expect(new CreatePublication(repo).execute(stranger, newPost(author.userId))).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it('solo el autor o un admin pueden eliminar; el borrado es lógico', async () => {
    const repo = new InMemoryPublications();
    const post = await new CreatePublication(repo).execute(author, newPost(author.userId));
    const remove = new DeletePublication(repo);

    await expect(remove.execute(stranger, post.id)).rejects.toBeInstanceOf(ForbiddenError);

    await remove.execute(admin, post.id);
    await expect(new GetPublication(repo).execute(post.id)).rejects.toBeInstanceOf(PublicationNotFoundError);
    expect(await repo.findById(post.id, { includeDeleted: true })).not.toBeNull();
  });

  it('solo un admin puede restaurar una publicación', async () => {
    const repo = new InMemoryPublications();
    const post = await new CreatePublication(repo).execute(author, newPost(author.userId));
    await new DeletePublication(repo).execute(author, post.id);
    const restore = new RestorePublication(repo);

    await expect(restore.execute(author, post.id)).rejects.toBeInstanceOf(ForbiddenError);
    expect((await restore.execute(admin, post.id)).state).toBe('active');
  });

  it('devuelve data y pagination con totalPages', async () => {
    const repo = new InMemoryPublications();
    const create = new CreatePublication(repo);
    for (let i = 0; i < 5; i += 1) await create.execute(author, newPost(author.userId));

    const result = await new ListPublications(repo).execute({ page: 1, limit: 2 });

    expect(result.data).toHaveLength(2);
    expect(result.pagination).toEqual({ total: 5, currentPage: 1, limit: 2, totalPages: 3 });
  });
});

describe('requireRole', () => {
  const run = (user: AuthUser | undefined) => {
    let called = false;
    const next: NextFunction = () => {
      called = true;
    };
    const call = () => requireRole('admin')({ user } as Request, {} as Response, next);
    return { call, wasCalled: () => called };
  };

  it('sin sesión responde 401', () => {
    expect(run(undefined).call).toThrow(MissingCredentialsError);
  });

  it('con un rol sin permiso responde 403', () => {
    expect(run(author).call).toThrow(ForbiddenError);
  });

  it('deja pasar a un admin', () => {
    const { call, wasCalled } = run(admin);
    call();
    expect(wasCalled()).toBe(true);
  });
});
