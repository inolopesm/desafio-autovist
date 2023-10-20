export interface RemoveClientByIdRepository {
  removeById(id: string): Promise<void>;
}
